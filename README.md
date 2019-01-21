
# squirrelly 
[![Build Status](https://travis-ci.org/nebrelbug/squirrelly.svg?branch=master)](https://travis-ci.org/nebrelbug/squirrelly) [![dependencies Status](https://david-dm.org/nebrelbug/squirrelly/status.svg)](https://david-dm.org/nebrelbug/squirrelly) [![npm downloads](https://img.shields.io/npm/dt/squirrelly.svg)](https://www.npmjs.com/package/squirrelly) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/b848f0c508e841cf8fd3ab7308cfee34)](https://www.codacy.com/app/nebrelbug/squirrelly?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nebrelbug/squirrelly&amp;utm_campaign=Badge_Grade)[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Join the chat at https://gitter.im/squirrellyjs/Lobby](https://badges.gitter.im/squirrellyjs/Lobby.svg)](https://gitter.im/squirrellyjs/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Donate to squirrelly: https://opencollective.com/squirrelly](https://img.shields.io/badge/Open_Collective-donate-brightgreen.svg)](https://opencollective.com/squirrelly)
[![Backers on Open Collective](https://opencollective.com/squirrelly/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/squirrelly/sponsors/badge.svg)](#sponsors) 

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

[Ben Gubler](https://github.com/nebrelbug)

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/nebrelbug/squirrelly/graphs/contributors"><img src="https://opencollective.com/squirrelly/contributors.svg?width=890&button=false" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/squirrelly#backer)]

<a href="https://opencollective.com/squirrelly#backers" target="_blank"><img src="https://opencollective.com/squirrelly/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/squirrelly#sponsor)]

<a href="https://opencollective.com/squirrelly/sponsor/0/website" target="_blank"><img src="https://opencollective.com/squirrelly/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/squirrelly/sponsor/1/website" target="_blank"><img src="https://opencollective.com/squirrelly/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/squirrelly/sponsor/2/website" target="_blank"><img src="https://opencollective.com/squirrelly/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/squirrelly/sponsor/3/website" target="_blank"><img src="https://opencollective.com/squirrelly/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/squirrelly/sponsor/4/website" target="_blank"><img src="https://opencollective.com/squirrelly/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/squirrelly/sponsor/5/website" target="_blank"><img src="https://opencollective.com/squirrelly/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/squirrelly/sponsor/6/website" target="_blank"><img src="https://opencollective.com/squirrelly/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/squirrelly/sponsor/7/website" target="_blank"><img src="https://opencollective.com/squirrelly/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/squirrelly/sponsor/8/website" target="_blank"><img src="https://opencollective.com/squirrelly/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/squirrelly/sponsor/9/website" target="_blank"><img src="https://opencollective.com/squirrelly/sponsor/9/avatar.svg"></a>



## License

Squirrelly is licensed under the MIT license.
