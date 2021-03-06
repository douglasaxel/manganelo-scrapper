const { MangaGenre } = require('../enums')

/**
 * @param {string} genre
 * @returns {number}
 */
module.exports = function (genre) {
  if (!genre) throw Error('Genre is required')
  if (typeof genre !== 'string') throw Error('Genre must be a string')

  const genres = {
    [MangaGenre.ACTION]: 2,
    [MangaGenre.ADULT]: 3,
    [MangaGenre.ADVENTURE]: 4,
    [MangaGenre.COMEDY]: 6,
    [MangaGenre.COOKING]: 7,
    [MangaGenre.DOUJINSHI]: 9,
    [MangaGenre.DRAMA]: 10,
    [MangaGenre.ECCHI]: 11,
    [MangaGenre.FANTASY]: 12,
    [MangaGenre.GENDER_BENDER]: 13,
    [MangaGenre.HAREM]: 14,
    [MangaGenre.HISTORICAL]: 15,
    [MangaGenre.HORROR]: 16,
    [MangaGenre.JOSEI]: 17,
    [MangaGenre.MARTIAL_ARTS]: 19,
    [MangaGenre.MATURE]: 20,
    [MangaGenre.MECHA]: 21,
    [MangaGenre.MEDICAL]: 22,
    [MangaGenre.MYSTERY]: 24,
    [MangaGenre.ONE_SHOT]: 25,
    [MangaGenre.PSYCHOLOGICAL]: 26,
    [MangaGenre.ROMANCE]: 27,
    [MangaGenre.SCHOOL_LIFE]: 28,
    [MangaGenre.SCIFI]: 29,
    [MangaGenre.SEINEN]: 30,
    [MangaGenre.SHOUJO]: 31,
    [MangaGenre.SHOUJO_AI]: 32,
    [MangaGenre.SHOUNEN]: 33,
    [MangaGenre.SHOUNEN_AI]: 34,
    [MangaGenre.SLICE_OF_LIFE]: 35,
    [MangaGenre.SMUT]: 36,
    [MangaGenre.SPORTS]: 37,
    [MangaGenre.SUPERNATURAL]: 38,
    [MangaGenre.TRADEGY]: 39,
    [MangaGenre.WEBTOONS]: 40,
    [MangaGenre.YAOI]: 41,
    [MangaGenre.YURI]: 42,
    [MangaGenre.MANHWA]: 43,
    [MangaGenre.MANHUA]: 44,
    [MangaGenre.ISEKAI]: 45
  }

  return genres[genre]
}
