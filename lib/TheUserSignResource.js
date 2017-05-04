/**
 * Sign for user
 * @augments Resource
 * @class TheUserSignResource
 */
'use strict'

const { Resource, DataTypes } = require('the-db')
const { STRING, ENTITY } = DataTypes
const crypto = require('crypto')
const newSalt = () => crypto.randomBytes(32).toString('base64')

const {
  PASSWORD_PATTERN,
  DEFAULT_PASSWORD_ALGORITHM
} = require('./Constants')

const digest = (password, salt, algorithm) => crypto.createHmac(algorithm, salt).update(String(password)).digest('hex')

/** @lends TheUserSignResource */
class TheUserSignResource extends Resource {
  static get policy () {
    return {
      /** Pointer to user entity */
      user: {
        type: ENTITY,
        required: true
      },
      /** Password string */
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
      },
      /** Digest algorithm */
      algorithm: {
        type: STRING,
        default: () => DEFAULT_PASSWORD_ALGORITHM
      }
    }
  }

  // Convert entity attributes on inbound
  static inbound (attributes) {
    let {
      password,
      salt = newSalt(),
      algorithm = DEFAULT_PASSWORD_ALGORITHM
    } = attributes
    if (password) {
      let passwordHash = digest(password, salt, algorithm)
      delete attributes.password
      Object.assign(attributes, { salt, passwordHash, algorithm })
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
      testPassword (password) {
        const s = this
        let { salt, passwordHash, algorithm } = s
        return digest(password, salt, algorithm) === passwordHash
      }
    }
  }

  static get nameString () {
    return 'UserSign'
  }
}

module.exports = TheUserSignResource
