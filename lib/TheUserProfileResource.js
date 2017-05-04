/**
 * Profile for user
 * @augments Resource
 * @class TheUserProfileResource
 */
'use strict'

const { Resource, DataTypes } = require('the-db')
const { STRING, ENTITY } = DataTypes

/** @lends TheUserProfileResource */
class TheUserProfileResource extends Resource {
  static get policy () {
    return {
      /** Pointer to user entity */
      user: {
        type: ENTITY
      },
      /** Actual name of the user */
      name: {
        type: STRING
      },
      /** Profile image */
      image: {
        types: STRING
      }
    }
  }

  static get nameString () {
    return 'UserProfileResource'
  }
}

module.exports = TheUserProfileResource
