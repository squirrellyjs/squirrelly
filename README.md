
# squirrelly 
[![Build Status](https://travis-ci.org/nebrelbug/squirrelly.svg?branch=master)](https://travis-ci.org/nebrelbug/squirrelly) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/b848f0c508e841cf8fd3ab7308cfee34)](https://www.codacy.com/app/nebrelbug/squirrelly?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nebrelbug/squirrelly&amp;utm_campaign=Badge_Grade)[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Join the chat at https://gitter.im/squirrellyjs/Lobby](https://badges.gitter.im/squirrellyjs/Lobby.svg)](https://gitter.im/squirrellyjs/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Tip me at paypal.me/bengubler](https://img.shields.io/badge/Paypal-tip%20me-brightgreen.svg)](https://paypal.me/bengubler)

**Summary** 

Squirrelly is a modern, configurable, and blazing fast template engine implemented in JavaScript. It works out of the box with ExpressJS and weighs only **2.6KB gzipped**.

## Why Squirrelly?

### Features:
- Custom helpers
- Custom filters
- Conditionals
- Loops
- Custom delimeters
- Precompilation
- Partials
- Writing JavaScript inside the template
- Comments
- Caching
- Just look at the performance benchmarks [here](https://github.com/nebrelbug/squirrelly-benchmarks)

## Docs
We know nobody reads through the long and boring documentation in the ReadMe anyway, so head over to the documentation website:

[https://squirrelly.js.org](https://squirrelly.js.org)

## Examples
### Simple Template
```
var myTemplate = "<p>My favorite kind of cake is: {{favoriteCake}}</p>"
​
Sqrl.Render(myTemplate, {favoriteCake: 'Chocolate!'})
// Returns: '<p>My favorite kind of cake is: Chocolate!</p>
```
### Conditionals
```
{{if(options.somevalue === 1)}}
Display this
{{#else}}
Display this
{{/if}}
```
### Loops
```
{{each(options.somearray)}}
Display this
The current array element is {{@this}}
The current index is {{@index}}
{{/each}}
```
## Tests

The default test can be run with `npm test`, and it just checks that compiling and rendering a simple template results in the correct string.

## Contributing

We love contributions from the community! Contributions are
accepted using GitHub pull requests; for more information, see 
[GitHub documentation - Creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

For a good pull request, we ask you provide the following:

1. Include a clear description of your pull request in the description with the basic "what" and "why"s for the request.
2. The test should pass.
3. The pull request should include tests for the change. A new feature should have tests for the new feature and bug fixes should include a test that fails without the corresponding code change and passes after they are applied.
4. If the pull request is a new feature, please include appropriate documentation in the `README.md` file as well.
5. Keep a consistent coding style.

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].

The top 7:

[![](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/images/0)](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/links/0)[![](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/images/1)](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/links/1)[![](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/images/2)](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/links/2)[![](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/images/3)](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/links/3)[![](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/images/4)](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/links/4)[![](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/images/5)](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/links/5)[![](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/images/6)](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/links/6)[![](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/images/7)](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/links/7)

## License

Squirrelly is licensed under the MIT license.