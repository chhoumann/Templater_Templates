module.exports = start;
let tp;
const defaultFolder = "/";
const defaultStartSymbol = "";

const DATE_REGEX = new RegExp(/{{DATE}}|{{DATE:([^}\n\r]*)}}/);
const NAME_VALUE_REGEX = new RegExp(/{{NAME}}|{{VALUE}}/);
const LINK_TO_CURRENT_FILE_REGEX = new RegExp(/{{LINKCURRENT}}/);

const MARKDOWN_FILE_EXTENSION_REGEX = new RegExp(/\.md$/);
const endsWithMd = (str) => MARKDOWN_FILE_EXTENSION_REGEX.test(str);

async function start(templater, choices) {
    if (!templater) return; else tp = templater;
    if (!choices) return;

    const choice = await tp.system.suggester(choice => choice.option, choices);
    if (!choice) return;

    let outValue;
    if (choice.captureTo && typeof choice.captureTo === "string") {
        outValue = await doQuickCapture(choice);
    } else {
        const needName = !(choice.format && NAME_VALUE_REGEX.test(choice.format))
        const name = needName ? await promptForValue(choice) : "";

        outValue = await addNewFileFromTemplate(choice, name);
    }

    if (choice.appendLink && outValue)
        return `[[${outValue}]]`;
    else
        return "";
}

async function doQuickCapture(choice) {
    let filePath = endsWithMd(choice.captureTo) ?
        choice.captureTo : `${choice.captureTo}.md`;

    let input = await promptForValue(choice);
    if (!input) return null;

    if (choice.task)
        input = `- [ ] ${input}`;

    if (choice.format && typeof choice.format === "string")
        input = getFormattedValue(choice.format, input);

    if (await app.vault.adapter.exists(filePath)) {
        const absFile = app.vault.getAbstractFileByPath(filePath);

        let fileContent = await app.vault.cachedRead(absFile);

        if (choice.prepend)
            fileContent = `${fileContent}\n${input}`;
        else
            fileContent = `${input}\n${fileContent}`;

        await app.vault.modify(absFile, fileContent);
    } else {
        await app.vault.create(filePath, input)
    }

    return filePath;
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
    if (!templateContent) return null;

    const folder = await getOrCreateFolder(choice);
    if (!folder) return null;

    let fileName = choice.format ? 
        getFormattedFileName(choice.format, name, folder) :
        getFileName(choice, folder, name);

    const created = await app.vault.create(fileName, templateContent);
    app.workspace.activeLeaf.openFile(created);

    return fileName;
}

async function getTemplateData(templatePath) {
    const templateFile = await app.vault.getMarkdownFiles().find(f => f.path === templatePath);
    
    if (!templateFile) return null;
    
    return await app.vault.read(templateFile);
}

async function getOrCreateFolder(choice) {
    let folder = defaultFolder;
    if (choice.folder) {
        if (typeof choice.folder === "string"){
            folder = choice.folder;
        }
        else if (choice.folder[Symbol.iterator]) {
            folder = await tp.system.suggester(choice.folder, choice.folder);
            if (!folder) return null;
        }

        if (!(await this.app.vault.adapter.exists(folder))) {
            await this.app.vault.createFolder(folder);
        }
    }

    return folder;
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

    while(DATE_REGEX.test(output)){
        const dateMatch = DATE_REGEX.exec(output);

        output = dateMatch.length > 0 ? 
            output.replace(DATE_REGEX, tp.date.now(dateMatch[1])) :
            output.replace(DATE_REGEX, tp.date.now());
    }

    return output;
}

function replaceValueInFileName(fileName, value) {
    let output = fileName;

    while(NAME_VALUE_REGEX.test(output))
        output = output.replace(NAME_VALUE_REGEX, value);

    return output;
}

function replaceLinkToCurrentFileInFileName(fileName) {
    const currentFilePath = `[[${tp.file.path(true)}]]`;
    let output = fileName;

    while(LINK_TO_CURRENT_FILE_REGEX.test(output))
        output = output.replace(LINK_TO_CURRENT_FILE_REGEX, currentFilePath);

    return output;
}