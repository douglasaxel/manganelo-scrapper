const Manganelo = require('./Scrappers/Manganelo')

const { MangaGenre } = require('./enums/genres')

const manganelo = new Manganelo()

async function main () {
  try {
    const genreList = await manganelo.searchMangaByName('hero', 16)
    console.log(genreList)
  } catch (error) {
    console.error(error)
  }
}

main()
