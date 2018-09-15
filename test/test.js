/* eslint-env mocha */
var assert = require('assert')
var Sqrl = require('../dist/squirrelly.min.js')

describe('Compilation', function () {
  it('Should return correct parsed value', function () {
    assert.equal(Sqrl.Render(Sqrl.Compile('{{title}}'), {title: 'squirrelly is awesome'}), 'squirrelly is awesome')
  })
})
