var Sqrl = require('../dist/squirrelly.cjs')
var template = `
{{@try}}
This won't work: {{ *it.hi | validate}}
{{#catch => err}}
Uh-oh, error! Message was '{{err.message}}'
{{/try}}
`

// the above is auto unescaped because otherwise it automatically converts it to a string

Sqrl.filters.define('validate', function (str) {
  console.log('str is ' + str + 'and its type is ' + typeof str)
  if (typeof str !== 'string') {
    console.log('gonna error')
    throw new Error('str does not fit expected format')
  } else {
    return str
  }
})

console.log(Sqrl.parse(template, Sqrl.defaultConfig))
console.log('===========================')
console.log(Sqrl.compile(template).toString())
console.log('===========================')
console.log(Sqrl.render(template, { riceKids: ['Ben', 'Polly', 'Joel', 'Phronsie', 'Davie'] }))
