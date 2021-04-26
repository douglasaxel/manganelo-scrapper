const fetch = require('node-fetch')
const { JSDOM } = require('jsdom')
const fs = require('fs')
const path = require('path')
const NodeCache = require('node-cache')
const getGenres = require('../utils/getGenres')
const getTypes = require('../utils/getTypes')
const getOrderBy = require('../utils/getOrderBy')
const getKeywords = require('../utils/getKeywords')
const getStatus = require('../utils/getStatus')

class Manganelo {
  constructor () {
    this.url = new URL('https://manganelo.com/')
    this.cache = new NodeCache({ stdTTL: 259200, deleteOnExpire: true })
  }

  async getMostPopularManga () {
    this.url.pathname = ''

    const res = await fetch(this.url.origin)
    const text = await res.text()
    const dom = new JSDOM(text)
    const { document } = dom.window
    const containers = document.querySelectorAll('div.panel-topview  div.panel-topview-item')

    const mangas = []

    for (const element of containers) {
      const id = element.querySelector('h3 > a').getAttribute('href').match(/manga\/(.+)/i)[1]
      const manga = await this.getMangaDetails(id)
      mangas.push(manga)
    }

    return mangas
  }

  /**
   * @param {{ page?:number, genre?:string, type?:string, status?:string }} params
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
  async getMangaList (params) {
    const genreId = params?.genre ? getGenres(params.genre) : 'all'

    this.url.pathname = `genre-${genreId}/${params?.page || 1}`
    if (params?.type) this.url.searchParams.append('type', getTypes(params.type))
    if (params?.status) this.url.searchParams.append('state', getStatus(params.status))

    const cache = this.cache.get(`${genreId}-manga:page-${params?.page || 1}`)
    if (cache) return JSON.parse(cache)

    const res = await fetch(this.url.href)
    const text = await res.text()
    const dom = new JSDOM(text)
    const { document } = dom.window
    const containers = document.querySelectorAll('.content-genres-item')
    const currentPage = params?.page || 1
    const firstPage = 1
    const [, lastPage] = document.querySelector('div.group-page > a.page-blue.page-last').textContent.match(/LAST\(([0-9]+)\)/)
    const [, totalMangas] = document.querySelector('div.panel-page-number > div.group-qty > a').textContent.split(':')

    const mangas = []

    containers.forEach((element) => {
      const link = element.querySelector('a.genres-item-img').getAttribute('href')
      const id = link.match(/manga\/(.+)/i)[1]
      const thumb = element.querySelector('a.genres-item-img > img').getAttribute('src')
      const title = element.querySelector('.genres-item-info h3 a').textContent
      const chapters = element.querySelector('.genres-item-info .genres-item-chap')?.textContent.replace('Chapter ', '') || 'No chapters'
      const author = element.querySelector('.genres-item-info .genres-item-author')?.textContent

      mangas.push({ id, title, link, thumb, chapters, author })
    })

    this.cache.set(`all-manga:page-${params?.page || 1}`, JSON.stringify(mangas))

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
   * @param {string} search
   * @param {number} page
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
     * }[]>} Returns a manga array of searched string
     */
  async searchManga (search, page = 1) {
    if (!search) throw Error('Search is required')
    if (typeof search !== 'string') throw Error('Search must be a string')

    this.url.pathname = `search/story/${this.normalizeSearchQuery(search)}`

    const res = await fetch(this.url.href)
    const text = await res.text()
    const dom = new JSDOM(text)
    const { document } = dom.window
    const containers = document.querySelectorAll('.panel-search-story .search-story-item')
    const currentPage = page
    const firstPage = 1
    const lastPage = document.querySelector('div.group-page > a.page-blue.page-last')?.textContent.match(/LAST\(([0-9]+)\)/)[1]
    const totalMangas = document.querySelector('div.panel-page-number > div.group-qty > a')?.textContent.split(':')[1]

    const mangas = []

    containers.forEach((element) => {
      const link = element.querySelector('a.item-img').getAttribute('href')
      const id = link.match(/manga\/(.+)/i)[1]
      const thumb = element.querySelector('a.item-img > img').getAttribute('src')
      const title = element.querySelector('.item-right h3 a').textContent
      const chapters = element.querySelector('.item-right .item-chapter')?.textContent.replace('Chapter ', '') || 'No chapters'
      const author = element.querySelector('.item-right .item-author')?.textContent || 'Updating...'

      mangas.push({ id, title, link, thumb, chapters, author })
    })

    return {
      mangas,
      metadata: {
        hasNext: currentPage < (lastPage || 0),
        hasPrev: currentPage > (firstPage || 0),
        itemCount: mangas.length,
        totalMangas: Number(totalMangas?.replace(',', '').trim() || mangas.length),
        totalPage: Number(lastPage || 1),
        currentPage
      }
    }
  }

