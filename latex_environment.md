<%* 
const envs = ["gather", "equation", "align", "matrix", "array", "cases", "tabular"]
const envType = await tp.system.suggester(envs,envs); 
if (envType) {
%>\begin{<%envType%>} 
        <% tp.file.cursor(1) %>
    \end{<% envType %>}<%* } %>