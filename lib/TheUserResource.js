/**
 * User
 * resource for the-db
 * @augments Resource
 * @class TheUserResource
 */
'use strict'

const { Resource, DataTypes } = require('the-db')
const { STRING, ENTITY } = DataTypes

const TheUserRoleResource = require('./TheUserRoleResource')
const TheUserProfileResource = require('./TheUserProfileResource')
const TheUserSignResource = require('./TheUserSignResource')
const TheUserSessionResource = require('./TheUserSessionResource')

const { USERNAME_PATTERN, EMAIL_PATTERN } = require('./Constants')

/** @lends TheUserResource */
class TheUserResource extends Resource {

  static get policy () {
    return {
      /** Name to identify the user */
      name: {
        type: STRING,
        unique: true,
        required: true,
        pattern: USERNAME_PATTERN,
        trim: true,
        minLength: 4
      },
      /** User email */
      email: {
        type: STRING,
        unique: true,
        trim: true,
        pattern: EMAIL_PATTERN
      },
      /** Use profile data */
      profile: {
        type: ENTITY
      },
      /** User signature */
      sign: {
        type: ENTITY
      },
      /** Use roles */
      roles: {
        type: ENTITY,
        multiple: true
      }
    }
  }

  static get nameString () {
    return 'UserResource'
  }
}

TheUserResource.Role = TheUserRoleResource
TheUserResource.Profile = TheUserProfileResource
TheUserResource.Sign = TheUserSignResource
TheUserResource.Session = TheUserSessionResource

module.exports = TheUserResource
