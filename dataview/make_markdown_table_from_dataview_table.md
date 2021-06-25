```dataviewjs
const pages = dv.pages().where(f => f.theme && f.readings);

const uniqueWeeks = new Set();
pages.forEach(p => uniqueWeeks.add(p.week));

let pWeeks = {};
uniqueWeeks.forEach(week => {
    pages.forEach(page => {
        if (page.week === week) {
            if (!pWeeks[week]) pWeeks[week] = [];
            pWeeks[week] = [...pWeeks[week], page];
        }
    })
})

let markdownTable = "";

uniqueWeeks.forEach(week => {
    dv.header(3, week);
    const tableTopRow = ["Day", "Theme", "Readings"];
    const tableRows = pWeeks[week].map(p => [p.day, p.theme, p.readings]);
    dv.table(tableTopRow, tableRows);
    
    // Add week header
    markdownTable += `### ${week}\n`;
    // Add row top
    markdownTable += `| ${tableTopRow.map(cell => cell + " |").join("")}\n`;
    markdownTable += "|" + " --- |".repeat(tableTopRow.length) + "\n";
    // Add body
    tableRows.map(p => {
        markdownTable += `| ${p.map(cell => {
            let cellContent;
            
            if (typeof cell !== 'string' && cell[Symbol.iterator]) {
                cellContent = cell.map(c => c.display ?? c).map(v => `- ${v}`).join("<br>");
            } else {
                cellContent = cell.display ?? cell;
            }
            
            return (cellContent + " |")
        
        }).join("")}\n`;
    });
});

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

const copyButtonMaker = () => {
    const btn = this.container.createEl('button', {"text": "Copy"});
    
    btn.addEventListener('click', async (evt) => {
        evt.preventDefault();
        copyToClipboard(markdownTable);
    });
    
    return btn;
}

dv.paragraph(copyButtonMaker());
```