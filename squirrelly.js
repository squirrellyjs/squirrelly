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
	var Sqrl = {
		Compiler: {},
		Helpers: { // For helpers
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
		},
		Partials: {},
		Layouts: {},
		registerLayout: function (name, callback) {

		},
		defineHelper: function (name, callback) {
			Sqrl.Helpers[name] = callback
			Sqrl.H = Sqrl.Helpers
		},
		Render: function (template, options) {
			if (typeof template === "function") {
				return template(options, Sqrl)
			} else if (typeof template === "string") {
				var templateFunc = Sqrl.Precompile(template)
				return templateFunc(options, Sqrl)
			}
		},
		defaultFilters: { // All strings are automatically passed through the "d" filter (stands for default, but is shortened to save space)
			//, and then each of the default filters the user
			// Has set to true. This opens up a realm of possibilities like autoEscape, etc.
			// List of shortened letters: d: default, e: escape, u: unescape. Escape and Unescape are also valid filter names
			e: false // Escape is turned off by default for performance
		},
		autoEscape: function (bool) {
			if (bool) {
				Sqrl.defaultFilters.e = true
			} else {
				Sqrl.defaultFilters.e = false
			}
		},
		escMap: {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#39;",
			"/": "&#x2F;",
			"`": "&#x60;",
			"=": "&#x3D;"
		},
		F: { //F stands for filters
			d: function (str) {
				return str
			},
			e: function (str) {
				//To deal with XSS. Based on Escape implementations of Mustache.JS and Marko, then customized.
				function replaceChar(s) {
					return Sqrl.escMap[s]
				}
				var newStr = String(str)
				if (/[&<>"'`=\/]/.test(newStr)) {
					return newStr.replace(/[&<>"'`=\/]/g, replaceChar)
				} else {
					return newStr
				}
			}
			//Don't need a filter for unescape because that's just a flag telling Squirrelly not to escape
		},
		defineFilter: function (name, callback) {
			Sqrl.F[name] = callback
			Sqrl.Filters = Sqrl.F
		}
	}
	//Shorthands
	Sqrl.H = Sqrl.Helpers
	Sqrl.P = Sqrl.Partials
	Sqrl.F.escape = Sqrl.F.e
	Sqrl.Filters = Sqrl.F
	/*
		Sqrl.Str = function (thing) { // To make it more safe...I'll probably have people opt in for performance though
			if (typeof thing === 'string') {
				return thing
			} else if (typeof thing === 'object') {
				return JSON.stringify(thing)
			} else {
				return thing.toString()
			}
	}*/

	Sqrl.nativeHelpers = {
		if: {
			helperStart: function (param) { //helperStart is called with (params, id) but id isn't needed
				return "if(" + param + "){"
			},
			helperEnd: function () {
				return "}"
			},
			blocks: {
				else: function () { //called with (id) but neither param is needed
					return "}else{"
				}
			}
		},
		each: {
			helperStart: function (param) { //helperStart is called with (params, id) but id isn't needed
				return "for(var i=0;i<" + param + ".length; i++){tmpltRes+=(function(hvals){var tmpltRes='';"
			},
			helperEnd: function (param) {
				return "return tmpltRes})({this:" + param + "[i],index:i})};"
			}
		},
		foreach: {
			helperStart: function (param) {
				return "for(var key in " + param + "){if(!" + param + ".hasOwnProperty(key)) continue;tmpltRes+=(function(hvals){var tmpltRes='';"
			},
			helperEnd: function (param) {
				return "return tmpltRes})({this:" + param + "[key], key: key})};"
			}
		},
		log: {
			helperStart: function (param) {
				return "console.log(" + param + ");"
			},
			helperEnd: function () {
				return ""
			}
		}
	}

	Sqrl.Precompile = function (str) {
		var regEx = /{{ *?(?:(?:(?:(?:([a-zA-Z_$]+[\w]* *?(?:[^\s\w\($]+[^\n]*)*))|(?:@(?:([\w$]+:|(?:\.\.\/)+))? *(.+?) *))(?: *?(\| *?[^\n]+? *?)*?)?)|(?:([a-zA-Z_$]+[\w]*) *?\(([^\n]*)\) *?([A-Za-z$_]*[\w]*))|(?:\/ *?([a-zA-Z_$]+[\w]*))|(?:# *?([a-zA-Z_$]+[\w]*))|(?:([^]+?))) *?}}/g;
		var parameterHelperRefRegEx = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[\\]@(?:[\w$]*:)?[\w$]+|@(?:([\w$]*):)?([\w$]+)/g
		var lastIndex = 0
		var funcStr = ""
		var helperArray = [];
		var helperNumber = -1;
		var helperAutoId = 0;
		var helperContainsBlocks = {};
		while ((m = regEx.exec(str)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === regEx.lastIndex) {
				regEx.lastIndex++;
			}
			if (funcStr === "") {
				funcStr += "var tmpltRes=\'" + str.slice(lastIndex, m.index).replace(/'/g, "\\'") + '\';'
			} else {
				if (lastIndex !== m.index) {
					funcStr += 'tmpltRes+=\'' + str.slice(lastIndex, m.index).replace(/'/g, "\\'") + '\';'
				}
			}
			lastIndex = m[0].length + m.index
			if (m[1]) {
				//It's a global ref. p4 = filters
				funcStr += 'tmpltRes+=' + globalRef(m[1], m[4]) + ';'
			} else if (m[3]) {
				//It's a helper ref. p2 = id (with ':' after it) or path, p4 = filters
				funcStr += 'tmpltRes+=' + helperRef(m[3], m[2], m[4]) + ';'
			} else if (m[5]) {
				//It's a helper oTag. p6 parameters, p7 id
				var id = m[7]
				if (id === "" || id === null) {
					id = helperAutoId;
					helperAutoId++;
				}
				var native = false
				if (Sqrl.nativeHelpers.hasOwnProperty(m[5])) {
					native = true
				}
				helperNumber += 1;
				var params = m[6] || ""
				params = params.replace(parameterHelperRefRegEx, function (m, p1, p2) { // p1 scope, p2 string
					if (typeof p2 === 'undefined') {
						return m
					} else {
						if (typeof p1 === 'undefined') {
							p1 = ''
						}
						return 'hvals' + p1 + '.' + p2
					}
				})
				if (!native) {
					params = '[' + params + ']'
				}
				var helperTag = {
					name: m[5],
					id: id,
					params: params,
					native: native
				}
				helperArray[helperNumber] = helperTag;
				if (native) {
					var nativeObj = Sqrl.nativeHelpers[m[5]]
					funcStr += nativeObj.helperStart(params, id)
				} else {
					funcStr += 'tmpltRes+=Sqrl.H.' + m[5] + '(' + params + ',function(hvals){var hvals' + id + '=hvals;'
				}
			} else if (m[8]) {
				//It's a helper cTag.
				var mostRecentHelper = helperArray[helperNumber];
				if (mostRecentHelper && mostRecentHelper.name === m[8]) {
					helperNumber -= 1;
					if (mostRecentHelper.native === true) {
						funcStr += Sqrl.nativeHelpers[mostRecentHelper.name].helperEnd(mostRecentHelper.params, mostRecentHelper.id)
					} else {
						if (helperContainsBlocks[mostRecentHelper.id]) {
							funcStr += "return blockRes}});"
						} else {
							funcStr += "return blockRes});"
						}
					}
				} else {
					console.error("Sorry, it doesn't appear that your closing helper tag matches your opening one.")
				}
			} else if (m[9]) {
				//It's a helper block.
				var parent = helperArray[helperNumber]
				if (parent.native) {
					var nativeH = Sqrl.nativeHelpers[parent.name]
					if (nativeH.blocks && nativeH.blocks[m[9]]) {
						funcStr += nativeH.blocks[m[9]](parent.id)
					} else {
						console.warn("Oops, looks like that native helper isn't configured to accept that block.")
					}
				} else {
					if (!helperContainsBlocks[parent.id]) {
						funcStr += "return blockRes}, {" + m[9] + ":function(hvals){var hvals" + parent.id + "=hvals;var blockRes=\'\';"
						helperContainsBlocks[parent.id] = true
					} else {
						funcStr += "return blockRes}," + m[9] + ":function(hvals){var hvals" + parent.id + "=hvals;var blockRes=\'\';"
					}
				}
			} else if (m[10]) {
				//It's a possible macro.
			} else {
				console.error("Err: Code 000")
			}

			function globalRef(refName, filters) {
				return parseFiltered('options.' + refName, filters)
			}

			function helperRef(name, id, filters) {
				var prefix;
				if (typeof id !== 'undefined') {
					if (/(?:\.\.\/)+/g.test(id)) {
						prefix = helperArray[helperNumber - (id.length / 3)].id
					} else {
						prefix = id.slice(0, -1)
					}
					return parseFiltered("hvals" + prefix + "." + name, filters)
				} //Implied 'else'
				return parseFiltered("hvals." + name, filters)
			}

			function parseFiltered(initialString, filterString) {
				var filtersArray;
				if (typeof filterString !== 'undefined' && filterString !== null) {
					filtersArray = filterString.split('|')
					for (var i = 0; i < filtersArray.length; i++) {
						filtersArray[i] = filtersArray[i].trim()
						if (filtersArray[i] === "") continue
						if (filtersArray[i] === "unescape" || filtersArray[i] === "u") continue
						if (Sqrl.defaultFilters.e && (filtersArray[i] === "e" || filtersArray[i] === "escape")) continue
						initialString = 'Sqrl.F.' + filtersArray[i] + '(' + initialString + ')'
					}
				}
				for (key in Sqrl.defaultFilters) {
					if (Sqrl.defaultFilters[key] === true) {
						if (typeof filtersArray !== 'undefined' && (filtersArray.includes("u") || filtersArray.includes("unescape")) && (key === "e" || key === "escape")) continue;
						initialString = 'Sqrl.F.' + key + '(' + initialString + ')'
					}
				}
				return initialString
			}

		}
		if (str.length > regEx.lastIndex) {
			if (funcStr === "") {
				funcStr += "var tmpltRes=\'" + str.slice(lastIndex, str.length).replace(/'/g, "\\'") + '\';'
			} else if (lastIndex !== str.length) {
				funcStr += "tmpltRes+=\'" + str.slice(lastIndex, str.length).replace(/'/g, "\\'") + '\';'
			}
		}
		funcStr += 'return tmpltRes'
		var func = new Function('options', 'Sqrl', funcStr.replace(/\n/g, '\\n').replace(/\r/g, '\\r'))
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