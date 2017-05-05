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
      user: {
        description: 'Pointer to user entity',
        type: ENTITY,
        required: true
      },
      agent: {
        description: 'User agent',
        type: STRING
      },
      token: {
        description: 'Session token',
        type: STRING,
        unique: true,
        required: true,
        default: newToken
      },
      since: {
        description: 'Started at',
        type: DATE,
        default: () => new Date()
      },
      lifetime: {
        description: 'Milliseconds to duration of the session',
        type: NUMBER,
        default: () => DEFAULT_SESSION_LIFETIME
      }
    }
  }

  static entityClass (ResourceEntity) {
    /** @class */
    class TheUserSessionResourceEntity extends ResourceEntity {

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
    return TheUserSessionResourceEntity
  }

  static get expireDuration () {
    return 24 * 60 * 60 * 1000
  }

}

module.exports = TheUserSessionResource
