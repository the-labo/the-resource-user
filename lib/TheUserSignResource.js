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
      user: {
        description: 'Pointer to user entity ',
        type: ENTITY,
        required: true
      },
      password: {
        description: 'Password string ',
        type: STRING,
        pattern: PASSWORD_PATTERN
      },
      passwordHash: {
        description: 'Sign code ',
        type: STRING
      },
      salt: {
        description: 'Salt of password ',
        type: STRING,
        trim: true,
        default: newSalt
      },
      algorithm: {
        description: 'Digest algorithm ',
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
    /** @class */
    class TheUserSignResourceEntity extends ResourceEntity {
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
    return TheUserSignResourceEntity
  }
}

module.exports = TheUserSignResource
