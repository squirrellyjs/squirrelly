## Squirrelly
[![Build Status](https://travis-ci.org/nebrelbug/squirrelly.svg?branch=master)](https://travis-ci.org/nebrelbug/squirrelly) [![dependencies Status](https://david-dm.org/nebrelbug/squirrelly/status.svg)](https://david-dm.org/nebrelbug/squirrelly) [![npm version](https://img.shields.io/npm/v/squirrelly.svg)](https://www.npmjs.com/package/squirrelly) [![GitHub commit activity](https://img.shields.io/github/commit-activity/y/nebrelbug/squirrelly.svg)](https://github.com/nebrelbug/squirrelly) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/b848f0c508e841cf8fd3ab7308cfee34)](https://www.codacy.com/app/nebrelbug/squirrelly?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nebrelbug/squirrelly&amp;utm_campaign=Badge_Grade) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)  
[![](https://img.shields.io/github/forks/nebrelbug/squirrelly.svg?style=social&label=Fork)](https://github.com/nebrelbug/squirrelly/fork) [![](https://img.shields.io/github/stars/nebrelbug/squirrelly.svg?style=social&label=Stars)](https://github.com/nebrelbug/squirrelly) [![](https://img.shields.io/github/watchers/nebrelbug/squirrelly.svg?style=social&label=Watch)](https://github.com/nebrelbug/squirrelly) [![](https://img.shields.io/github/followers/nebrelbug.svg?style=social&label=Follow)](https://github.com/nebrelbug/squirrelly)

Squirrelly is a modern template engine supporting ExpressJS, in-browser functions, and even use as a standalone Node.JS module! 

Note: right now only basic option pass-ins are supported but all of the features described below are expected to be rolled out in the coming months.
## Table of Contents
[**Usage**](#usage)
--  [Install With NPM](#install-with-npm)
-- [Use with ExpressJS](#use-with-expressjs)
-- [Use with Node.js](#nodejs)
[**Syntax**](#syntax)
-- [Basic values](#basic-values)
-- [If statements](#if-statements)
-- [For loops](#for-loops)
-- [While loops](#while-loops)
-- [Includes/Partials](#includes-also-known-as-partials)
-- [Helper functions](#helper-functions)

## Usage
Squirrelly can be used in the browser, as NodeJS, and even as an ExpressJS plugin!
### Install With NPM
`npm install -g squirrelly`
### Use With ExpressJS
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
4. Watch the magic happe
### Use With Node.js
```
var sqrl = require('squirrelly')
sqrl.returnHTML('your string with squirrelly stuff')
```
## Syntax
All variables are passed in through an options object that looks like this: `{foo: 1, bar: "hi", etc: {spanish: "hola", hi: "howdy", andso: "on"}}`

### Basic values

Put variable inside double brackets, like so: `I said {{ bar }}`. Having a space after the closing brackets and before the ending brackets is optional, and single vs. double quotes is too. You may pass in objects like:
- `I said {{ etc }}`  (returns stringified object `etc`)
- **Notice the difference between the two examples below: the first has quotations, the second doesn't. So the second returns the `etc[(the value of the object 'bar'`**
- `I said {{ etc["hi"] }}` returns "howdy"
- `I said {{ etc[bar] }}` returns "howdy"
- `I said {{ etc['spanish'] }}` (returns "hola")
- **Note: to get object children, you must use square-bracket notation like** `etc['spanish'` or `etc['spanish']['spanishobjectchild']`. **You cannot use notation like** `etc.spanish` or  `etc["spanish"["child"]]`

### If statements
The basic syntax of an `if` statement looks like: 
```
{if(some condition){
display this
and this etc}}
```
#### Uses
- Display if a value doesn't equal `undefined` or `null`: `{if(somevalue){display this}}`
- Display if a value does equal `undefined` or `null`: `{if(!somevalue){display this}}`
- Display using JS comparators: `{if(somevalue === "hi"){display this}}`
-- You can substitute `===` for `>==`, `>==`, `!==`, or `type` (checks value type, returns `string`, etc). Comparators like `==` or `!=` are not supported.
-- Please note that you **can't** include more advanced expressions like `{if(somevalue + othervalue === 4){display this}}`.

### For loops

The basic syntax of an `for` loop looks like: 
```
{for(somevar in somearrayorobject){
display this
and this etc}}
```
And renders the inner content each time it's called.

#### Uses
- Iterate over an object or array and return HTML/Markup/Something else. *Ex.* return some HTML for each post in a list of posts:
-- `{for(post in posts){<h2>{{post.title}}</h2><p>{{post.description}}</p>}}`
- Return some code a certain number of times:
-- `{for(n < 10){The current number is {{n}}}}`

### While loops

The basic syntax of a `while` loop looks like: 
```
{while(somevar === somevalue){
display this
and this etc}}
```
And renders the inner content each time it's called.

#### Uses
- Render some content while a variable is less than a certain value:
-- `{while(apples <== 87){display this and this etc}}`

### Includes (also known as partials)

The basic syntax of an `include` looks like: 
```
{include(somefile){optionsforthatfile}}
```
It includes a specific file and optionally parses it with a specific set of options.

#### Uses
- Include a sidebar html file in your code without having to copy-and-paste the entire sidebar code and update it every time it changes:
-- `{include(sidebar.html.sqrl){}}`

### Helper Functions
A helper function is a 3rd-party function that accepts content and (optionally) options and returns parsed content.
The basic syntax of a `helper` looks like: 
```
{helper(functionname, options){content}}
```

#### Uses
- These are kind of like reusable WebComponents. For example, a web developer could create a Google Maps helper. Calling the function below would return HTML that rendered an embedded Google Maps view.
-- `{helper(googlemaps, {globaloptions: options, latitude: "144", longitude: "23"){}}`

