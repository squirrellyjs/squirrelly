(function (root, factory) {
	'use strict'
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], function () {
			return (root.Sqrl = factory())
		})
	} else if (typeof module === 'object' && module.exports) {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node. Do we neeed to fix this?
		module.exports = factory(require('fs'))
	} else {
		// Browser globals
		root.Sqrl = factory()
	}
})(typeof self !== 'undefined' ? self : this, function (fs) {
		var Sqrl = {} // For all of the functions
		Sqrl.Utils = {} // For user-accessible ones
		Sqrl.Compiler = {} // For RegExp's, etc.
		Sqrl.Helpers = { // For helpers
			Date: function (args, content, blocks, options) {
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth() + 1; //January is 0!
				var yyyy = today.getFullYear();
				if (dd < 10) {
					dd = '0' + dd
				}
				if (mm < 10) {
					mm = '0' + mm
				}
				today = mm + '/' + dd + '/' + yyyy;
				return today
			}
		}
		Sqrl.H = Sqrl.Helpers
		/* These two are technically just helpers, but in Squirrelly they're 1st-class citizens. */
		Sqrl.Partials = {} // For partials
		Sqrl.P = Sqrl.Partials
		Sqrl.Layouts = {} // For layouts
		Sqrl.registerLayout = function (name, callback) {

		}
		Sqrl.registerHelper = function (name, callback) {
			Sqrl.Helpers[name] = callback
			Sqrl.H = Sqrl.Helpers
		}
		Sqrl.Str = function (thing) { /* To make it more safe...I'll probably have people opt in for performance though */
			if (typeof thing === 'string') {
				return thing
			} else if (typeof thing === 'object') {
				return JSON.stringify(thing)
			} else {
				return thing.toString()
			}
		}

		Sqrl.Render = function (template, options) {
			return template(options, Sqrl)
		}

		Sqrl.defaultFilters = { // All strings are automatically passed through the "d" filter (stands for default, but is shortened to save space)
			//, and then each of the default filters the user
			// Has set to true. This opens up a realm of possibilities like autoEscape, etc.
			// List of shortened letters: d: default, e: escape, u: unescape. Escape and Unescape are also valid filter names
			e: false // Escape is turned off by default for performance
		}

		Sqrl.autoEscape = function (bool) {
			if (bool) {
				Sqrl.defaultFilters.e = true
			} else {
				Sqrl.defaultFilters.e = false
			}
		}
		Sqrl.escMap = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#39;",
			"/": "&#x2F;",
			"`": "&#x60;",
			"=": "&#x3D;"
		}
		Sqrl.F = { //F stands for filters
			d: function (str) {
				return str
			},
			e: function (str) {
				//To deal with XSS. Based on Escape implementations of Mustache.JS and Marko, then customized.
				function replaceChar(s) {
					return Sqrl.escMap[s]
				}
				var newStr = String(str)
				var result = /[&<>"'`=\/]/.test(newStr) ? newStr.replace(/[&<>"'`=\/]/g, replaceChar) : newStr
				return result
			}
			//Don't need a filter for unescape because that's just a flag telling Squirrelly not to escape
		}

		Sqrl.F.escape = Sqrl.F.e
		Sqrl.Filters = Sqrl.F

		Sqrl.registerFilter = function (name, callback) {
			Sqrl.F[name] = callback
			Sqrl.Filters = Sqrl.F
		}

		//RegEx for global references: {{\s*?([^#@.\(\\/]+?(?:[.[].*?)*?)((?: *?\| *?[\w$]* *?)* *?\|*)}}
		//RegEx for helper references: {{\s*@(?:([\w$]*):)?\s*(.+?)\s*((?: *?\| *?[\w$]* *?)* *?\|*)}}
		//Total RegEx:
		/* START REGEXP
		{{ *? //the beginning
		(?: //or for each possible tag
		(?: //if a global or helper ref
		(?: //choosing global or helper ref
		(?:([a-zA-Z_$]+[\w]* *?(?:[^\s\w\($]+[^\n]*)*)) //global reference
		|
		(?:@(?:([\w$]+:|(?:\.\.\/)+))? *(.+?) *) //helper reference
		)
		(?: *?(\| *?[^\n]+ *?)*)* //filter
		) //end if a global or helper ref
		| //now if a helper oTag
		(?:([a-zA-Z_$]+[\w]*) *?\(([^\n]*)\) *?([\w]*))
		| //now if a helper cTag
		(?:\/ *?([a-zA-Z_$]+[\w]*))
		| //now if a helper block
		(?:# *?([a-zA-Z_$]+[\w]*))
		) //end or for each possible tag
		 *?}}		

		END REGEXP*/
/*
p1: global ref main
p2: helper ref id
p3: 
		Which equals: {{ *?(?:(?:(?:([a-zA-Z_$]+ *?(?:[^\s\w\($]+[^\n]*)*))|(?:@(?:([\w$]+:|(?:\.\.\/)+))? *(.+?) *))(?: *?(\| *?[^\n]+ *?)*)*) *?}}
		Here's the RegExp I use to turn the expanded version between START REGEXP and END REGEXP to a working one: I replace [\f\n\r\t\v\u00a0\u1680\u2000\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]| \/\/[\w ']+\n with nothing.
		
		*/
		Sqrl.builtInHelpers = {
			if: function (param, blocks, varName, regexps, ofilters, cfilters) { // Opening closing filters, like "Sqrl.F.e(Sqrl.F.d(" and "))"
				var returnFunc = 'if (typeof helpervals === \'undefined\') helpervals = {}; if(' + param + '){' + varName + '+=' + blocks.default+'(helpervals)}'
				if (blocks.hasOwnProperty('else')) {
					returnFunc += 'else { ' + varName + '+=' + blocks.else + '(helpervals)}'
				}
				return returnFunc
			},
			each: function (param, blocks, varName, regexps, ofilters, cfilters) {
				var returnFunc = 'for (var i = 0; i < ' + param + '.length ;i++) {' +
					varName + '+=' + blocks.default+'({this: ' + param + '[i], index: i})}'
				return returnFunc
			},
			foreach: function (param, blocks, varName, regexps, ofilters, cfilters) {
				var returnFunc = 'for (var key in ' + param + ') {if (!' + param + '.hasOwnProperty(key)) continue;' +
					varName + '+=' + blocks.default+'({this: ' + param + '[key], key: key})}'
				return returnFunc
			},
			log: function (param, blocks, varName, regexps, ofilters, cfilters) {
				var returnFunc = 'console.log(' + param + ');'
				return returnFunc
			}
		}

		Sqrl.Precompile = function (str) {
			var regEx = /{{\s*?(?:(?:([^#@.\(\\/]+?(?:[.[].*?)*?)((?: *?\| *?[\w$]* *?)* *?\|*))|(?:@(?:([\w$]*):)?\s*(.+?)\s*((?: *?\| *?[\w$]* *?)* *?\|*)))\s*?}}/g;
			var lastIndex = 0
			var oLength = -1;
			var funcStr = ""
			var outstanding = [];
			varName = "tmpltRes"
			while ((m = regEx.exec(str)) !== null) {
				console.log("found a match: " + m[0])
				// This is necessary to avoid infinite loops with zero-width matches
				if (m.index === regEx.lastIndex) {
					regex.lastIndex++;
				}
				
				if (m[1] === null || typeof m[1] === "undefined") {
					var previous = outstanding[oLength];
					if (previous && previous === m[4]) {
						console.log("lastIndex --> cTag: " + str.slice(lastIndex, m.index))
						//outstanding.pop(); don't actually need this
						oLength -= 1;
					}
					lastIndex = m[0].length + m.index
				} else {
					oLength += 1;
					console.log("lastIndex: " + regEx.lastIndex)
					console.log("lastIndex --> oTag: " + str.slice(lastIndex, m.index))
					outstanding[oLength] = m[1];
					lastIndex = m[0].length + m.index
					//console.log("outstanding: " + JSON.stringify(outstanding))
				}
			}
		if (str.length > regEx.lastIndex) {
			console.log("last part of string: " + parseGlobalRefs(str.slice(lastIndex, str.length), currentVarName, funcStr, regexps))
		}
		console.log("funcString is: " + funcStr)
		return funcStr
		var func = new Function('options', 'Sqrl', funcString.replace(/\n/g, '\\n').replace(/\r/g, '\\r'))
		return func
	}

	if (typeof fs !== 'undefined' && fs !== null) {
		Sqrl.__express = function (filePath, options, callback) {
			fs.readFile(filePath, function (err, content) {
				if (err) {
					return callback(err)
				}
				var sqrlString = content.toString()
				var template = Sqrl.Precompile(sqrlString)
				var renderedFile = Sqrl.Render(template, options)
				return callback(null, renderedFile)
			})
		}
	}
	return Sqrl
})