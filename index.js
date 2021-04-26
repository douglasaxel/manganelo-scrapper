const Manganelo = require('./Scrappers/Manganelo')

const { MangaGenre, MangaStatus, MangaType } = require('./enums')

const manganelo = new Manganelo()

async function main () {
  try {
    const genreList = await manganelo.searchManga('hero')
    console.log(genreList)
  } catch (error) {
    console.error(error)
  }
}

main()
