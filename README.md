the-resource-user
==========

<!---
This file is generated by ape-tmpl. Do not update manually.
--->

<!-- Badge Start -->
<a name="badges"></a>

[![Build Status][bd_travis_shield_url]][bd_travis_url]
[![npm Version][bd_npm_shield_url]][bd_npm_url]
[![JS Standard][bd_standard_shield_url]][bd_standard_url]

[bd_repo_url]: https://github.com/the-labo/the-resource-user
[bd_travis_url]: http://travis-ci.org/the-labo/the-resource-user
[bd_travis_shield_url]: http://img.shields.io/travis/the-labo/the-resource-user.svg?style=flat
[bd_travis_com_url]: http://travis-ci.com/the-labo/the-resource-user
[bd_travis_com_shield_url]: https://api.travis-ci.com/the-labo/the-resource-user.svg?token=
[bd_license_url]: https://github.com/the-labo/the-resource-user/blob/master/LICENSE
[bd_codeclimate_url]: http://codeclimate.com/github/the-labo/the-resource-user
[bd_codeclimate_shield_url]: http://img.shields.io/codeclimate/github/the-labo/the-resource-user.svg?style=flat
[bd_codeclimate_coverage_shield_url]: http://img.shields.io/codeclimate/coverage/github/the-labo/the-resource-user.svg?style=flat
[bd_gemnasium_url]: https://gemnasium.com/the-labo/the-resource-user
[bd_gemnasium_shield_url]: https://gemnasium.com/the-labo/the-resource-user.svg
[bd_npm_url]: http://www.npmjs.org/package/the-resource-user
[bd_npm_shield_url]: http://img.shields.io/npm/v/the-resource-user.svg?style=flat
[bd_standard_url]: http://standardjs.com/
[bd_standard_shield_url]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

<!-- Badge End -->


<!-- Description Start -->
<a name="description"></a>

User resource for the-db

<!-- Description End -->


<!-- Overview Start -->
<a name="overview"></a>



<!-- Overview End -->


<!-- Sections Start -->
<a name="sections"></a>

<!-- Section from "doc/guides/01.Installation.md.hbs" Start -->

<a name="section-doc-guides-01-installation-md"></a>

Installation
-----

```bash
$ npm install the-resource-user --save
```


<!-- Section from "doc/guides/01.Installation.md.hbs" End -->

<!-- Section from "doc/guides/02.Usage.md.hbs" Start -->

<a name="section-doc-guides-02-usage-md"></a>

Usage
---------

```javascript
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

```


<!-- Section from "doc/guides/02.Usage.md.hbs" End -->

<!-- Section from "doc/guides/10.API Guide.md.hbs" Start -->

<a name="section-doc-guides-10-a-p-i-guide-md"></a>

API Guide
-----

+ [the-resource-user@1.0.0](./doc/api/api.md)
  + [create(args)](./doc/api/api.md#the-resource-user-function-create)
  + [TheUserResource](./doc/api/api.md#the-user-resource-class)


<!-- Section from "doc/guides/10.API Guide.md.hbs" End -->


<!-- Sections Start -->


<!-- LICENSE Start -->
<a name="license"></a>

License
-------
This software is released under the [MIT License](https://github.com/the-labo/the-resource-user/blob/master/LICENSE).

<!-- LICENSE End -->


<!-- Links Start -->
<a name="links"></a>

Links
------

+ [THE Labo][t_h_e_labo_url]

[t_h_e_labo_url]: https://github.com/the-labo

<!-- Links End -->
