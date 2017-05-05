/**
 * User
 * resource for the-db
 * @augments Resource
 * @class TheUserResource
 */
'use strict'

const { Resource, DataTypes } = require('the-db')
const { STRING, ENTITY } = DataTypes

const TheUserProfileResource = require('./TheUserProfileResource')
const TheUserRoleResource = require('./TheUserRoleResource')
const TheUserSignResource = require('./TheUserSignResource')
const TheUserSessionResource = require('./TheUserSessionResource')
const TheUserVerifyResource = require('./TheUserVerifyResource')

const { USERNAME_PATTERN, EMAIL_PATTERN } = require('./Constants')

/** @lends TheUserResource */
class TheUserResource extends Resource {

  static outbound (attributes) {
    delete attributes.sign
    return attributes
  }

  static get policy () {
    return {
      name: {
        description: 'Name to identify the user',
        type: STRING,
        unique: true,
        required: true,
        pattern: USERNAME_PATTERN,
        trim: true,
        minLength: 4
      },
      email: {
        description: 'User email',
        type: STRING,
        unique: true,
        trim: true,
        pattern: EMAIL_PATTERN
      },
      profile: {
        description: 'Use profile',
        type: ENTITY
      },
      sign: {
        description: 'User signature',
        type: ENTITY
      },
      roles: {
        description: 'Use roles',
        type: ENTITY,
        multiple: true
      }
    }
  }

  static entityClass (ResourceEntity) {
    /** @class */
    class TheUserResourceEntity extends ResourceEntity {
    }
    return TheUserResourceEntity
  }
}

TheUserResource.Profile = TheUserProfileResource
TheUserResource.Role = TheUserRoleResource
TheUserResource.Session = TheUserSessionResource
TheUserResource.Sign = TheUserSignResource
TheUserResource.Verify = TheUserVerifyResource

module.exports = TheUserResource
