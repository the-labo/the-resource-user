'use strict'

const theDb = require('the-db')
const {
  TheUserResource
} = require('the-resource-user')

async function tryExample () {
  // Create a db instance
  let db = theDb({
    dialect: 'memory'
  })

  db.load(class extends TheUserResource { /* ... */ }, 'User')
  db.load(class extends TheUserResource.Sign { /* ... */ }, 'UserSign')
  db.load(class extends TheUserResource.Profile { /* ... */ }, 'UserProfile')
  db.load(class extends TheUserResource.Role { /* ... */ }, 'UserRole')

  let {
    User,
    UserSign,
    UserProfile,
    UserRole
  } = db.resources

  let session = {}

  // Signup an user
  async function signup (username, password, options = {}) {
    let { email = null, profile = {}, roles = [] } = options
    let user = await User.create({ username, email })
    user.sign = await UserSign.create({ user, password })
    user.profile = await UserProfile.create({ user, profile })
    user.roles = await UserRole.createBulk(roles.map((code) => ({ user, code })))
    await user.save()
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
    await user.sync()
    session.signed = user
    return user
  }

  // Finish session
  async function signout (token) {
    delete session.signed
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
