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
      /** Pointer to user entity */
      user: {
        type: ENTITY,
        required: true
      },
      /** Verify target */
      target: {
        type: STRING,
        required: true
      },
      /** Verify token */
      token: {
        type: STRING,
        unique: true,
        required: true,
        default: newToken
      },
      /** Date expire */
      expiredAt: {
        type: DATE
      },
      /** Done or not */
      done: {
        type: BOOLEAN,
        default: false
      }
    }
  }

  static entityClass (ResourceEntity) {
    return class TheUserVerifyResourceEntity extends ResourceEntity {
      get isExpired () {
        const s = this
        return new Date() > s.expiredAt
      }
    }
  }

  static get nameString () {
    return 'UserVerify'
  }
}

module.exports = TheUserVerifyResource
