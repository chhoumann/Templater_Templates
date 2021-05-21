<%* 
const colors = ["black", "gray", "silver", "white", "maroon", "red", "yellow", "lime", "olive", "green", "teal", "aqua", "blue", "navy", "purple", "fuschia"]
const color = await tp.system.suggester(colors,colors); if (color) {%>\color{<%color%>}<%tp.file.cursor(0)%><%* } %>