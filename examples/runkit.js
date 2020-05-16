var Sqrl = require('squirrelly')

var template = 'Hi {{it.user}}!'

Sqrl.render(template, { user: 'cool person' })