  /**
   * @param {{
   *  excludes?:string[],
   *  includes?:string[],
   *  orderBy?:string,
   *  status?:string,
   *  searchKey?:string,
   *  searchWord?:string,
   *  page?:number
   * }} params
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
  async advancedSearchManga (params) {
    this.deleteQueryParams()
    this.url.pathname = 'advanced_search'
    this.url.searchParams.append('page', params?.page || 1)
    this.createQueryParams(params)

    const cache = this.cache.get(`advanced_search:page-${params?.page || 1}`)
    if (cache) return JSON.parse(cache)

    const res = await fetch(this.url.href)
    const text = await res.text()
    const dom = new JSDOM(text)
    const { document } = dom.window
    const containers = document.querySelectorAll('.content-genres-item')
    const currentPage = params?.page || 1
    const firstPage = 1
    const lastPage = document.querySelector('div.group-page > a.page-blue.page-last')?.textContent.match(/LAST\(([0-9]+)\)/)[1]
    const totalMangas = document.querySelector('div.panel-page-number > div.group-qty > a')?.textContent.split(':')[1]

    const mangas = []

    containers.forEach((element) => {
      const link = element.querySelector('a.genres-item-img').getAttribute('href')
      const id = link.match(/manga\/(.+)/i)[1]
      const thumb = element.querySelector('a.genres-item-img > img').getAttribute('src')
      const title = element.querySelector('.genres-item-info h3 a').textContent
      const chapters = Number(element.querySelector('.genres-item-info .genres-item-chap')?.textContent.match(/ch.([0-9]+)/i, '')?.[1]) || 'No chapters'
      const author = element.querySelector('.genres-item-info .genres-item-author')?.textContent

      mangas.push({ id, title, link, thumb, chapters, author })
    })

    this.cache.set(`all-manga:page-${params?.page || 1}`, JSON.stringify(mangas))

    return {
      mangas,
      metadata: {
        hasNext: currentPage < (lastPage || 0),
        hasPrev: currentPage > (firstPage || 0),
        itemCount: mangas.length,
        totalMangas: Number(totalMangas?.replace(',', '').trim() || mangas.length),
        totalPage: Number(lastPage || 1),
        currentPage
      }
    }
  }

  /**
   * Create de query params for the advanced search
   * @param {{
   *  excludes?:string[],
   *  includes?:string[],
   *  orderBy?:string,
   *  status?:string,
   *  searchKey?:string,
   *  searchWord?:string,
   *  page?:number
   * }} search
   */
  createQueryParams (search) {
    this.url.searchParams.append('s', 'all')
    if (search?.excludes?.length > 0) {
      this.url.searchParams.append('g_e', `_${search.excludes.map(ex => getGenres(ex)).join('_')}_`)
    }
    if (search?.includes?.length > 0) {
      this.url.searchParams.append('g_i', `_${search.includes.map(ex => getGenres(ex)).join('_')}_`)
    }
    if (search?.orderBy) {
      this.url.searchParams.append('orby', getOrderBy(search.orderBy))
    }
    if (search?.status) {
      this.url.searchParams.append('sts', getStatus(search.status))
    }
    if (search?.searchKey) {
      this.url.searchParams.append('keyt', getKeywords(search.searchKey))
    }
    if (search?.searchWord) {
      this.url.searchParams.append('keyw', this.normalizeSearchQuery(search.searchWord))
    }
    if (search?.page) {
      this.url.searchParams.append('page', search.page)
    }
  }

