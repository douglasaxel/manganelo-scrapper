const fetch = require('node-fetch')
const JSDOM = require('jsdom').JSDOM
const fs = require('fs')
const path = require('path')
const NodeCache = require('node-cache')

class ManganeloScrapper {
  constructor () {
    this.url = new URL('https://manganelo.com/')
    this.cache = new NodeCache({ stdTTL: 259200, deleteOnExpire: true })
  }

  /**
   * @param {number} page All mangas list page
   * @returns {Promise<{
   *  mangas:{
   *    id:string,
   *    title:string,
   *    link:string,
   *    thumb:string,
   *    chapters:number,
   *    author:string
   *  }[],
   *  metadata:{
   *   hasNext:boolean,
   *   hasPrev:boolean,
   *   itemCount:number,
   *   totalMangas:number,
   *   totalPage:number,
   *   currentPage:number
   *  }
   * }[]>} Returns a manga array of current page
   */
  async getAllList (page = 1) {
    this.url.pathname = `genre-all/${page}`

    const cache = this.cache.get(`all-manga:page-${page}`)
    if (cache) return JSON.parse(cache)

    const res = await fetch(this.url.href)
    const text = await res.text()
    const dom = new JSDOM(text)
    const { document } = dom.window
    const containers = document.querySelectorAll('.content-genres-item')
    const currentPage = page
    const firstPage = 1
    const [, lastPage] = document.querySelector('div.group-page > a.page-blue.page-last').textContent.match(/LAST\(([0-9]+)\)/)
    const [, totalMangas] = document.querySelector('div.panel-page-number > div.group-qty > a').textContent.split(':')

    const mangas = []

    containers.forEach((element) => {
      const link = element.querySelector('a.genres-item-img').getAttribute('href')
      const id = link.replace('https://manganelo.com/manga/', '')
      const thumb = element.querySelector('a.genres-item-img > img').getAttribute('src')
      const title = element.querySelector('.genres-item-info h3 a').textContent
      const chapters = element.querySelector('.genres-item-info .genres-item-chap')?.textContent.replace('Chapter ', '') || 'No chapters'
      const author = element.querySelector('.genres-item-info .genres-item-author')?.textContent

      mangas.push({ id, title, link, thumb, chapters, author })
    })

    this.cache.set(`all-manga:page-${page}`, JSON.stringify(mangas))

    return {
      mangas,
      metadata: {
        hasNext: currentPage < lastPage,
        hasPrev: currentPage > firstPage,
        itemCount: mangas.length,
        totalMangas: Number(totalMangas.replace(',', '').trim()),
        totalPage: Number(lastPage),
        currentPage
      }
    }
  }

  /**
   * @param {string} idManga Manga id
   * @returns {Promise<{
   *  id:string,
   *  title:string,
   *  alternativeNames:string,
   *  author:string,
   *  status:string,
   *  genres:{ id:string, title:string, link:string }[],
   *  updated:string,
   *  description:string,
   *  chapters:number,
   * }[]>} Returns the manga details
   */
  async getMangaDetails (idManga) {
    if (!idManga) throw Error('idManga is required')
    if (typeof idManga !== 'string') throw Error('idManga must be a string')

    this.url.pathname = `manga/${idManga}`

    const res = await fetch(this.url.href)
    const text = await res.text()
    const dom = new JSDOM(text)
    const { document } = dom.window

    const chapters = document.querySelectorAll('.row-content-chapter li.a-h').length
    const title = document.querySelector('div.panel-story-info > div.story-info-right > h1').textContent
    const alternativeNames = document.querySelector('div.panel-story-info > div.story-info-right > table > tbody > tr:nth-child(1) > td.table-value > h2').textContent
    const author = document.querySelector('div.panel-story-info > div.story-info-right > table > tbody > tr:nth-child(2) > td.table-value > a').textContent
    const status = document.querySelector('div.panel-story-info > div.story-info-right > table > tbody > tr:nth-child(3) > td.table-value').textContent
    const allGenres = document.querySelectorAll('div.panel-story-info > div.story-info-right > table > tbody > tr:nth-child(4) > td.table-value > a.a-h')
    const updated = document.querySelector('div.panel-story-info > div.story-info-right > div > p:nth-child(1) > span.stre-value').textContent
    const description = document.querySelector('#panel-story-info-description').textContent.replace('Description :\n', '')

    const genres = []

    allGenres.forEach(element => {
      const genreTitle = element.textContent
      const genreLink = element.getAttribute('href')
      const genreId = genreLink.replace(`${this.url.origin}/`, '')

      genres.push({ id: genreId, title: genreTitle, link: genreLink })
    })

    return {
      id: idManga,
      title,
      alternativeNames,
      author,
      status,
      genres,
      updated,
      description,
      chapters
    }
  }

