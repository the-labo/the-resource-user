/**
 * Test for TheUserSignResource.
 * Runs with mocha.
 */
'use strict'

const { TheDb } = require('the-db')
const TheUserSignResource = require('../lib/TheUserSignResource')
const { ok, equal } = require('assert')

describe('the-user-sign-resource', () => {
  before(() => {
  })

  after(() => {
  })

  it('Do test', async () => {
    ok(TheUserSignResource)

    let db = new TheDb({
      dialect: 'memory',
      resources: {
        TheUserSignResource: TheUserSignResource
      }
    })

    let resource = db.resource('TheUserSignResource')
    let sign01 = await resource.create({
      password: 'foo'
    })
    ok(sign01.salt)
    ok(sign01.passwordHash)
    ok(!sign01.password)

    await sign01.sync()

    ok(await sign01.testPassword('foo'))

    await sign01.update({ password: 'bar' })

    ok(!(await sign01.testPassword('foo')))
    ok(await sign01.testPassword('bar'))
  })
})

/* global describe, before, after, it */
