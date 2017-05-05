/**
 * Test for Constants.
 * Runs with mocha.
 */
'use strict'

const Constants = require('../lib/Constants')
const { ok, equal } = require('assert')

describe('constants', () => {
  before(() => {
  })

  after(() => {
  })

  it('Do test', () => {
    for (let name of Object.keys(Constants)) {
      ok(Constants[ name ])
    }
  })
})

/* global describe, before, after, it */
