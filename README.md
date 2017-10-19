# squirrelly
[![Build Status](https://travis-ci.org/nebrelbug/squirrelly.svg?branch=master)](https://travis-ci.org/nebrelbug/squirrelly)
[![dependencies Status](https://david-dm.org/nebrelbug/squirrelly/status.svg)](https://david-dm.org/nebrelbug/squirrelly)
[![npm version](https://img.shields.io/npm/v/squirrelly.svg)](https://www.npmjs.com/package/squirrelly)
[![npm downloads](https://img.shields.io/npm/dt/squirrelly.svg)](https://www.npmjs.com/package/squirrelly)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/y/nebrelbug/crawlbug.svg)](https://github.com/nebrelbug/crawlbug)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/33bf9811125c493f9808050e2499c9c6)](https://www.codacy.com/app/nebrelbug/crawlbug?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nebrelbug/crawlbug&amp;utm_campaign=Badge_Grade)

Squirrelly is an easy-to-use ExpressJS Template engine, allowing basic conditional statements and easy ExpressJS usage. Just pass in options and/or conditionals inside double brackets!

## Why to use Squirrelly

* It's super easy to use, with syntax inspired by swig
* It was made for Express; there's no need to pipe or do weird input stuff... it just works
* Unlike many other template engines, it doesn't make a JS file to access the DOM--instead, it just returns correct HTML to the `__express` function.

## Squirrelly basic setup

1. Download [`squirrelly`](https://www.npmjs.com/package/squirrelly) (`npm install squirrelly --save`)
2. Create an `index.sqrl` file (that's explained below, but basically you just put options between double brackets)
3. Create your JS file. An example is shown below

```

const express = require('express')//Require express
const app = express()

app.set('views', 'tests/views') //specify views directory (where your sqrl files are)
app.engine('sqrl', require('squirrelly').__express);//Set the template engine to squirrelly, and make it use .sqrl files. If you don't do this, you'll have to use the file extension .squirrelly
app.set('view engine', 'sqrl'); (use the template engine)


app.get('/', function (req, res) {//When a request is made to the server
  res.render('index', { title: 'Hey', message: 'Hello there!', birthday: 'today', truth: true, untruth: false})//Render index.sqrl, with options
})

app.listen(3000, function () {//Start the server
  console.log('Should be rendering on port 3000...')
})

```

4. Watch the magic happen!

## Squirrelly Syntax

To use squirrelly, instead of creating an HTML file, create a `.sqrl` file. (This will only work if you inlude the following code:

`app.engine('sqrl', require('squirrelly').__express);`

Otherwise, you can name your files with the `.squirrelly` extension. Inside these files, to pass in an option, just put it inside of double brackets. For example, if the options passed to the squirrelly file are `{ title: 'why you should use squirrelly', reason: 'it's awesome'}`, your `.sqrl` file could look like this:

```
<!DOCTYPE html>
<html>
  <head>
    <title>{{title}}</title>
  </head>
  <body>
    <p>Because {{reason}}</p>
  </body>
</html>
```

### Conditionals

Conditionals have the same simplicity as just regularly passing in options. Currently, Squirrelly just supports true and false conditionals, but more options are expected to come very soon.

A basic Squirrelly conditional follows the following syntax:

```
{(conditional statement){
	HTML that displays if the conditional passes
}}
```

To test if an option is true, pass in the `truth` option without anything else.

```
{(truth){
    <p>truth = true!</p>
}}
```
To test if an option is false, pass in the option with an exclamation point in front of it.
```
{(!untruth){
    <p>untruth = false!</p>
}}
```

## Contributing

Squirrelly is still under very active development, and all contributors would be appreciated. Just contact me or send me a pull request at Squirrelly's [Github Repo](https://github.com/nebrelbug/squirrelly). If you find any issues, submit an issue.
