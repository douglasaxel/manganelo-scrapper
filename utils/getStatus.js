const { MangaStatus } = require('../enums')

/**
 * @param {string} state
 * @returns {number}
 */
module.exports = function (state) {
  if (!state) throw Error('state is required')
  if (typeof state !== 'string') throw Error('state must be a string')

  const states = {
    [MangaStatus.COMPLETED]: 'completed',
    [MangaStatus.ONGOING]: 'ongoing'
  }

  return states[state]
}