  /**
   * Delete all url query params
   */
  deleteQueryParams () {
    this.url.searchParams.delete('s')
    this.url.searchParams.delete('g_e')
    this.url.searchParams.delete('g_i')
    this.url.searchParams.delete('orby')
    this.url.searchParams.delete('sts')
    this.url.searchParams.delete('keyt')
    this.url.searchParams.delete('keyw')
    this.url.searchParams.delete('page')
  }

  /**
   * @param {string} query
   * @returns {string} Returns a clean string for URL query
   */
  normalizeSearchQuery (query) {
    let str = query.toLowerCase()
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    str = str.replace(/đ/g, 'd')
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|=|<|>|\?|\/|,|\.|:|;|'|\s|"|&|#|[|]|~|-|\$|_/g, '_')
    str = str.replace(/_+_/g, '_')
    str = str.replace(/^_+|_+'/g, '')

    return str
  }

  /**
   * @param {string} idManga Manga id
   * @returns {Promise<{
   *  id:string,
   *  title:string,
   *  alternativeNames?:string,
   *  author:string[],
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

    const notFound = document.querySelector('body > div.body-site > div.container.container-main > div.panel-not-found > p:nth-child(1)')
    if (notFound) throw Error('Manga not found. Maybe the idManga could be wrong')

    const title = document.querySelector('div.panel-story-info > div.story-info-right > h1').textContent
    const chapters = document.querySelectorAll('.row-content-chapter li.a-h').length
    const infos = document.querySelectorAll('div.panel-story-info > div.story-info-right > table > tbody tr')
    const updated = document.querySelector('div.panel-story-info > div.story-info-right > div > p:nth-child(1) > span.stre-value').textContent
    const description = document.querySelector('#panel-story-info-description').textContent.replace('Description :\n', '')

    let existingInfos = {}

    infos.forEach(element => {
      const label = element.querySelector('td.table-label').textContent.replace(' :', '').replace('(s)', '').trim().toLowerCase()

      const current = {}
      switch (label) {
        case 'alternative': {
          current[label] = element.querySelector('td.table-value h2').textContent
          break
        }
        case 'author': {
          const authors = element.querySelectorAll('td.table-value a')
          current[label] = []
          for (const author of authors) current[label].push(author.textContent)
          break
        }
        case 'status': {
          current[label] = element.querySelector('td.table-value').textContent
          break
        }
        case 'genres': {
          const genres = element.querySelectorAll('td.table-value a')
          current[label] = []
          for (const genre of genres) {
            const genreTitle = genre.textContent
            const genreLink = genre.getAttribute('href')
            const genreId = genreLink.replace(`${this.url.origin}/`, '')

            current[label].push({ id: genreId, title: genreTitle, link: genreLink })
          }
          break
        }

        default:
          break
      }

      existingInfos = { ...existingInfos, ...current }
    })

    return {
      id: idManga,
      title,
      ...existingInfos,
      updated,
      description,
      chapters
    }
  }

  /**
   * @param {string} idManga Manga id
   * @returns {Promise<{ id:string, title:string, link:string, date:string }[]>} returns a list of chapters
   */
  async getMangaChapters (idManga) {
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
  async getMangaChapter (idManga, chapter) {
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
  async downloadMangaChapter (idManga, chapter) {
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
  async downloadMangaAllChapters (idManga) {
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
        if (err) console.error(err.message)
      })
      fileStream.on('finish', function () {
        fileStream.close()
        resolve()
      })
    })
  }
}

module.exports = Manganelo
