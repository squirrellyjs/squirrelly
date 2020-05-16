var Sqrl = require('../dist/squirrelly.cjs')
var template = `
{{it.value}}

{{" hi "}}

{{it.value | safe}}
{{!/*this is a comment */}}

{{it.value | safe | capitalize}}

{{it.value | capitalize | safe}}

`
Sqrl.filters.define('capitalize', function (str) {
  return str.toUpperCase()
})

console.log(Sqrl.parse(template, Sqrl.defaultConfig))
console.log('===========================')
console.log(Sqrl.compile(template).toString())
console.log('===========================')
console.log(Sqrl.render(template, { value: '<img>Something</img>' }))
