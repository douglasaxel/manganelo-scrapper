# Manganelo Scrapper

A [manganelo](https://www.manganelo.com/) scrapper
This is a work in progress

## Installation

Install with npm:

```bash
npm install manganelo-scrapper
```

## Dependecies

- [node-fetch](https://www.npmjs.com/package/node-fetch) v^2.6.1
- [node-cache](https://www.npmjs.com/package/node-cache) v^5.1.2
- [jsdom](https://www.npmjs.com/package/jsdom) v^16.5.3

## API

```js
const Manganelo = require("./Scrappers/Manganelo");

const manganelo = new Manganelo();

async function main() {
  try {
    const allList = await manganelo.getAllList();
    const mangaDetail = await manganelo.getMangaDetails("pn918005");
    const mangaChapters = await manganelo.getChapters("pn918005");
    const mangaChapter = await manganelo.getChapter("pn918005", 1);
    await manganelo.downloadChapter("pn918005", 1);
  } catch (error) {
    console.error(error);
  }
}

main();
```

## Sources

- [Manganelo](https://www.manganelo.com/)
