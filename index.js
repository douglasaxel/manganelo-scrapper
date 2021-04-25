const Scrapper = require('./ManganeloScrapper')

const scrapper = new Scrapper()

async function main () {
  try {
    console.log(await scrapper.getAllList(2))
  } catch (error) {
    console.error(error)
  }
}

main()
