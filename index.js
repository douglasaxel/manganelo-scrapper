const Manganelo = require('./Scrappers/Manganelo')

const { MangaGenre, MangaStatus, MangaType, Keywords, OrderBy } = require('./enums')

const manganelo = new Manganelo()

async function main () {
  try {
    const search = await manganelo.getMangaDetails('ijhr296321559609648')
    console.log(search)
  } catch (error) {
    console.error(error)
  }
}

main()
