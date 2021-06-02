module.exports = start;
let tp;
let variables = {}; // Format: {"variableName": "value"}. Used with {{VALUE:variable}}.

const defaultFolder = "/";
const defaultStartSymbol = "";

const FILE_NUMBER_REGEX = new RegExp(/([0-9]*)\.md$/);

const DATE_REGEX = new RegExp(/{{DATE}}|{{DATE:([^}\n\r]*)}}/);
const NAME_VALUE_REGEX = new RegExp(/{{NAME}}|{{VALUE}}/);
const VARIABLE_REGEX = new RegExp(/{{VALUE:([^\n\r}]*)}}/);
const DATE_VARIABLE_REGEX = new RegExp(/{{VDATE:([^\n\r},]*),\s*([^\n\r},]*)}}/);
const LINK_TO_CURRENT_FILE_REGEX = new RegExp(/{{LINKCURRENT}}/);

const MARKDOWN_FILE_EXTENSION_REGEX = new RegExp(/\.md$/);
const endsWithMd = (str) => MARKDOWN_FILE_EXTENSION_REGEX.test(str);

const NLDATES = app.plugins.plugins["nldates-obsidian"];

const error = (msg) => {
    errMsg = `QuickAdd: ${msg}`;
    console.log(errMsg);
    new Notice(errMsg, 5000);
    return new Error(errMsg);
};

const warn = (msg) => {
    console.log(`QuickAdd: ${msg}`);
    return null;
};

const clearGlobalVariables = () => { variables = {}; };

async function start(templater, choices) {
    if (!templater) throw error("templater not provided.");
    else tp = templater;
    if (!choices) throw error("no choices provided.");

    // Necessary. Clear variable store.
    clearGlobalVariables();

    const choice = await getChoice(choices);
    if (!choice) return;

    if (choice.captureTo && typeof choice.captureTo === "string") {
        await doQuickCapture(choice);
    } else if (choice.path && typeof choice.path === "string") {
        await addNewFileFromTemplate(choice);
    } else {
        throw error(`invalid choice: ${choice.option || choice}`);
    }
}

async function getChoice(choices) {
    const choice = await tp.system.suggester(choice => choice.option, choices);
    if (!choice) return warn("no choice selected.");

    return (choice.multi && choice.multi[Symbol.iterator]) ? await getChoice(choice.multi) : choice;
}

async function doQuickCapture(choice) {
    let filePath = endsWithMd(choice.captureTo) ?
        choice.captureTo : `${choice.captureTo}.md`;

    let input = checkIfNeedValueInput(choice) ? await promptForChoiceValue(choice) : "";
    if (typeof input !== "string") return warn("no input given.");

    filePath = await getFormattedValue(filePath, input);

    if (choice.task)
        input = `- [ ] ${input}`;

    if (choice.format && typeof choice.format === "string")
        input = await getFormattedValue(choice.format, input);

    if (await app.vault.adapter.exists(filePath)) {
        const file = await getFileByPath(filePath);

        const fileContent = await quickCaptureFileContentFormatter(choice, input, file);

        await app.vault.modify(file, fileContent);
    } else {
        const created = await createFileWithInput(filePath, input);
        if (!created) throw error("file could not be created.");
    }

    if (choice.appendLink)
        appendToCurrentLine(`[[${filePath}]]`);
}

function checkIfNeedValueInput(choice) {
    if (choice.path && NAME_VALUE_REGEX.test(choice.path)) return true;
    if (choice.format && NAME_VALUE_REGEX.test(choice.format)) return true;

    return false;
}

async function quickCaptureFileContentFormatter(choice, input, file) {
    const fileContent = await app.vault.read(file);

    if (choice.prepend)
        return `${fileContent}\n${input}`;

    if (choice.insertAfter && typeof choice.insertAfter === "string") {
        const targetRegex = new RegExp(`\s*${choice.insertAfter}\s*`)
        const targetPosition = fileContent.split("\n").findIndex(line => targetRegex.test(line));
        if (!targetPosition) throw error("insertAfter was given but line was not found.");

        return insertTextAfterPositionInBody(input, fileContent, targetPosition);
    }

    const frontmatterEndPosition = await getFrontmatterEndPosition(file);
    if (!frontmatterEndPosition)
        return `${input}${fileContent}`;

    return insertTextAfterPositionInBody(input, fileContent, frontmatterEndPosition);
}

