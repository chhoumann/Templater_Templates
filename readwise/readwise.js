module.exports = start;
const apiUrl = "https://readwise.io/api/v2/";
let token;
let tp;

async function start(templater, readwiseToken) {
    tp = templater;
    token = readwiseToken;
    const category = await categoryPromptHandler();
    if (!category) return;

    let res = await getHighlightsByCategory(category);
    if (!res) return;

    const {results} = res;
    const item = await tp.system.suggester(item => item.title, results);
    if (!item) return;

    const res2 = await getHighlightsForElement(item);
    if (!res2) return;

    let highlights  = res2.results.reverse();

    const textToAppend = await highlightsPromptHandler(highlights);

    return !textToAppend ? "" : textToAppend; 
}

async function categoryPromptHandler() {
    const books = "📚 Books", articles = "📰 Articles", tweets = "🐤 Tweets", supplementals = "💭 Supplementals", podcasts = "🎙 Podcasts";
    const categories = {books, articles, tweets, supplementals, podcasts};

    const choice = await tp.system.suggester(Object.values(categories), Object.keys(categories));
    if (!choice) return null;

    return choice;
}

async function highlightsPromptHandler(highlights) {
    const writeAll = "Write all highlights to current page", writeOne = "Write one highlight to current page";
    const choices = [writeAll, writeOne];

    const choice = await tp.system.suggester(choices, choices);
    if (!choice) return null;

    if (choice == writeAll)
        return writeAllHandler(highlights);
    else
        return await writeOneHandler(highlights);
}

function writeAllHandler(highlights) {
    return highlights.map(hl => {
        if (hl.text == "No title") return;
        const {quote, note} = textFormatter(hl.text, hl.note);
        return `${quote}${note}`;
    }).join("\n\n");
}

async function writeOneHandler(highlights) {
    const chosenHighlight = await tp.system.suggester(el => el.text, highlights);
    if (!chosenHighlight) return null;

    const {quote, note} = textFormatter(chosenHighlight.text, chosenHighlight.note);

    return `${quote}${note}`;
}

function textFormatter(sourceText, sourceNote) {
    let quote = sourceText.split("\n").filter(line => line != "").map(line => {
        if (sourceNote.includes(".h1"))
            return `## ${line}`;
        else
            return `> ${line}`;
    }).join("\n");

    let note;

    if (sourceNote.includes(".h1") || sourceNote == "" || !sourceNote) {
        note = "";
    } else {
        note = "\n\n" + sourceNote;
    }

    return {quote, note};
}

async function getHighlightsByCategory(category) {
    return apiGet(`${apiUrl}books`, {category, "page_size": 1000});
}

async function getHighlightsForElement(element) {
    return apiGet(`${apiUrl}highlights`, {book_id: element.id, page_size: 1000});
}

async function apiGet(url, data) {
    let finalURL = new URL(url);
    Object.keys(data).forEach(key => finalURL.searchParams.append(key, data[key]));
    
    return await fetch(finalURL, {
        method: 'GET', cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`
        },
    }).then(async (res) => await res.json());
}