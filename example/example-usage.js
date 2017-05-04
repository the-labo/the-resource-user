'use strict'

const theDb = require('the-db')
const {
  TheUserResource: TheUser
} = require('the-resource-user')

async function tryExample () {
  let db = theDb({
    dialect: 'memory',
    resources: {
      User: class UserResource extends TheUser {/* ... */},
      UserSign: class UserSignResource extends TheUser.Sign {/* ... */},
      UserSession: class UserSessionResource extends TheUser.Session {/* ... */},
      UserProfile: class UserProfileResource extends TheUser.Profile {/* ... */},
      UserRole: class UserRoleResource extends TheUser.Role {/* ... */}
    }
  })

  let userResource = db.resource('User')
  let userSignResource = db.resource('UserSign')
  let userSessionResource = db.resource('UserSession')
  let userProfileResource = db.resource('UserProfile')
  let userRoleResource = db.resource('UserRole')

  // Signup an user
  async function signup (username, password, options = {}) {
    let { email = null, profile = {}, roles = [] } = options
    let user = await userResource.create({ username, email })
    user.sign = await userSignResource.create({ password })
    user.profile = await userProfileResource.create({ profile })
    user.roles = await userRoleResource.createBulk(roles.map((code) => ({ code, user })))
    await user.save()
    return user
  }

  // Start user session
  async function signin (username, password, options = {}) {
    let { key } = options
    let user = await userResource.only({ username })
    let sign = user && await userSignResource.only({ user })
    let valid = sign && await sign.testPassword(password)
    if (!valid) {
      throw new Error('Signin failed!')
    }
    let { token, expiredAt } = await userSessionResource.create({ key, sign })
    await user.sync()
    return { token, expiredAt, user }
  }

  // Finish session
  async function signout (token) {
    let session = await userSignResource.only({ token })
    return session && session.destroy()
  }

  {
    signup('user01', 'xxxxxxxx', {
      roles: [ 'OPERATOR', 'CONSUMER' ]
    })

    let { token } = signin('user01', 'xxxxxxxx')
    /* ... */
    signout(token)
  }
}

tryExample().catch((err) => console.error(err))
