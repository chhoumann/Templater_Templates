<%*
const languages = {
    "C#": "CSharp",
    "JavaScript": "JavaScript",
    "DataviewJS": "dataviewjs",
    "Dataview": "dataview"
}
lang = await tp.system.suggester(Object.keys(languages), Object.values(languages)) 
if (lang) {
%>```<% lang %>
<% tp.file.cursor(0) %>
```<%* } %>
