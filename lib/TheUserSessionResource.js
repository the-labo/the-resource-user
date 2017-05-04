/**
 * Session for user
 * @augments Resource
 * @class TheUserSessionResource
 */
'use strict'

const { Resource, DataTypes } = require('the-db')
const { STRING, ENTITY, NUMBER, DATE } = DataTypes
const theToken = require('the-token')
const { DEFAULT_SESSION_LIFETIME } = require('./Constants')

const newToken = theToken().bind()

/** @lends TheUserSessionResource */
class TheUserSessionResource extends Resource {
  static get policy () {
    return {
      /** Pointer to user entity */
      user: {
        type: ENTITY,
        required: true
      },
      /** User agent */
      agent: {
        type: STRING
      },
      /** Session token */
      token: {
        type: STRING,
        unique: true,
        required: true,
        default: newToken
      },
      /** Started at */
      since: {
        type: DATE,
        default: () => new Date()
      },
      /** Milliseconds to duration of the session */
      lifetime: {
        type: NUMBER,
        default: () => DEFAULT_SESSION_LIFETIME
      }
    }
  }

  static entityClass (ResourceEntity) {
    return class TheUserSessionResourceEntity extends ResourceEntity {

      /**
       * The date entity expired
       * @returns {Date}
       */
      get expiredAt () {
        const s = this
        let since = new Date(s.since).getTime()
        return new Date(since + s.lifetime)
      }

      get isExpired () {
        const s = this
        return new Date() > s.expiredAt
      }
    }
  }

  static get nameString () {
    return 'UserSession'
  }

  static get expireDuration () {
    return 24 * 60 * 60 * 1000
  }
}

module.exports = TheUserSessionResource