function insertTextAfterPositionInBody(text, body, pos) {
    const splitContent = body.split("\n");
    const pre = splitContent.slice(0, pos + 1).join("\n");
    const post = splitContent.slice(pos + 1).join("\n");

    return `${pre}\n${text}${post}`;
}

async function getFrontmatterEndPosition(file) {
    const fileCache = await this.app.metadataCache.getFileCache(file);

    if (!fileCache || !fileCache.frontmatter) {
        warn("could not get frontmatter. Maybe there isn't any.")
        return 0;
    }

    if (fileCache.frontmatter.position)
        return fileCache.frontmatter.position.end.line;

    return 0;
}

async function promptForChoiceValue(choice) {
    return await promptForValue(choice.option); 
}

async function promptForValue(header) {
    const selection = tp.file.selection();
    let value;

    if (selection == null || selection.match(/^ *$/) !== null) {
        value = await tp.system.prompt(header);
    } else {
        value = selection;
    }

    return value;
}

async function addNewFileFromTemplate(choice) {
    const needName = (!choice.format || (choice.format && NAME_VALUE_REGEX.test(choice.format)))
    const name = needName ? await promptForChoiceValue(choice) : "";
    if (needName && !name) return warn("no filename provided.");

    const templateContent = await getTemplateData(choice.path);
    if (templateContent === null) throw error("could not get template content.");

    const folder = await getOrCreateFolderForChoice(choice);
    if (!folder) throw error("could not get or create folder.");

    let fileName = choice.format ?
        await getFormattedFileName(choice.format, name, folder) :
        getFileName(choice, folder, name);

    if (choice.incrementFileName)
        fileName = await incrementFileName(fileName);

    const value = (checkIfNeedValueInput(choice) || NAME_VALUE_REGEX.test(templateContent))
        ? await promptForChoiceValue(choice) : "";
    const formattedTemplateContent = await getFormattedValue(templateContent, value);

    const created = await createFileWithInput(fileName, formattedTemplateContent);
    if (!created) return error("could not create file.");

    if (choice.appendLink)
        appendToCurrentLine(`[[${created.path.replace('.md', '')}]]`);

    if (!choice.noOpen) {
        if (!choice.newTab)
            app.workspace.activeLeaf.openFile(created);
        else if (choice.newTab === "vertical" || choice.newTab === "horizontal")
            app.workspace.splitActiveLeaf(choice.newTab).openFile(created);
        else
            throw error("invalid newTab syntax.")
    }

    return fileName;
}

async function incrementFileName(fileName) {
    const numStr = FILE_NUMBER_REGEX.exec(fileName)[1];
    const fileExists = await app.vault.adapter.exists(fileName);
    let newFileName = fileName;

    if (fileExists && numStr) {
        const number = parseInt(numStr);
        if (!number) throw error("detected numbers but couldn't get them.")

        newFileName = newFileName.replace(FILE_NUMBER_REGEX, `${number + 1}.md`);
    } else if (fileExists) {
        newFileName = newFileName.replace(FILE_NUMBER_REGEX, `${1}.md`);
    }

    const newFileExists = await app.vault.adapter.exists(newFileName);
    if (newFileExists)
        newFileName = await incrementFileName(newFileName);

    return newFileName;
}

function appendToCurrentLine(string) {
    const editor = app.workspace.activeLeaf.view.editor;
    const selected = editor.getSelection()
    editor.replaceSelection(`${selected}${string}`);
}

async function getFileByPath(path) {
    const file = await app.vault.getAbstractFileByPath(path);
    if (!file) throw error("file not found.");
    if (file.children) throw error("file is folder.");

    return file;
}

async function getTemplateData(templatePath) {
    const templateFile = await getFileByPath(templatePath);

    return await app.vault.cachedRead(templateFile);
}

