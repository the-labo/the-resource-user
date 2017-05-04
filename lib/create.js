/**
 * Create a TheUserResource instance
 * @function create
 * @param {...*} args
 * @returns {TheUserResource}
 */
'use strict'

const TheUserResource = require('./TheUserResource')

/** @lends create */
function create (...args) {
  return new TheUserResource(...args)
}

module.exports = create
