const { Keywords } = require('../enums')

/**
 * @param {string} keyword
 * @returns {number}
 */
module.exports = function (keyword) {
  if (!keyword) throw Error('keyword is required')
  if (typeof keyword !== 'string') throw Error('keyword must be a string')

  const keywords = {
    [Keywords.NAMETITLE]: 'title',
    [Keywords.ALTERNATIVENAME]: 'alternative',
    [Keywords.AUTHOR]: 'author'
  }

  return keywords[keyword]
}
