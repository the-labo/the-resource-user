/**
 * Verify for user
 * @augments Resource
 * @class TheUserVerifyResource
 */
'use strict'

const { Resource, DataTypes } = require('the-db')
const { STRING, ENTITY, DATE, BOOLEAN } = DataTypes
const theToken = require('the-token')

const newToken = theToken().bind()

/** @lends TheUserVerifyResource */
class TheUserVerifyResource extends Resource {
  static get policy () {
    return {
      user: {
        description: 'Pointer to user entity ',
        type: ENTITY,
        required: true
      },
      target: {
        description: 'Verify target ',
        type: STRING,
        required: true
      },
      token: {
        description: 'Verify token ',
        type: STRING,
        unique: true,
        required: true,
        default: newToken
      },
      expiredAt: {
        description: 'Date expire ',
        type: DATE
      },
      done: {
        description: 'Done or not ',
        type: BOOLEAN,
        default: false
      }
    }
  }

  static entityClass (ResourceEntity) {
    /** @class */
    class TheUserVerifyResourceEntity extends ResourceEntity {
      get isExpired () {
        const s = this
        return new Date() > s.expiredAt
      }
    }
    return TheUserVerifyResourceEntity
  }
}

module.exports = TheUserVerifyResource
