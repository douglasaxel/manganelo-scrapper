const { OrderBy } = require('../enums')

/**
 * @param {string} order
 * @returns {number}
 */
module.exports = function (order) {
  if (!order) throw Error('order is required')
  if (typeof order !== 'string') throw Error('order must be a string')

  const orders = {
    [OrderBy.NEWEST]: 'newest',
    [OrderBy.TOPVIEW]: 'topview',
    [OrderBy.AZ]: 'az'
  }

  return orders[order]
}
