/* eslint-env mocha */
var assert = require('assert')
var Sqrl = require('../dist/squirrelly.min.js')
// This is a mocha test file containing a couple of tests to make sure Squirrelly isn't broken.
// The code at the bottom tests that when you render simpleTemplate with options, it equals simpleTemplateResult.
// It also tests that bigTemplate, rendered, equals bigTemplateResult.

var simpleTemplate = `
{{title}}
`

var bigTemplate = `
Hi
{{log("Hope you like Squirrelly!")/}}
{{htmlstuff}}

{{foreach(options.obj)}}

Reversed value: {{@this|reverse}}, Key: {{@key}}
{{if(@key==="thirdchild")}}

{{each(options.obj[@key])}}
Salutations. Index: {{@index}}

Old key: {{@../key}}

{{/each}}
{{/if}}
{{/foreach}}

{{customhelper()}}
{{#cabbage}}
Cabbages taste good
{{#pineapple}}
As do pineapples
{{/customhelper}}

This is a partial: {{include("mypartial")/}}

{{tags(--,--)/}}

Custom delimeters!
--arr--

`

var bigTemplateResult = `
Hi
&lt;script>alert(&#39;hey&#39;)&lt;/script>&lt;p>alert(&#39;hey&#39;)&lt;/p>&lt;p>alert(&#39;hey&#39;)&lt;/p>&lt;p>alert(&#39;hey&#39;)&lt;/p>

Reversed value: IH, Key: firstchild
Reversed value: YEH, Key: secondchild
Reversed value: 4,5,2,3,6,3, Key: thirdchild
Salutations. Index: 0
Old key: thirdchild
Salutations. Index: 1
Old key: thirdchild
Salutations. Index: 2
Old key: thirdchild
Salutations. Index: 3
Old key: thirdchild
Salutations. Index: 4
Old key: thirdchild
Salutations. Index: 5
Old key: thirdchild

Block found named cabbage, with value: Cabbages taste good
Block found named pineapple, with value: As do pineapples

This is a partial: Partial content: the value of arr is Hey,&lt;p>Malicious XSS&lt;/p>,Hey,3,12
Custom delimeters!
Hey,&lt;p>Malicious XSS&lt;/p>,Hey,3,12
`

var simpleTemplateResult = `
Squirrelly Tests`

var data = {
  htmlstuff: "<script>alert('hey')</script><p>alert('hey')</p><p>alert('hey')</p><p>alert('hey')</p>",
  arr: ['Hey', '<p>Malicious XSS</p>', 'Hey', 3, 3 * 4],
  obj: {
    firstchild: 'HI',
    secondchild: 'HEY',
    thirdchild: [3, 6, 3, 2, 5, 4]
  },
  title: 'Squirrelly Tests'
}

Sqrl.defineFilter("reverse", function (str) {
  var out = ''
  for (var i = str.length - 1; i >= 0; i--) {
    out += String(str).charAt(i)
  }
  return out || str
})

Sqrl.defineHelper("customhelper", function (args, content, blocks, options) {
  var returnStr = ''
  for (var key in blocks) {
    if (typeof blocks[key] === 'function') {
      returnStr += "Block found named " + key + ", with value: " + blocks[key]()
    }
  }
  return returnStr
})

Sqrl.definePartial("mypartial", "Partial content: the value of arr is {{arr}}")

describe('Simple Compilation', function () {
  it('Basic template returns correct value', function () {
    assert.strictEqual(Sqrl.Render(simpleTemplate, data), simpleTemplateResult)
  })
})

describe('Complex Compilation', function () {
  it('Comprehensive template returns correct value', function () {
    assert.strictEqual(Sqrl.Render(bigTemplate, data), bigTemplateResult)
  })

})
