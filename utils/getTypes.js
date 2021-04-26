const { MangaType } = require('../enums')

/**
 * @param {string} type
 * @returns {number}
 */
module.exports = function (type) {
  if (!type) throw Error('type is required')
  if (typeof type !== 'string') throw Error('type must be a string')

  const types = {
    [MangaType.NEWEST]: 'newest',
    [MangaType.TOPVIEW]: 'topview'
  }

  return types[type]
}
