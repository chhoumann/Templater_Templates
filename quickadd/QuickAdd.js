module.exports = start;
let tp;
const defaultFolder = "/";
const defaultStartSymbol = "";

async function start(templater, choices) {
    if (!templater) return; else tp = templater;
    if (!choices) return;

    const choice = await tp.system.suggester(choice => choice.option, choices);
    if (!choice) return;
    let name;
    
    const selection = tp.file.selection();
    
    if (selection == null || selection.match(/^ *$/) !== null) {
        name = await tp.system.prompt(choice.option);
        if (!name) return;
    } else {
        name = selection;
    }

    await addFromTemplate(choice, name);
}

async function addFromTemplate(choice, name) {
    const templateContent = await getTemplateData(choice.path);
    if (!templateContent) return;

    let modStartSymbol = defaultStartSymbol;
    if (choice.startSymbol && typeof choice.startSymbol === "string")
        modStartSymbol = choice.startSymbol + " ";

    const folder = await getOrCreateFolder(choice);
    if (!folder) return;
    
    const fileName = `${folder}/${modStartSymbol}${name}.md`;

    const created = await app.vault.create(fileName, templateContent);
    app.workspace.activeLeaf.openFile(created);
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