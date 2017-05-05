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
      user: {
        description: 'Pointer to user entity',
        type: ENTITY,
        required: true
      },
      code: {
        description: 'Role code',
        type: STRING,
        unique: true,
        required: true,
        trim: true
      }
    }
  }

  static entityClass (ResourceEntity) {
    /** @class */
    class TheUserRoleResourceEntity extends ResourceEntity {

    }

    return TheUserRoleResourceEntity
  }
}

module.exports = TheUserRoleResource
