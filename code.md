<%*
const languages = {
    "C#": "CSharp",
    "JavaScript": "JavaScript"
}
lang = await tp.system.suggester(Object.keys(languages), Object.values(languages)) %>```<% lang %>
<% tp.file.cursor(0) %>
```