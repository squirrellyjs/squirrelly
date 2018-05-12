var assert = require('assert');
var squirrelly = require('../index.js')

describe('ReturnHTML', function() {
    it('Should return correct parsed value', function() {
      assert.equal(squirrelly.returnHTML('{{title}}', {title: 'squirrelly is awesome'}), 'squirrelly is awesome');
    });
});