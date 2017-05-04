/**
 * Sign for user
 * @augments Resource
 * @class TheUserSignResource
 */
'use strict'

const { Resource, DataTypes } = require('the-db')
const { STRING, ENTITY } = DataTypes
const co = require('co')
const crypto = require('crypto')
const newSalt = () => crypto.randomBytes(32).toString('base64')

const {
  PASSWORD_ALGORITHM,
  PASSWORD_PATTERN
} = require('./constants')

const digest = (password, salt) =>
  crypto.createHmac(PASSWORD_ALGORITHM, salt).update(String(password)).digest('hex')

/** @lends TheUserSignResource */
class TheUserSignResource extends Resource {
  static get policy () {
    return {
      /** Pointer to user entity */
      user: {
        type: ENTITY
      },
      password: {
        type: STRING,
        pattern: PASSWORD_PATTERN
      },
      /** Sign code */
      passwordHash: {
        type: STRING
      },
      /** Salt of password */
      salt: {
        type: STRING,
        trim: true,
        default: newSalt
      }
    }
  }

  // Convert entity attributes on inbound
  static inbound (attributes) {
    let { password, salt = newSalt() } = attributes
    if (password) {
      console.log(attributes)
      let passwordHash = digest(password, salt)
      delete attributes.password
      Object.assign(attributes, { salt, passwordHash })
    }
    return attributes
  }

  // Convert entity attributes on outbound
  static outbound (attributes) {
    delete attributes.password
    return attributes
  }

  static entityClass (ResourceEntity) {
    return class TheUserSignResourceEntity extends ResourceEntity {
      /**
       * Test if password matches
       * @param {string} password - Password string to check
       * @returns {boolean} Matched or not
       */
      async testPassword (password) {
        const s = this
        let { salt, passwordHash } = s
        return digest(password, salt) === passwordHash
      }
    }
  }

  static get nameString () {
    return 'UserSignResource'
  }
}

module.exports = TheUserSignResource
