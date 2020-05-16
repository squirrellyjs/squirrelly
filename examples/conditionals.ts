var Sqrl = require('../dist/squirrelly.cjs')
var template = `
The Daugherty's have 8 kids. Their names are:
{{@each (it.kids) => val, index}}
{{@if(index < it.kids.length - 1_}}
  {{val}}, 
{{_#else_}}
  and {{val}}
{{_/if}}
{{_/each}}
`
Sqrl.filters.define('capitalize', function (str) {
  return str.toUpperCase()
})

console.log(Sqrl.parse(template, Sqrl.defaultConfig))
console.log('===========================')
console.log(Sqrl.compile(template).toString())
console.log('===========================')
console.log(Sqrl.render(template, { kids: ['Ben', 'Polly', 'Joel', 'Phronsie', 'Davie'] }))
