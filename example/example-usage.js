'use strict'

const theDb = require('the-db')
const {
  TheUserResource
} = require('the-resource-user')

// Define Custom classes
const ResourceClasses = [
  class extends TheUserResource {
    static get nameString () {
      return 'User'
    }
  },
  class extends TheUserResource.Sign {
    static get nameString () {
      return 'UserSign'
    }
  },
  class extends TheUserResource.Session {
    static get nameString () {
      return 'UserSession'
    }
  },
  class extends TheUserResource.Profile {
    static get nameString () {
      return 'UserProfile'
    }
  },
  class extends TheUserResource.Role {
    static get nameString () {
      return 'UserRole'
    }
  }
]

async function tryExample () {

  // Create a db instance
  let db = theDb({
    dialect: 'memory'
  }).load(ResourceClasses)

  let {
    User,
    UserSign,
    UserSession,
    UserProfile,
    UserRole
  } = db.resources

  // Signup an user
  async function signup (username, password, options = {}) {
    let { email = null, profile = {}, roles = [] } = options
    let user = await User.create({ username, email })
    user.sign = await UserSign.create({ user, password })
    user.profile = await UserProfile.create({ user, profile })
    user.roles = await UserRole.createBulk(roles.map((code) => ({ user, code })))
    await
      user.save()
    return user
  }

  // Start user session
  async function signin (username, password, options = {}) {
    let { agent } = options
    let user = await User.only({ username })
    let sign = user && await UserSign.only({ user })
    let valid = sign && await sign.testPassword(password)
    if (!valid) {
      throw new Error('Signin failed!')
    }
    let { token, expiredAt } = await UserSession.create({ agent, sign })
    await user.sync()
    return { token, expiredAt, user }
  }

  // Finish session
  async function signout (token) {
    let session = await UserSign.only({ token })
    return session && session.destroy()
  }

  // Call the functions
  {
    await signup('user01', 'xxxxxxxx', {
      roles: [ 'OPERATOR', 'CONSUMER' ]
    })

    let { token } = signin('user01', 'xxxxxxxx')
    /* ... */
    await signout(token)
  }
}

tryExample().catch((err) => console.error(err))
