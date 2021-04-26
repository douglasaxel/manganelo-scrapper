# Manganelo Scrapper

A [manganelo](https://www.manganelo.com/) scrapper.
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

Use the constant variables at `/enums` when applying filters to the functions

```js
const Manganelo = require("manganelo-scrapper");

const manganelo = new Manganelo();
```

## Enums

All constants tha you need to create advanced search

```js
const {
  MangaGenre,
  MangaStatus,
  MangaType,
  Keywords,
  OrderBy,
} = require("manganelo-scrapper/enums");
```

## Sources

- [Manganelo](https://www.manganelo.com/)
