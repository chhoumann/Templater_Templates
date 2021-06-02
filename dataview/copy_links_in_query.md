```dataviewjs
// You can customize the query however you like.
// If you want every page with a certain tag, do `dv.pages("#taghere")`.
const pages = dv.pages()
    .filter(p => p.class === "SPO")
    .sort(p => p["lecture-no"], "desc");

const linkFormatter = str => `[[${str}]]`;
const formatFileName = dvInputItem => linkFormatter(dvInputItem.file.name);

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

const copyButtonMaker = (dvPages) => {
    const btn = this.container.createEl('button', {"text": "Copy"});
    
    btn.addEventListener('click', async (evt) => {
        evt.preventDefault();
        // This puts them all on new lines. If you want tag separation,
        // you should do `.join(", ")` instead.
        const allFileLinks = [...dvPages.map(formatFileName)].join("\n");
        copyToClipboard(allFileLinks);
    });
    
    return btn;
}

dv.paragraph(copyButtonMaker(pages));
dv.table(["Book"], pages.map(f => [f.file.link]));
```
