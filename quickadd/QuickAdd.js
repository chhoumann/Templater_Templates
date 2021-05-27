module.exports = start;
let tp;
const defaultFolder = "/";
const defaultStartSymbol = "";

const FILE_NUMBER_REGEX = new RegExp(/([0-9]*).md$/);

const DATE_REGEX = new RegExp(/{{DATE}}|{{DATE:([^}\n\r]*)}}/);
const NAME_VALUE_REGEX = new RegExp(/{{NAME}}|{{VALUE}}/);
const LINK_TO_CURRENT_FILE_REGEX = new RegExp(/{{LINKCURRENT}}/);

const MARKDOWN_FILE_EXTENSION_REGEX = new RegExp(/\.md$/);
const endsWithMd = (str) => MARKDOWN_FILE_EXTENSION_REGEX.test(str);

const error = (msg) => {
    errMsg = `QuickAdd: ${msg}`;
    console.log(errMsg);
    return new Error(`QuickAdd: ${msg}`)
};
const warn = (msg) => {
    console.log(`QuickAdd: ${msg}`);
    return null;
};

async function start(templater, choices) {
    if (!templater) throw error("templater not provided.");
    else tp = templater;
    if (!choices) throw error("no choices provided.");

    const choice = await tp.system.suggester(choice => choice.option, choices);
    if (!choice) return warn("no choice selected.");

    if (choice.captureTo && typeof choice.captureTo === "string") {
        await doQuickCapture(choice);
    } else {
        const needName = (!choice.format || (choice.format && NAME_VALUE_REGEX.test(choice.format)))
        const name = needName ? await promptForValue(choice) : "";
        if (needName && !name) return warn("no filename provided.");

        await addNewFileFromTemplate(choice, name);
    }
}

async function doQuickCapture(choice) {
    let filePath = endsWithMd(choice.captureTo) ?
        choice.captureTo : `${choice.captureTo}.md`;

    let input = await promptForValue(choice);
    if (!input) return warn("no input given.");

    filePath = getFormattedValue(filePath, input);

    if (choice.task)
        input = `- [ ] ${input}`;

    if (choice.format && typeof choice.format === "string")
        input = getFormattedValue(choice.format, input);

    if (await app.vault.adapter.exists(filePath)) {
        const file = await getFileByPath(filePath);

        fileContent = await quickCaptureFileContentFormatter(choice, input, file);

        await app.vault.modify(file, fileContent);
    } else {
        const created = await createFileWithInput(filePath, input);
        if (!created) throw error("file could not be created.");
    }

    if (choice.appendLink)
        appendToCurrentLine(`[[${filePath}]]`);
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
    };

    if (fileCache.frontmatter.position)
        return fileCache.frontmatter.position.end.line;

    return 0;
}

async function promptForValue(choice) {
    const selection = tp.file.selection();
    let value;

    if (selection == null || selection.match(/^ *$/) !== null) {
        value = await tp.system.prompt(choice.option);
    } else {
        value = selection;
    }

    return value;
}

async function addNewFileFromTemplate(choice, name) {
    const templateContent = await getTemplateData(choice.path);
    if (templateContent === null) throw error("could not get template content.");

    const folder = await getOrCreateFolderForChoice(choice);
    if (!folder) throw error("could not get or create folder.");

    let fileName = choice.format ?
        getFormattedFileName(choice.format, name, folder) :
        getFileName(choice, folder, name);

    if (choice.incrementFileName)
        fileName = await incrementFileName(fileName);

    const formattedTemplateContent = getFormattedValue(templateContent, templateContent);

    const created = await createFileWithInput(fileName, formattedTemplateContent);
    if (!created) return error("could not create file.");

    if (choice.appendLink)
        appendToCurrentLine(`[[${created.path}]]`);

    if (!choice.noOpen)
        app.workspace.activeLeaf.openFile(created);

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

function getFormattedFileName(format, name, folder) {
    return `${folder}/${getFormattedValue(format, name)}.md`;
}

function getFormattedValue(format, value) {
    let output = format;

    output = replaceDateInFileName(output);
    output = replaceValueInFileName(output, value);
    output = replaceLinkToCurrentFileInFileName(output);

    return output;
}

function replaceDateInFileName(fileName) {
    let output = fileName;

    while (DATE_REGEX.test(output)) {
        const dateMatch = DATE_REGEX.exec(output);

        output = dateMatch.length > 0 ?
            output.replace(DATE_REGEX, tp.date.now(dateMatch[1])) :
            output.replace(DATE_REGEX, tp.date.now());
    }

    return output;
}

function replaceValueInFileName(fileName, value) {
    let output = fileName;

    while (NAME_VALUE_REGEX.test(output))
        output = output.replace(NAME_VALUE_REGEX, value);

    return output;
}

function replaceLinkToCurrentFileInFileName(fileName) {
    const currentFilePath = `[[${tp.file.path(true)}]]`;
    let output = fileName;

    while (LINK_TO_CURRENT_FILE_REGEX.test(output))
        output = output.replace(LINK_TO_CURRENT_FILE_REGEX, currentFilePath);

    return output;
}