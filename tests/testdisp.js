// testdisp.js
const express = require('express')
const app = express()

app.set('views', 'tests/views') // specify the views directory
app.engine('sqrl', require('../index.js').__express)
app.set('view engine', 'sqrl')

app.get('/', function (req, res) {
  res.render('index', {title: 'Hey', message: 'Hello there!', birthday: 'today', truth: true, untruth: false, secondTruth: true, quote: 'wisdom begins in wonder', number: 42, list: ['me', 'you', 42], myObject: {objectTitle: 'myObjectTitle', objectMessage: 'This is an object'}})
  console.log('render attempted')
})

app.listen(3000, function () {
  console.log('Should be rendering on port 3000...')
})
