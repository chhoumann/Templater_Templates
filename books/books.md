```dataviewjs
this.container.addClass("dv_gallery_view");

const pages = dv.pages("#in/books")
    .where(p => p.file.name != "Book")
    .sort(k => k["Reviewed Date"] && k["rating"], 'desc');

const cardsDiv = this.container.createDiv();
cardsDiv.classList += "dv_cards";

this.container.appendChild(cardsDiv);

const cardBuilder = (title, author, link, image) => {
    const a = cardsDiv.createEl('a');
    a.setAttribute('href', `app://obsidian.md/${link.path}`);
    a.setAttribute('data-href', link.path);
    a.classList += "internal-link"
    
    const card = a.createDiv();
    card.classList += "dv-card max-w-sm rounded flex flex-col h-full cursor-pointer";
    
    const img = card.createEl('img');
    img.classList += "dv_gal_img w-auto mx-auto zoom flex-1";
    img.src = image;
    
    const textContainer = card.createDiv();
    textContainer.classList += "dv_gal_textDiv py-4 text-center pin-b";
    
    const titleEl = textContainer.createEl("p", {"text": title});
    titleEl.classList += "dv_gal_title text-lg font-medium mb-2";
    
    const authorEl = textContainer.createEl("p", {"text": author});
    authorEl.classList += "dv_gal_author text-base text-gray-700";
}

pages.map(p => {
    cardBuilder(p.file.aliases[0], p.author.path, p.file.link, p.image)
})
```

