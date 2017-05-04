/**
 * User fresource for the-db
 * @module the-resource-user
 */
'use strict'

const TheUserResource = require('./TheUserResource')
const create = require('./create')

const lib = create.bind(this)

Object.assign(lib, {
  TheUserResource,
  create
})

module.exports = lib
