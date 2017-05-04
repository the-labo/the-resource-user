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
      dialect: 'memory',
      resources: {
        TheUserResource: TheUserResource
      }
    })

    let resource = db.resource('TheUserResource')
    let entity01 = await resource.create({})
    ok(entity01)
  })
})

/* global describe, before, after, it */
