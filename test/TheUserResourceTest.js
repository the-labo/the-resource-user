/**
 * Test for TheUserResource.
 * Runs with mocha.
 */
'use strict'

const { TheDb } = require('the-db')
const TheUserResource = require('../lib/TheUserResource')
const { ok, equal } = require('assert')

describe('the-resource-user', () => {
  before(() => {
  })

  after(() => {
  })

  it('Do test', async () => {
    ok(TheUserResource)

    let db = new TheDb({
      dialect: 'memory'
    })
    db.load(class extends TheUserResource {}, 'User')
    db.load(class extends TheUserResource.Sign {}, 'UserSign')
    db.load(class extends TheUserResource.Session {}, 'UserSession')
    db.load(class extends TheUserResource.Profile {}, 'UserProfile')
    db.load(class extends TheUserResource.Role {}, 'UserRole')

    const {
      User, UserSign, UserSession, UserProfile, UserRole
    } = db.resources

    // Signup an user
    async function signup (name, password, options = {}) {
      let { email, profile = {}, roles = [] } = options
      let user = await User.create({ name })
      user.sign = await UserSign.create({ user, password })
      user.profile = await UserProfile.create({ user, profile })
      user.roles = await UserRole.createBulk(roles.map((code) => ({ code, user })))

      await user.save()
      return user
    }

    // Start user session
    async function signin (name, password, options = {}) {
      let { key } = options
      let user = await User.only({ name })
      let sign = user && await UserSign.only({ user })
      let valid = sign && await sign.testPassword(password)
      if (!valid) {
        throw new Error('Signin failed!')
      }
      let { token, expiredAt } = await UserSession.create({ user, key, sign }).catch((e) => console.error(e))
      await user.sync()
      return { token, expiredAt, user }
    }

    // Finish session
    async function signout (token) {
      let session = await UserSign.only({ token })
      return session && session.destroy()
    }

    {
      await signup('user01', 'xxxxxxxx', {
        roles: [ 'OPERATOR', 'CONSUMER' ]
      })

      let { token } = await signin('user01', 'xxxxxxxx')
      /* ... */
      await signout(token)
    }
  })
})

/* global describe, before, after, it */