  /**
   * @param {string} idManga Manga id
   * @returns {Promise<{ id:string, title:string, link:string, date:string }[]>} returns a list of chapters
   */
  async getChapters (idManga) {
    if (!idManga) throw Error('idManga is required')
    if (typeof idManga !== 'string') throw Error('idManga must be a string')

    this.url.pathname = `manga/${idManga}`

    const res = await fetch(this.url.href)
    const text = await res.text()
    const dom = new JSDOM(text)
    const { document } = dom.window
    const containers = document.querySelectorAll('.row-content-chapter li.a-h')

    const itemInfos = []

    containers.forEach((element) => {
      const link = element.querySelector('li .chapter-name').getAttribute('href')
      const title = element.querySelector('li .chapter-name').textContent
      const id = link.replace(`${this.url.origin}/chapter/${idManga}/`, '')
      const date = element.querySelector('li .chapter-time').getAttribute('title')

      itemInfos.push({ id, title, link, date })
    })

    return itemInfos
  }

  /**
   * @param {string} idManga Manga id
   * @param {number} chapter Manga chapter
   * @returns {Promise<{ id:string, title:string, link:string }[]>}
   */
  async getChapter (idManga, chapter) {
    if (!idManga) throw Error('idManga is required')
    if (typeof idManga !== 'string') throw Error('idManga must be a string')
    if (!chapter) throw Error('chapter is required')
    if (typeof chapter !== 'number') throw Error('chapter must be a number')

    this.url.pathname = `chapter/${idManga}/chapter_${chapter}`

    const res = await fetch(this.url.href)
    const text = await res.text()
    const dom = new JSDOM(text)
    const { document } = dom.window
    const images = document.querySelectorAll('div.container-chapter-reader > img')

    const itemInfos = []

    images.forEach(async element => {
      const link = element.getAttribute('src')
      const title = element.getAttribute('title')

      itemInfos.push({ id: `chapter_${chapter}`, title, link })
    })

    return itemInfos
  }

  /**
   * @param {string} idManga Manga id
   * @param {number} chapter Manga chapter
   * @returns {Promise<void>} Creates a folder with the manga name and saves the images inside
   */
  async downloadChapter (idManga, chapter) {
    if (!idManga) throw Error('idManga is required')
    if (typeof idManga !== 'string') throw Error('idManga must be a string')
    if (!chapter) throw Error('chapter is required')
    if (typeof chapter !== 'number') throw Error('chapter must be a number')

    this.url.pathname = `chapter/${idManga}/chapter_${chapter}`

    const res = await fetch(this.url.href)
    const text = await res.text()
    const dom = new JSDOM(text)
    const { document } = dom.window
    const images = document.querySelectorAll('div.container-chapter-reader > img')
    const mangaName = document.querySelector('div.panel-breadcrumb > a:nth-child(3)').textContent

    const itemInfos = []

    images.forEach(async (element, index) => {
      const link = element.getAttribute('src')
      const title = element.getAttribute('title')

      await this.downloadFile(
        link,
        path.join(mangaName, chapter),
        `page-${index + 1}`,
        true
      )

      itemInfos.push({ title, link })
    })

    return itemInfos
  }

  /**
   * @param {string} idManga Manga id
   * @returns {Promise<void>} Download all the manga chapters and create a folder for each chapter
   */
  async downloadAllChapters (idManga) {
    const chapters = await this.getChapters(idManga)

    chapters.forEach(async chapter => {
      await this.downloadChapter(idManga, chapter.id)
    })
  }

  /**
   * @param {string} url URL to download the file
   * @param {string} path Path to save the file
   * @param {string} name File name
   * @param {boolean} needsReferer Flag to send {Referer: 'https://manganelo.com/'} in the request header
   * @returns {Promise<void>}
   */
  async downloadFile (url, path, name, needsReferer = false) {
    if (!url) throw Error('url is required')
    if (!path) throw Error('path is required')
    if (!name) throw Error('name is required')

    const res = await fetch(url, needsReferer ? { headers: { Referer: 'https://manganelo.com/' } } : {})
    const fileExt = res.headers.get('content-type').replace('image/', '')

    await new Promise((resolve, reject) => {
      if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true })
      const fileStream = fs.createWriteStream(`${path}/${name}.${fileExt}`)
      res.body.pipe(fileStream)
      res.body.on('error', (err) => {
        fileStream.close()
        if (err) console.log(err.message)
      })
      fileStream.on('finish', function () {
        fileStream.close()
        resolve()
      })
    })
  }
}

module.exports = ManganeloScrapper
