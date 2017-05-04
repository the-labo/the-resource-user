/**
 * User fresource for the-db
 * @module the-resource-user
 */
'use strict'

const TheUserResource = require('./TheUserResource')
const TheUserProfileResource = require('./TheUserProfileResource')
const TheUserRoleResource = require('./TheUserRoleResource')
const TheUserSignResource = require('./TheUserSignResource')
const TheUserSessionResource = require('./TheUserSessionResource')
const TheUserVerifyResource = require('./TheUserVerifyResource')

const create = require('./create')
const Constants = require('./Constants')

const lib = create.bind(this)

Object.assign(lib, {
  TheUserResource,
  TheUserProfileResource,
  TheUserRoleResource,
  TheUserSignResource,
  TheUserSessionResource,
  TheUserVerifyResource,
  Constants,
  create
})

module.exports = lib
