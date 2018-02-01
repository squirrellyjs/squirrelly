# squirrelly 🐿️
[![Build Status](https://travis-ci.org/nebrelbug/squirrelly.svg?branch=master)](https://travis-ci.org/nebrelbug/squirrelly)
[![dependencies Status](https://david-dm.org/nebrelbug/squirrelly/status.svg)](https://david-dm.org/nebrelbug/squirrelly)
[![npm version](https://img.shields.io/npm/v/squirrelly.svg)](https://www.npmjs.com/package/squirrelly)
[![npm downloads](https://img.shields.io/npm/dt/squirrelly.svg)](https://www.npmjs.com/package/squirrelly)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/y/nebrelbug/squirrelly.svg)](https://github.com/nebrelbug/squirrelly)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b848f0c508e841cf8fd3ab7308cfee34)](https://www.codacy.com/app/nebrelbug/squirrelly?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nebrelbug/squirrelly&amp;utm_campaign=Badge_Grade)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Open Source Helpers](https://www.codetriage.com/nebrelbug/squirrelly/badges/users.svg)](https://www.codetriage.com/nebrelbug/squirrelly)

[![](https://img.shields.io/github/forks/nebrelbug/squirrelly.svg?style=social&label=Fork)](https://github.com/nebrelbug/squirrelly/fork)
[![](https://img.shields.io/github/stars/nebrelbug/squirrelly.svg?style=social&label=Stars)](https://github.com/nebrelbug/squirrelly)
[![](https://img.shields.io/github/watchers/nebrelbug/squirrelly.svg?style=social&label=Watch)](https://github.com/nebrelbug/squirrelly)
[![](https://img.shields.io/github/followers/nebrelbug.svg?style=social&label=Follow)](https://github.com/nebrelbug/squirrelly)

Squirrelly is an easy-to-use ExpressJS Template engine that includes basic conditional statements, passing in options to HTML, and even passing in options to inline JavaScript for advanced conditionals!

## Why to use Squirrelly

* It's super easy to use, with double-bracket syntax similar to Mustache.js, Handlebars.js, and Swig
* It only supports basic conditionals so it's lightweight and speedy, but you can pass in options to inline JavaScript and use advanced conditionals inside the JS.
* It was made for Express; there's no need to pipe or do weird input stuff... it just works
* Unlike many other template engines, it doesn't make a JS file to access the DOM--instead, it just returns correct HTML to the `__express` function

## Basic Usage

1. Download [`squirrelly`](https://www.npmjs.com/package/squirrelly) (`npm install squirrelly --save`)
2. Create an `index.sqrl` file (that's explained below, but basically you just put options between double brackets)
3. Create your JS file. An example is shown below

```

const express = require('express')//Require express
const app = express()

app.set('views', 'tests/views') //specify views directory (where your sqrl files are)
app.engine('sqrl', require('squirrelly').__express);//Set the template engine to squirrelly, and make it use .sqrl files. If you don't do this, you'll have to use the file extension .squirrelly
app.set('view engine', 'sqrl'); (use squirrelly as a template engine)


app.get('/', function (req, res) {//When a request is made to the server
  res.render('index', { title: 'Hey', message: 'Hello there!', birthday: 'today', truth: true, untruth: false})//Render index.sqrl, with options
})

app.listen(3000, function () {//Start the server
  console.log('Should be rendering on port 3000...')
})

```

4. Watch the magic happen!

## Syntax

To use squirrelly, instead of creating an HTML file, create a `.sqrl` file. (This will only work if you inlude the following code:

`app.engine('sqrl', require('squirrelly').__express);`

Otherwise, you can name your files with the `.squirrelly` extension. Inside these files, to pass in an option, just put it inside of double brackets. For example, if the options passed to the squirrelly file are `{ title: 'why you should use squirrelly', reason: 'it's awesome'}`, your `.sqrl` file could look like this:

```
<!DOCTYPE html>
<html>
  <head>
    <title>{{title}}</title> //Evaluates to <title>why you should use squirrelly</title>
  </head>
  <body>
    <p>Because {{reason}}</p> //Evaluates to <p>Because it's awesome</p>
  </body>
</html>
```

### Recommended Use

Right now, squirrelly only has basic functionality with conditionals (though it's under active development.) But remember, squirrelly can parse anything, even content of `script` tags. We recommend using squirrelly inside script tags for advanced logic. A very basic  example is shown below:

```
<script>
var userInfo = {{{userInfo}}};
if (userInfo !== null && userInfo !== undefined) {
document.getElementById("userInfo").innerHTML = {{{userInfo}}};
}
</script>

```

### Conditionals

Conditionals have the same simplicity as just regularly passing in options. Currently, Squirrelly just supports true and false conditionals, but more options are expected to come very soon.

A basic Squirrelly conditional follows the following syntax:

```
{(conditional statement){
	HTML that displays if the conditional passes
}*}
```

To test if an option is true, pass in the desired option without anything else.

```
{(truth){
    <p>truth = true!</p>
}*}
```
To test if an option is false, pass in the option with an exclamation point in front of it.
```
{(!untruth){
    <p>untruth = false!</p>
}*}
```

## Contributing

Squirrelly is still under very active development, and all contributors are welcome. Feel free to [fork](https://github.com/nebrelbug/squirrelly), clone, and mess around! Then, contact me, create an issue, or send a pull request at Squirrelly's [Github Repo](https://github.com/nebrelbug/squirrelly).

Beginners are welcome! We welcome all contributors, no matter what skill level.
