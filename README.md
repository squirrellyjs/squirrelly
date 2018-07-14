# squirrelly 
[![Build Status](https://travis-ci.org/nebrelbug/squirrelly.svg?branch=master)](https://travis-ci.org/nebrelbug/squirrelly) [![dependencies Status](https://david-dm.org/nebrelbug/squirrelly/status.svg)](https://david-dm.org/nebrelbug/squirrelly) [![version](https://img.shields.io/npm/v/squirrelly.svg)](https://www.npmjs.com/package/squirrelly) [![npm downloads](https://img.shields.io/npm/dt/squirrelly.svg)](https://www.npmjs.com/package/squirrelly) [![GitHub commit activity](https://img.shields.io/github/commit-activity/y/nebrelbug/squirrelly.svg)](https://github.com/nebrelbug/squirrelly) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/b848f0c508e841cf8fd3ab7308cfee34)](https://www.codacy.com/app/nebrelbug/squirrelly?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nebrelbug/squirrelly&amp;utm_campaign=Badge_Grade)

**Summary** 

Squirrelly is a modern, configurable, and blazing fast template engine implemented in JavaScript. It works out of the box with ExpressJS and has a small footprint.

## Overview

### Features:
- Custom helpers
- Custom filters
- Conditionals
- Loops
- Custom delimeters (coming soon)
- Plugins (coming soon)
- Precompilation

## Installation

```
$ npm install squirrelly --save
```

## Basic use
```js
var Sqrl = require('squirrelly') //Only needed in Node.js
var myTemplate = `
<p>My favorite template engine is {{templateName}}!</p>
`
var templateFunction = Sqrl.Precompile(myTemplate)
var compiledTemplate = templateFunction({
	templateName: "Squirrelly",
}, Sqrl)

console.log("Compiled template: " + compiledTemplate)
//Logs "Compiled template: <p>My favorite template engine is Squirrelly!</p>"

//Alternative option: instead of calling templateFunction(),
//Call Sqrl.Render():
compiledTemplate = Sqrl.Render(templateFunction, {
	templateName: "Squirrelly"
})
```
## Syntax
[The Basics](#the-basics)
[References](#references)
-- [Global References](#global-references)
-- [Helper References](#helper-references)
[Helpers](#helpers)
-- [Passing Parameters to Helpers](#passing-parameters-to-helpers)
-- [Writing Helpers]()
-- [Built-In Helpers]()
[Filters](#filters)
-- [Using Filters](#filters)
[Tags](#tags) (Not implemented yet, just the future spec)

### The Basics:
There are 4 types of language items in Squirrelly:
- References (global and helper).
-- These are references to the actual data of options that are passed in.
- Helpers
-- These are for logic in the template. Loops and conditionals are both implemented as helpers.
- Filters
-- These are for processing a string after it's been evaluated. Escaping and trimming are done with filters.
- Tags (still in development)
-- When tags are complete, they'll provide customizable syntax that will be parsed with the template. Partials, layouts, and custom delimeters will be implemented with tags.

### References
In Squirrelly, a reference is anything between the opening delimeter (by default `{{`) and the closing delimeter (by default `}}`). It acts as a reference to a value that's passed in as an option to the template. There are two types of references, [global references]() and [helper references]().

#### Global References
Basic syntax:
```
<p>This is a global reference: {{myname}}</p>
```
Global references are always in the global scope, and can be written anywhere in your code. Since Squirrelly templates parse into JavaScript, you can write a reference like this: `<p>This is the child of an object: {{user.lastName}}` or like this: `<p>This is the child of an object: {{user['lastName']}}`.

Warning: there can be spaces after the beginning bracket and before the closing bracket, but a refence like `{{hi man}}` will make your code break!

#### Helper References
Basic syntax:
```
<p>This is a helper reference: {{@username}}</p>
```
Helper References are references to data that a Helper creates. This is a fairly unique concept, but quite simple once you understand.

In Handlebars, helpers affect the global scope, and `./` is required to access parent objects. Squirrelly allows the scope to be unmodified and thus simplifies  debugging. It also allows special properties of helpers, like `index` in an `each` loop, to be accessed easily.

##### Example:
```
{{each(users) 1}}
<p>Hi, {{@this.name}}! This is repetition {{@index}}</p>
{{/each 1}}
```
An `each` loop in Squirrelly, which loops over an array, creates 2 global variables, `this` and `index`.  `this` is the current array item, and `index`
is what array item (0-indexed) the loop is currently on.

When rendered with this data:
```
{
users: [{name: "Ben", friends: 35},{name: "Joe", friends: 100},{name: "Jim", friends: 30}]
}
```
The result would be:
```
<p>Hi, Ben! This is repetition 0</p>
<p>Hi, Joe! This is repetition 1</p>
<p>Hi, Jim! This is repetition 2</p>
```
##### Scoping
But wait... imagine that you're in an [`each`]() loop inside a [`foreach`]() loop--how can you tell access the `this` from the `foreach` instead of the `each`?

To do that, you would do something called `scoping`, with a syntax like this: `{{@id:referencename}}`. That would be a reference to the helper reference `referencename` of the helper with ID: `id`. To learn  more about IDs, read below about Helpers!


Warning: like with Global References, there can be spaces after the beginning bracket and before the closing bracket, but a refence like `{{hi man}}` will make your code break!

### Helpers
Basic syntax:
```
{{helpername(params) id}}
Content
{{#block}}
Block Content
{{/block}}
{{#secondblock}}
{{/secondblock}}
{{/helpername id}}
```
#### Explanation:
`helpername`: This is whatever the helper is called. It could be `if`, `each`, etc.

`params`: You can pass in parameters to helpers just like you would to a normal JavaScript function. Look at the documentation of your helper to see which params they support.

`id`: Unlike many other template engines, Squirrelly requires an ID at the beginning and end of each helper, as shown above. It may be slightly inconvenient, but it helps the Squirrelly parser run blazing fast and it allows [scoping of helper variables]().

`block` and `secondblock`: To separate your code when passing it in to Helpers, Squirrelly has a syntax item called a `Helper Block`. It passes the content inside it to a Helper function, which processes it with the parameters. A `Block` must start with `#`, as seen below.

#### Passing Parameters to Helpers
You can write any valid JavaScript that would work as a function parameter, as a Helper parameter.

To pass in global references, you can prefix them with 2 squirrel tails `~~` like this: `{{if(~~myglobalvalue==="hi") id}}`, or you can just prefix them with `options` like this: `{{if(options.myglobalvalue==="hi") id}}`

To pass in helper references, just use the `@` sign like this: `{{if(@myglobalvalue==="hi") id}}`, or, using scoping, like this: `{{if(@id:myglobalvalue==="hi") id}}`

Warning: You must not have any content between the last block and the end of the helper function other than commas, or your code will break! Example:
```
{{myblock(parameter) 1}}
Hi
{{#firstblock}}
Content of firstblock
{{/firstblock}}
THIS WILL THROW AN ERROR!
{{/myblock 1}}
```

#### Writing Helpers

Squirrelly's method of registering Helpers is similar to Handlebars. Just call
```
Sqrl.registerHelper("helpername", function (args, content, blocks, options) {
console.log("Logging the first parameter: " + args[0])

//The args are in an array, the blocks are an object.

//A block named "else" would be at blocks.else

//"content" and each of the blocks are functions.

//To get the value of content or one of the blocks, call the
//function with, optionally, any desired helper reference names
// and values.

var contentString = content({})
//You MUST return something! If you just want to perform an action,
//return ""
return contentString
})
```
#### Built-In Helpers
Squirrelly has 4 built-in helpers right now: `each`, `foreach`, `log`, and `if`. They're not actually real helpers, because they're compiled into native JavaScript code (i.e. a real `if` loop, instead of a function that returns an `if` loop) for best performance, a feature which will hopefully be available soon for other language items.

`each`: This is for looping over arrays. Usage:
```
{{each(~~somearray) id}}
Hi, {{@this.name}}. The index is: {{@index}}
```
Helper variables are `this` (the current item in the array) and `index` (a zero-indexed number that tells what loop you're on.

`foreach`: This is for looping over objects. Usage:
```
{{each(~~someobj) id}}
Hi, {{@this.name}}. The current object key is: {{@key}}
```
Helper variables are `this` (the current item in the array) and `key` (the key of the object child you're on)

`log`: This is for logging to the console. Usage:
```
{{log("Hi") id}}{{/log id}}
{{log("2+4 is: " + (2+4) + ",~~name is: " + ~~name) id}}{{/log id}}
```
Helper variables: none.
`if`: This is for looping over arrays. Usage:
```
{{if(~~useractive===true) id}}
Display this
{{#else}}
Display this
{{/else}}
{{/if id}}
```
Helper variables: none.
Blocks (optional): `else`. Fairly self-explanatory.
IMPORTANT: `if` is the only helper that doesn't change the current helper reference scope.
### Filters
Filters are processing rules that text is passed through. 
### Tags
Tags aren't currently functional in Squirrelly yet, but when they're fully implemented, they'll be single patterns within opening and closing delimeters that will be handled by custom logic.

Example: `{{include mypartial}}` would be a tag, as well as `{{**do stuff**}}`. Custom delimeters will probably also be handled by partials.
## Examples

### If Statements
## Tests

The default test can be run with `npm test`, and it just checks that compiling and rendering a simple template results in the correct string.

## Contributing

We love contributions from the community! Contributions are
accepted using GitHub pull requests; for more information, see 
[GitHub documentation - Creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

For a good pull request, we ask you provide the following:

1. Include a clear description of your pull request in the description
   with the basic "what" and "why"s for the request.
2. The test should pass. GitHub will automatically run
   the tests as well, to act as a safety net.
3. The pull request should include tests for the change. A new feature should have tests for the new feature and bug fixes should include a test that fails without the corresponding code change and passes after they are applied.
5. If the pull request is a new feature, please include appropriate documentation in the `README.md` file as well.
6. Keep a consistent coding style.

## Contributors

[Ben Gubler](https://github.com/nebrelbug)

## License

Squirrelly is licensed under the MIT license.