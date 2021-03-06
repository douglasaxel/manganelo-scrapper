const MangaType = {
  NEWEST: 'Newest',
  TOPVIEW: 'Top view'
}

const MangaStatus = {
  ONGOING: 'Ongoing',
  COMPLETED: 'Completed'
}

const MangaGenre = {
  ACTION: 'Action',
  ADULT: 'Adult',
  ADVENTURE: 'Adventure',
  COMEDY: 'Comedy',
  COOKING: 'Cooking',
  DOUJINSHI: 'Doujinshi',
  DRAMA: 'Drama',
  ECCHI: 'Ecchi',
  FANTASY: 'Fantasy',
  GENDER_BENDER: 'Gender Bender',
  HAREM: 'Harem',
  HISTORICAL: 'Historical',
  HORROR: 'Horror',
  ISEKAI: 'Isekai',
  JOSEI: 'Josei',
  MANHUA: 'Manhua',
  MANHWA: 'Manhwa',
  MARTIAL_ARTS: 'Martial Arts',
  MATURE: 'Mature',
  MECHA: 'Mecha',
  MEDICAL: 'Medical',
  MYSTERY: 'Mystery',
  ONE_SHOT: 'One Shot',
  PSYCHOLOGICAL: 'Psychological',
  ROMANCE: 'Romance',
  SCHOOL_LIFE: 'School Life',
  SCIFI: 'Sci Fi',
  SEINEN: 'Seinen',
  SHOUJO: 'Shoujo',
  SHOUJO_AI: 'Shoujo Ai',
  SHOUNEN: 'Shounen',
  SHOUNEN_AI: 'Shounen Ai',
  SLICE_OF_LIFE: 'Slife of Life',
  SMUT: 'Smut',
  SPORTS: 'Sports',
  SUPERNATURAL: 'Super Natural',
  TRADEGY: 'Tradegy',
  WEBTOONS: 'Webtoons',
  YAOI: 'Yaoi',
  YURI: 'Yuri'
}

const OrderBy = {
  ...MangaType,
  AZ: 'A-Z'
}

const Keywords = {
  NAMETITLE: 'Name title',
  ALTERNATIVENAME: 'Alternative name',
  AUTHOR: 'Author'
}

module.exports = {
  MangaType,
  MangaStatus,
  MangaGenre,
  OrderBy,
  Keywords
}