async function createFileWithInput(filePath, input) {
    const dirName = filePath.match(/(.*)[\/\\]/)[1] || "";

    if (await app.vault.adapter.exists(dirName)) {
        return await app.vault.create(filePath, input);
    } else {
        await getOrCreateFolder(dirName);
        return await app.vault.create(filePath, input)
    }
}

async function getOrCreateFolderForChoice(choice) {
    let folder = defaultFolder;

    if (choice.folder)
        folder = await getOrCreateFolder(choice.folder);

    return folder;
}

async function getOrCreateFolder(folder) {
    let outValue = folder;

    if (folder[Symbol.iterator] && typeof folder !== "string") {
        outValue = await tp.system.suggester(folder, folder);
        if (!outValue) return null;
    }

    if (!(await app.vault.adapter.exists(folder))) {
        await app.vault.createFolder(folder);
    }

    return outValue;
}

function getFileName(choice, folder, name) {
    let modStartSymbol = defaultStartSymbol;
    if (choice.startSymbol && typeof choice.startSymbol === "string")
        modStartSymbol = choice.startSymbol + " ";

    return `${folder}/${modStartSymbol}${name}.md`;
}

async function getFormattedFileName(format, name, folder) {
    return `${folder}/${await getFormattedValue(format, name)}.md`;
}

async function getFormattedValue(format, input) {
    let output = format;

    output = replaceDateInString(output);
    output = replaceValueInString(output, input);
    output = await replaceVariableInString(output);
    output = replaceLinkToCurrentFileInString(output);

    if (NLDATES) 
        output = await replaceDateVariableInString(output);
    else if (DATE_VARIABLE_REGEX.test(output))
        throw error("you cannot use date variables without the Natural Language Dates plugin installed.")
    

    return output;
}

function replaceDateInString(input) {
    let output = input;

    while (DATE_REGEX.test(output)) {
        const dateMatch = DATE_REGEX.exec(output);

        output = dateMatch.length > 0 ?
            output.replace(DATE_REGEX, tp.date.now(dateMatch[1])) :
            output.replace(DATE_REGEX, tp.date.now());
    }

    return output;
}

function replaceValueInString(input, value) {
    let output = input;

    while (NAME_VALUE_REGEX.test(output)) {
        output = output.replace(NAME_VALUE_REGEX, value);
    }

    return output;
}

async function suggestForValue(suggestValues) {
    return await tp.system.suggester(suggestValues.map(s => s.trim()), suggestValues);
}

async function replaceVariableInString(input) {
    let output = input;

    while (VARIABLE_REGEX.test(output)) {
        const match = VARIABLE_REGEX.exec(output);
        const variableName = match[1];

        if (variableName) {
            if (!variables[variableName]) {
                const split = variableName.split(",");

                if (split.length === 1)
                    variables[variableName] = await promptForValue(variableName);
                else
                    variables[variableName] = await suggestForValue(split);
            }

            output = output.replace(VARIABLE_REGEX, variables[variableName]);
        } else {
            break;
        }
    }

    return output;
}

async function replaceDateVariableInString(input) {
    let output = input;

    while (DATE_VARIABLE_REGEX.test(output)) {
        const match = DATE_VARIABLE_REGEX.exec(output);
        const variableName = match[1];
        const dateFormat = match[2];

        if (variableName && dateFormat) {
            if (!variables[variableName]) {
                variables[variableName] = await promptForValue(variableName);

                const parseAttempt = NLDATES.parseDate(variables[variableName]);
                
                if (parseAttempt)
                    variables[variableName] = parseAttempt.moment.format(dateFormat);
                else 
                    throw error(`unable to parse date variable ${variables[variableName]}`);
            }

            output = output.replace(DATE_VARIABLE_REGEX, variables[variableName]);
        } else {
            break;
        }
    }

    return output;
}

function replaceLinkToCurrentFileInString(input) {
    const currentFilePath = `[[${tp.file.path(true)}]]`;
    let output = input;

    while (LINK_TO_CURRENT_FILE_REGEX.test(output))
        output = output.replace(LINK_TO_CURRENT_FILE_REGEX, currentFilePath);

    return output;
}