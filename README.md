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

```


<!-- Section from "doc/guides/02.Usage.md.hbs" End -->

<!-- Section from "doc/guides/11.Policies.md.hbs" Start -->

<a name="section-doc-guides-11-policies-md"></a>

Policies
--------

+ [TheUserResource Policy](#policy-TheUserResource)
+ [TheUserProfileResource Policy](#policy-TheUserProfileResource)
+ [TheUserRoleResource Policy](#policy-TheUserRoleResource)
+ [TheUserSignResource Policy](#policy-TheUserSignResource)
+ [TheUserVerifyResource Policy](#policy-TheUserVerifyResource)

<a name="policy-TheUserResource"/>

### TheUserResource Policy

| Property | Description | Type | Required | Unique |
| ----- | ----- | --- | --- | --- |
| `name` | Name to identify the user | "cly:string" | true | true |
| `email` | User email | "cly:string" |  | true |
| `profile` | Use profile | "cly:entity" |  |  |
| `sign` | User signature | "cly:entity" |  |  |
| `roles` | Use roles | "cly:entity" |  |  |

<a name="policy-TheUserProfileResource"/>

### TheUserProfileResource Policy

| Property | Description | Type | Required | Unique |
| ----- | ----- | --- | --- | --- |
| `user` |  | "cly:entity" | true |  |
| `name` |  | "cly:string" |  |  |
| `image` |  | "cly:string" |  |  |

<a name="policy-TheUserRoleResource"/>

### TheUserRoleResource Policy

| Property | Description | Type | Required | Unique |
| ----- | ----- | --- | --- | --- |
| `user` | Pointer to user entity | "cly:entity" | true |  |
| `code` | Role code | "cly:string" | true |  |

<a name="policy-TheUserSignResource"/>

### TheUserSignResource Policy

| Property | Description | Type | Required | Unique |
| ----- | ----- | --- | --- | --- |
| `user` | Pointer to user entity  | "cly:entity" | true |  |
| `password` | Password string  | "cly:string" |  |  |
| `passwordHash` | Sign code  | "cly:string" |  |  |
| `salt` | Salt of password  | "cly:string" |  |  |
| `algorithm` | Digest algorithm  | "cly:string" |  |  |

<a name="policy-TheUserVerifyResource"/>

### TheUserVerifyResource Policy

| Property | Description | Type | Required | Unique |
| ----- | ----- | --- | --- | --- |
| `user` | Pointer to user entity  | "cly:entity" | true |  |
| `target` | Verify target  | "cly:string" | true |  |
| `token` | Verify token  | "cly:string" | true | true |
| `expiredAt` | Date expire  | "cly:date" |  |  |
| `done` | Done or not  | "cly:boolean" |  |  |



<!-- Section from "doc/guides/11.Policies.md.hbs" End -->

<!-- Section from "doc/guides/20.API Guide.md.hbs" Start -->

<a name="section-doc-guides-20-a-p-i-guide-md"></a>

API Guide
-----

+ [the-resource-user@2.0.2](./doc/api/api.md)
  + [create(args)](./doc/api/api.md#the-resource-user-function-create)
  + [TheUserProfileResource](./doc/api/api.md#the-user-profile-resource-class)
  + [TheUserProfileResourceEntity](./doc/api/api.md#the-user-profile-resource-entity-class)
  + [TheUserResource](./doc/api/api.md#the-user-resource-class)
  + [TheUserResourceEntity](./doc/api/api.md#the-user-resource-entity-class)
  + [TheUserRoleResource](./doc/api/api.md#the-user-role-resource-class)
  + [TheUserRoleResourceEntity](./doc/api/api.md#the-user-role-resource-entity-class)
  + [TheUserSignResource](./doc/api/api.md#the-user-sign-resource-class)
  + [TheUserSignResourceEntity](./doc/api/api.md#the-user-sign-resource-entity-class)
  + [TheUserVerifyResource](./doc/api/api.md#the-user-verify-resource-class)
  + [TheUserVerifyResourceEntity](./doc/api/api.md#the-user-verify-resource-entity-class)


<!-- Section from "doc/guides/20.API Guide.md.hbs" End -->


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
