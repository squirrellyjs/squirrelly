var assert = require('assert')
var Sqrl = require('../squirrelly.js')

describe('Precompilation', function () {
  it('Should return correct parsed value', function () {
    assert.equal(Sqrl.Render(Sqrl.Precompile('{{title}}'), {title: 'squirrelly is awesome'}), 'squirrelly is awesome')
  })
})
