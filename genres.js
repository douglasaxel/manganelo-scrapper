const MangaGenre = {}

MangaGenre.ACTION = 'Action'
MangaGenre.ADULT = 'Adult'
MangaGenre.ADVENTURE = 'Adventure'
MangaGenre.COMEDY = 'Comedy'
MangaGenre.COOKING = 'Cooking'
MangaGenre.DOUJINSHI = 'Doujinshi'
MangaGenre.DRAMA = 'Drama'
MangaGenre.ECCHI = 'Ecchi'
MangaGenre.FANTASY = 'Fantasy'
MangaGenre.GENDER_BENDER = 'Gender Bender'
MangaGenre.HAREM = 'Harem'
MangaGenre.HISTORICAL = 'Historical'
MangaGenre.HORROR = 'Horror'
MangaGenre.ISEKAI = 'Isekai'
MangaGenre.JOSEI = 'Josei'
MangaGenre.MANHUA = 'Manhua'
MangaGenre.MANHWA = 'Manhwa'
MangaGenre.MARTIAL_ARTS = 'Martial Arts'
MangaGenre.MATURE = 'Mature'
MangaGenre.MECHA = 'Mecha'
MangaGenre.MEDICAL = 'Medical'
MangaGenre.MYSTERY = 'Mystery'
MangaGenre.ONE_SHOT = 'One Shot'
MangaGenre.PSYCHOLOGICAL = 'Psychological'
MangaGenre.ROMANCE = 'Romance'
MangaGenre.SCHOOL_LIFE = 'School Life'
MangaGenre.SCIFI = 'Sci Fi'
MangaGenre.SEINEN = 'Seinen'
MangaGenre.SHOUJO = 'Shoujo'
MangaGenre.SHOUJO_AI = 'Shoujo Ai'
MangaGenre.SHOUNEN = 'Shounen'
MangaGenre.SHOUNEN_AI = 'Shounen Ai'
MangaGenre.SLICE_OF_LIFE = 'Slife of Life'
MangaGenre.SMUT = 'Smut'
MangaGenre.SPORTS = 'Sports'
MangaGenre.SUPERNATURAL = 'Super Natural'
MangaGenre.TRADEGY = 'Tradegy'
MangaGenre.WEBTOONS = 'Webtoons'
MangaGenre.YAOI = 'Yaoi'
MangaGenre.YURI = 'Yuri'

module.exports = function getGenre (genre) {
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
