/**
 * Role for user
 * @augments Resource
 * @class TheUserRoleResource
 */
'use strict'

const { Resource, DataTypes } = require('the-db')
const { STRING, ENTITY } = DataTypes

/** @lends TheUserRoleResource */
class TheUserRoleResource extends Resource {
  static get policy () {
    return {
      /** Pointer to user entity */
      user: {
        type: ENTITY
      },
      /** Role code */
      code: {
        type: STRING,
        unique: true,
        required: true,
        trim: true
      }
    }
  }

  static get nameString () {
    return 'UserRoleResource'
  }
}

module.exports = TheUserRoleResource
