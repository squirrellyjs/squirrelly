<a href="https://squirrelly.js.org"><img src="https://cdn.jsdelivr.net/gh/squirrellyjs/squirrelly-logo@1.0/svg-minified/squirrelly-fit-acorn.svg" align="right" width="30%" alt="Squirrel"></a>

# squirrelly

[![Travis (.com) branch](https://img.shields.io/travis/com/squirrellyjs/squirrelly/v7)](https://travis-ci.com/squirrellyjs/squirrelly)
[![Codacy Badge](https://img.shields.io/codacy/grade/b848f0c508e841cf8fd3ab7308cfee34)](https://www.codacy.com/app/nebrelbug/squirrelly?utm_source=github.com&utm_medium=referral&utm_content=nebrelbug/squirrelly&utm_campaign=Badge_Grade)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Join the chat at https://gitter.im/squirrellyjs/Lobby](https://img.shields.io/gitter/room/squirrellyjs/squirrelly?color=%2346BC99)](https://gitter.im/squirrellyjs/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Tip me at paypal.me/bengubler](https://img.shields.io/badge/Paypal-tip%20me-brightgreen.svg)](https://paypal.me/bengubler)
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat)](#contributors)

**Summary**

Squirrelly is a modern, configurable, and blazing fast template engine implemented in JavaScript. It works out of the box with ExpressJS and the **full version** weighs only **~2.2KB gzipped**.

Notice: Squirrelly v8 was released in beta! [Learn more about v8](https://squirrelly.js.org/blog/squirrelly-version-8)

All future development of Squirrelly 7 will be happening on the `v7` branch.

## Why Squirrelly?

Simply put, Squirrelly is super lightweight, super fast, simple, and gets the job done.

### 🌟 Features

- :wrench: Custom helpers
- :wrench: Custom filters
- :package: 0 dependencies
- :hammer: Conditionals
- :zap: Exports ES Modules as well as UMD
- :hammer: Loops
- :wrench: Custom delimeters
- :pencil2: Easy template syntax
- :wrench: Precompilation
- :hammer: Partials
- :wrench: Inline JavaScript
- :hammer: Comments
- :wrench: Caching
- :rocket: SUPER fast (look at the performance benchmarks [here](https://github.com/nebrelbug/squirrelly-benchmarks))

## :scroll: Docs

We know nobody reads through the long and boring documentation in the ReadMe anyway, so head over to the documentation website:

:pencil: [https://squirrelly.js.org](https://squirrelly.js.org)

## :notebook: Examples

### Simple Template

```
var myTemplate = "<p>My favorite kind of cake is: {{favoriteCake}}</p>"

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

## :heavy_check_mark: Tests

The default test can be run with `npm test`, and it just checks that compiling and rendering a simple template results in the correct string.

## :handshake: Contributing

We love contributions from the community! Contributions are
accepted using GitHub pull requests; for more information, see
[GitHub documentation - Creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

For a good pull request, we ask you provide the following:

1. Include a clear description of your pull request in the description with the basic "what" and "why" for the request.
2. The test should pass.
3. The pull request should include tests for the change. A new feature should have tests for the new feature and bug fixes should include a test that fails without the corresponding code change and passes after they are applied.
4. If the pull request is a new feature, please include appropriate documentation in the `README.md` file as well.
5. Keep a consistent coding style.

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="http://www.bengubler.com"><img src="https://avatars3.githubusercontent.com/u/25597854?v=4" width="100px;" alt="Ben Gubler"/><br /><sub><b>Ben Gubler</b></sub></a><br /><a href="https://github.com/squirrellyjs/squirrelly/commits?author=nebrelbug" title="Code">💻</a> <a href="#question-nebrelbug" title="Answering Questions">💬</a> <a href="https://github.com/squirrellyjs/squirrelly/commits?author=nebrelbug" title="Documentation">📖</a> <a href="https://github.com/squirrellyjs/squirrelly/commits?author=nebrelbug" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/SerMock"><img src="https://avatars0.githubusercontent.com/u/10904123?v=4" width="100px;" alt="Mark Evans"/><br /><sub><b>Mark Evans</b></sub></a><br /><a href="https://github.com/squirrellyjs/squirrelly/commits?author=SerMock" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/donpedro"><img src="https://avatars2.githubusercontent.com/u/1402910?v=4" width="100px;" alt="donpedro"/><br /><sub><b>donpedro</b></sub></a><br /><a href="#question-donpedro" title="Answering Questions">💬</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project exists thanks to all the people who contribute. We welcome contributions! Learn how to contribute [here](CONTRIBUTING.md).

<!--
The top 7:

[![](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/images/0)](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/links/0)[![](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/images/1)](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/links/1)[![](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/images/2)](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/links/2)[![](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/images/3)](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/links/3)[![](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/images/4)](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/links/4)[![](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/images/5)](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/links/5)[![](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/images/6)](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/links/6)[![](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/images/7)](https://sourcerer.io/fame/nebrelbug/nebrelbug/squirrelly/links/7)

-->

## :fire: Version 8

Some of you may have been wondering about the lack of activity on this repository over the last few months. The answer is that, for quite a while, I've been working on a brand-new version of Squirrelly. You can [read about it on GitHub](https://github.com/nebrelbug/squirrelly/issues/106), but here's a quick overview:

### :sparkles: Low-Level Changes

- New, more reliable parser -- see a draft [here](https://gist.github.com/nebrelbug/7f1d0d0c80b90c86ed629cc8a10e6cb5)
- AST generation before compiled-function generation
- Partials will be referenced instead of inlined
- Bundling with Rollup for smaller code size

### :sparkles: New Features

- Layouts
- Async support
- Helpers will be prefixed with `~`, so `{{~if(options.stuff}}`
- 'Interpolate syntax': `{{=4+3}}`
- Native Code: what was previously `{{js(var x = 0)/}}` will become: `{{!var x = 0}}`
- Filter parameters, ex. `{{somearray | join(",") }}`
- Save the cache and load it later
- Plugins

### :bug: Bug Fixes

- ~~Filter chaining will work once more~~ (this was fixed in 7.5.0)

## License

Squirrelly is licensed under the MIT license.
