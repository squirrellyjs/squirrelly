(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Sqrl"] = factory();
	else
		root["Sqrl"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/express.js":
/*!************************!*\
  !*** ./src/express.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (filePath, options, callback) {\r\n    fs.readFile(filePath, function (err, content) {\r\n        if (err) {\r\n            return callback(err)\r\n        }\r\n        var sqrlString = content.toString()\r\n        var template = Sqrl.Precompile(sqrlString)\r\n        var renderedFile = Sqrl.Render(template, options)\r\n        return callback(null, renderedFile)\r\n    })\r\n});\n\n//# sourceURL=webpack://Sqrl/./src/express.js?");

/***/ }),

/***/ "./src/filters.js":
/*!************************!*\
  !*** ./src/filters.js ***!
  \************************/
/*! exports provided: d, e, escape */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"d\", function() { return d; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"e\", function() { return e; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"escape\", function() { return e; });\nfunction d(str) {\r\n    return str\r\n}\r\n\r\nfunction e(str) {\r\n    var escMap = {\r\n        \"&\": \"&amp;\",\r\n        \"<\": \"&lt;\",\r\n        \">\": \"&gt;\",\r\n        '\"': \"&quot;\",\r\n        \"'\": \"&#39;\",\r\n        \"/\": \"&#x2F;\",\r\n        \"`\": \"&#x60;\",\r\n        \"=\": \"&#x3D;\"\r\n    }\r\n    //To deal with XSS. Based on Escape implementations of Mustache.JS and Marko, then customized.\r\n    function replaceChar(s) {\r\n        return escMap[s]\r\n    }\r\n    var newStr = String(str)\r\n    if (/[&<>\"'`=\\/]/.test(newStr)) {\r\n        return newStr.replace(/[&<>\"'`=\\/]/g, replaceChar)\r\n    } else {\r\n        return newStr\r\n    }\r\n}\r\n//Don't need a filter for unescape because that's just a flag telling Squirrelly not to escape\r\n\r\n\n\n//# sourceURL=webpack://Sqrl/./src/filters.js?");

/***/ }),

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nvar helpers = { // For helpers. None included to make it more lightweight\r\n\r\n    Date: function (args, content, blocks, options) {\r\n        var today = new Date();\r\n        var dd = today.getDate();\r\n        var mm = today.getMonth() + 1; //January is 0!\r\n        var yyyy = today.getFullYear();\r\n        if (dd < 10) {\r\n            dd = '0' + dd\r\n        }\r\n        if (mm < 10) {\r\n            mm = '0' + mm\r\n        }\r\n        today = mm + '/' + dd + '/' + yyyy;\r\n        return today\r\n    }\r\n}\r\n\r\n\r\nif (false) {}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (helpers);\n\n//# sourceURL=webpack://Sqrl/./src/helpers.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: __express, H, Precompile, defineFilter, defineHelper, Render, defaultFilters, autoEscape, F */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _express_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./express.js */ \"./src/express.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"__express\", function() { return _express_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers.js */ \"./src/helpers.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"H\", function() { return _helpers_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]; });\n\n/* harmony import */ var _precompile_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./precompile.js */ \"./src/precompile.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Precompile\", function() { return _precompile_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"]; });\n\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ \"./src/utils.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"defineFilter\", function() { return _utils_js__WEBPACK_IMPORTED_MODULE_3__[\"defineFilter\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"defineHelper\", function() { return _utils_js__WEBPACK_IMPORTED_MODULE_3__[\"defineHelper\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Render\", function() { return _utils_js__WEBPACK_IMPORTED_MODULE_3__[\"Render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"defaultFilters\", function() { return _utils_js__WEBPACK_IMPORTED_MODULE_3__[\"defaultFilters\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"autoEscape\", function() { return _utils_js__WEBPACK_IMPORTED_MODULE_3__[\"autoEscape\"]; });\n\n/* harmony import */ var _filters_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./filters.js */ \"./src/filters.js\");\n/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, \"F\", function() { return _filters_js__WEBPACK_IMPORTED_MODULE_4__; });\n\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack://Sqrl/./src/index.js?");

/***/ }),

/***/ "./src/nativeHelpers.js":
/*!******************************!*\
  !*** ./src/nativeHelpers.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nvar nativeHelpers = {\r\n    if: {\r\n        helperStart: function (param) { //helperStart is called with (params, id) but id isn't needed\r\n            return \"if(\" + param + \"){\"\r\n        },\r\n        helperEnd: function () {\r\n            return \"}\"\r\n        },\r\n        blocks: {\r\n            else: function () { //called with (id) but neither param is needed\r\n                return \"}else{\"\r\n            }\r\n        }\r\n    },\r\n    each: {\r\n        helperStart: function (param, id) { //helperStart is called with (params, id) but id isn't needed\r\n            return \"for(var i=0;i<\" + param + \".length; i++){tmpltRes+=(function(hvals){var tmpltRes='';var hvals\" + id + \"=hvals;\"\r\n        },\r\n        helperEnd: function (param) {\r\n            return \"return tmpltRes})({this:\" + param + \"[i],index:i})};\"\r\n        }\r\n    },\r\n    foreach: {\r\n        helperStart: function (param, id) {\r\n            return \"for(var key in \" + param + \"){if(!\" + param + \".hasOwnProperty(key)) continue;tmpltRes+=(function(hvals){var tmpltRes='';var hvals\" + id + \"=hvals;\"\r\n        },\r\n        helperEnd: function (param) {\r\n            return \"return tmpltRes})({this:\" + param + \"[key], key: key})};\"\r\n        }\r\n    },\r\n    log: {\r\n        helperStart: function (param) {\r\n            return \"console.log(\" + param + \");\"\r\n        },\r\n        helperEnd: function () {\r\n            return \"\"\r\n        }\r\n    }\r\n}\r\n//We don't need to export nativeHelpers for the runtime script\r\nif (true) {\r\n    nativeHelpers = {}\r\n}\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (nativeHelpers);\n\n//# sourceURL=webpack://Sqrl/./src/nativeHelpers.js?");

/***/ }),

/***/ "./src/precompile.js":
/*!***************************!*\
  !*** ./src/precompile.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _regexps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regexps.js */ \"./src/regexps.js\");\n/* harmony import */ var _nativeHelpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nativeHelpers.js */ \"./src/nativeHelpers.js\");\n\r\n\r\n\r\n\r\nfunction Precompile(str) {\r\n    var lastIndex = 0\r\n    var funcStr = \"\"\r\n    var helperArray = [];\r\n    var helperNumber = -1;\r\n    var helperAutoId = 0;\r\n    var helperContainsBlocks = {};\r\n    var m;\r\n    while ((m = _regexps_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].exec(str)) !== null) {\r\n        // This is necessary to avoid infinite loops with zero-width matches\r\n        if (m.index === _regexps_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].lastIndex) {\r\n            _regexps_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].lastIndex++;\r\n        }\r\n        if (funcStr === \"\") {\r\n            funcStr += \"var tmpltRes=\\'\" + str.slice(lastIndex, m.index).replace(/'/g, \"\\\\'\") + '\\';'\r\n        } else {\r\n            if (lastIndex !== m.index) {\r\n                funcStr += 'tmpltRes+=\\'' + str.slice(lastIndex, m.index).replace(/'/g, \"\\\\'\") + '\\';'\r\n            }\r\n        }\r\n        lastIndex = m[0].length + m.index\r\n        if (m[1]) {\r\n            //It's a global ref. p4 = filters\r\n            funcStr += 'tmpltRes+=' + globalRef(m[1], m[4]) + ';'\r\n        } else if (m[3]) {\r\n            //It's a helper ref. p2 = id (with ':' after it) or path, p4 = filters\r\n            funcStr += 'tmpltRes+=' + helperRef(m[3], m[2], m[4]) + ';'\r\n        } else if (m[5]) {\r\n            //It's a helper oTag. p6 parameters, p7 id\r\n            var id = m[7]\r\n            if (id === \"\" || id === null) {\r\n                id = helperAutoId;\r\n                helperAutoId++;\r\n            }\r\n            var native = _nativeHelpers_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].hasOwnProperty(m[5]) //true or false\r\n            helperNumber += 1;\r\n            var params = m[6] || \"\"\r\n            params = params.replace(_regexps_js__WEBPACK_IMPORTED_MODULE_0__[\"paramHelperRefRegExp\"], function (m, p1, p2) { // p1 scope, p2 string\r\n                if (typeof p2 === 'undefined') {\r\n                    return m\r\n                } else {\r\n                    if (typeof p1 === 'undefined') {\r\n                        p1 = ''\r\n                    }\r\n                    return 'hvals' + p1 + '.' + p2\r\n                }\r\n            })\r\n            if (!native) {\r\n                params = '[' + params + ']'\r\n            }\r\n            var helperTag = {\r\n                name: m[5],\r\n                id: id,\r\n                params: params,\r\n                native: native\r\n            }\r\n            helperArray[helperNumber] = helperTag;\r\n            if (native) {\r\n                var nativeObj = _nativeHelpers_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"][m[5]]\r\n                funcStr += nativeObj.helperStart(params, id)\r\n            } else {\r\n                funcStr += 'tmpltRes+=Sqrl.H.' + m[5] + '(' + params + ',function(hvals){var hvals' + id + '=hvals;'\r\n            }\r\n        } else if (m[8]) {\r\n            //It's a helper cTag.\r\n            var mostRecentHelper = helperArray[helperNumber];\r\n            if (mostRecentHelper && mostRecentHelper.name === m[8]) {\r\n                helperNumber -= 1;\r\n                if (mostRecentHelper.native === true) {\r\n                    funcStr += _nativeHelpers_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"][mostRecentHelper.name].helperEnd(mostRecentHelper.params, mostRecentHelper.id)\r\n                } else {\r\n                    if (helperContainsBlocks[mostRecentHelper.id]) {\r\n                        funcStr += \"return tmpltRes}});\"\r\n                    } else {\r\n                        funcStr += \"return tmpltRes});\"\r\n                    }\r\n                }\r\n            } else {\r\n                console.error(\"Sorry, looks like your opening and closing tags don't match\")\r\n            }\r\n        } else if (m[9]) {\r\n            //It's a helper block.\r\n            var parent = helperArray[helperNumber]\r\n            if (parent.native) {\r\n                var nativeH = _nativeHelpers_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"][parent.name]\r\n                if (nativeH.blocks && nativeH.blocks[m[9]]) {\r\n                    funcStr += nativeH.blocks[m[9]](parent.id)\r\n                } else {\r\n                    console.warn(\"Native helper '%s' doesn't accept that block.\", parent.name)\r\n                }\r\n            } else {\r\n                if (!helperContainsBlocks[parent.id]) {\r\n                    funcStr += \"return tmpltRes}, {\" + m[9] + \":function(hvals){var hvals\" + parent.id + \"=hvals;var tmpltRes=\\'\\';\"\r\n                    helperContainsBlocks[parent.id] = true\r\n                } else {\r\n                    funcStr += \"return tmpltRes},\" + m[9] + \":function(hvals){var hvals\" + parent.id + \"=hvals;var tmpltRes=\\'\\';\"\r\n                }\r\n            }\r\n        } else if (m[10]) {\r\n            //It's a possible macro.\r\n        } else {\r\n            console.error(\"Err: Code 000\")\r\n        }\r\n\r\n        function globalRef(refName, filters) {\r\n            return parseFiltered('options.' + refName, filters)\r\n        }\r\n\r\n        function helperRef(name, id, filters) {\r\n            var prefix;\r\n            if (typeof id !== 'undefined') {\r\n                if (/(?:\\.\\.\\/)+/g.test(id)) {\r\n                    prefix = helperArray[helperNumber - (id.length / 3)].id\r\n                } else {\r\n                    prefix = id.slice(0, -1)\r\n                }\r\n                return parseFiltered(\"hvals\" + prefix + \".\" + name, filters)\r\n            } //Implied 'else'\r\n            return parseFiltered(\"hvals.\" + name, filters)\r\n        }\r\n\r\n        function parseFiltered(initialString, filterString) {\r\n            var filtersArray;\r\n            if (typeof filterString !== 'undefined' && filterString !== null) {\r\n                filtersArray = filterString.split('|')\r\n                for (var i = 0; i < filtersArray.length; i++) {\r\n                    filtersArray[i] = filtersArray[i].trim()\r\n                    if (filtersArray[i] === \"\") continue\r\n                    if (filtersArray[i] === \"unescape\" || filtersArray[i] === \"u\") continue\r\n                    if (Sqrl.defaultFilters.e && (filtersArray[i] === \"e\" || filtersArray[i] === \"escape\")) continue\r\n                    initialString = 'Sqrl.F.' + filtersArray[i] + '(' + initialString + ')'\r\n                }\r\n            }\r\n            for (var key in Sqrl.defaultFilters) {\r\n                if (Sqrl.defaultFilters[key] === true) {\r\n                    if (typeof filtersArray !== 'undefined' && (filtersArray.includes(\"u\") || filtersArray.includes(\"unescape\")) && (key === \"e\" || key === \"escape\")) continue;\r\n                    initialString = 'Sqrl.F.' + key + '(' + initialString + ')'\r\n                }\r\n            }\r\n            return initialString\r\n        }\r\n\r\n    }\r\n    if (str.length > _regexps_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].lastIndex) {\r\n        if (funcStr === \"\") {\r\n            funcStr += \"var tmpltRes=\\'\" + str.slice(lastIndex, str.length).replace(/'/g, \"\\\\'\") + '\\';'\r\n        } else if (lastIndex !== str.length) {\r\n            funcStr += \"tmpltRes+=\\'\" + str.slice(lastIndex, str.length).replace(/'/g, \"\\\\'\") + '\\';'\r\n        }\r\n    }\r\n    funcStr += 'return tmpltRes'\r\n    var func = new Function('options', 'Sqrl', funcStr.replace(/\\n/g, '\\\\n').replace(/\\r/g, '\\\\r'))\r\n    return func\r\n}\r\n\r\nif (true) {\r\n    Precompile = {}\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (Precompile);\n\n//# sourceURL=webpack://Sqrl/./src/precompile.js?");

/***/ }),

/***/ "./src/regexps.js":
/*!************************!*\
  !*** ./src/regexps.js ***!
  \************************/
/*! exports provided: default, paramHelperRefRegExp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"paramHelperRefRegExp\", function() { return paramHelperRefRegExp; });\n/* harmony default export */ __webpack_exports__[\"default\"] = (/{{ *?(?:(?:(?:(?:([a-zA-Z_$]+[\\w]* *?(?:[^\\s\\w\\($]+[^\\n]*)*))|(?:@(?:([\\w$]+:|(?:\\.\\.\\/)+))? *(.+?) *))(?: *?(\\| *?[^\\n]+ *?)*)*)|(?:([a-zA-Z_$]+[\\w]*) *?\\(([^\\n]*)\\) *?([A-Za-z$_]*[\\w]*))|(?:\\/ *?([a-zA-Z_$]+[\\w]*))|(?:# *?([a-zA-Z_$]+[\\w]*))|(?:([^]+?))) *?}}/g);\r\nvar paramHelperRefRegExp = /\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|[\\\\]@(?:[\\w$]*:)?[\\w$]+|@(?:([\\w$]*):)?([\\w$]+)/g\r\n\r\n\r\n\r\n//The default RegExp broken down:\r\n\r\n//Total RegEx:\r\n/* START REGEXP\r\n{{ *? //the beginning\r\n(?: //or for each possible tag\r\n(?: //if a global or helper ref\r\n(?: //choosing global or helper ref\r\n(?:([a-zA-Z_$]+[\\w]* *?(?:[^\\s\\w\\($]+[^\\n]*)*)) //global reference\r\n|\r\n(?:@(?:([\\w$]+:|(?:\\.\\.\\/)+))? *(.+?) *) //helper reference\r\n)\r\n(?: *?(\\| *?[^\\n]+? *?)*?)? //filter\r\n) //end if a global or helper ref\r\n| //now if a helper oTag\r\n(?:([a-zA-Z_$]+[\\w]*) *?\\(([^\\n]*)\\) *?([A-Za-z$_]*[\\w]*))\r\n| //now if a helper cTag\r\n(?:\\/ *?([a-zA-Z_$]+[\\w]*))\r\n| //now if a helper block\r\n(?:# *?([a-zA-Z_$]+[\\w]*))\r\n| //now if a possible macro\r\n(?:([^]+?))\r\n) //end or for each possible tag\r\n *?}}\t\t\r\n\r\nEND REGEXP*/\r\n/*\r\np1: global ref main\r\np2: helper ref id (with ':' after it) or path\r\np3: helper ref main\r\np4: filters\r\np5: helper name\r\np6: helper parameters\r\np7: helper id\r\np8: helper cTag name\r\np9: helper block name\r\np10: possible macro\r\nWhich equals: /{{ *?(?:(?:(?:(?:([a-zA-Z_$]+[\\w]* *?(?:[^\\s\\w\\($]+[^\\n]*)*))|(?:@(?:([\\w$]+:|(?:\\.\\.\\/)+))? *(.+?) *))(?: *?(\\| *?[^\\n]+ *?)*)*)|(?:([a-zA-Z_$]+[\\w]*) *?\\(([^\\n]*)\\) *?([A-Za-z$_]*[\\w]*))|(?:\\/ *?([a-zA-Z_$]+[\\w]*))|(?:# *?([a-zA-Z_$]+[\\w]*))|(?:([^]+?))) *?}}/g\r\nHere's the RegExp I use to turn the expanded version between START REGEXP and END REGEXP to a working one: I replace [\\f\\n\\r\\t\\v\\u00a0\\u1680\\u2000\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff]| \\/\\/[\\w ']+\\n with nothing.\r\n*/\n\n//# sourceURL=webpack://Sqrl/./src/regexps.js?");

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! exports provided: defineFilter, defineHelper, Render, defaultFilters, autoEscape */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"defineFilter\", function() { return defineFilter; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"defineHelper\", function() { return defineHelper; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Render\", function() { return Render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"defaultFilters\", function() { return defaultFilters; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"autoEscape\", function() { return autoEscape; });\n/* harmony import */ var _filters_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./filters.js */ \"./src/filters.js\");\n/* harmony import */ var _precompile_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./precompile.js */ \"./src/precompile.js\");\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.js */ \"./src/index.js\");\n/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers.js */ \"./src/helpers.js\");\n\r\n\r\n\r\n\r\n\r\nfunction defineFilter(name, callback) {\r\n    _filters_js__WEBPACK_IMPORTED_MODULE_0__[name] = callback\r\n}\r\n\r\nfunction defineHelper(name, callback) {\r\n    _helpers_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"][name] = callback\r\n}\r\n/*export function defineLayout(name, callback) {\r\n    Sqrl.Helpers[name] = callback\r\n    Sqrl.H = Sqrl.Helpers\r\n}*/\r\n\r\nfunction Render(template, options) {\r\n    if (typeof template === \"function\") {\r\n        return template(options, _index_js__WEBPACK_IMPORTED_MODULE_2__)\r\n    } else if (typeof template === \"string\") {\r\n        var templateFunc = Object(_precompile_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(template)\r\n        return templateFunc(options, _index_js__WEBPACK_IMPORTED_MODULE_2__)\r\n    }\r\n}\r\n\r\nvar defaultFilters = {\r\n    /* All strings are automatically passed through the \"d\" filter (stands for default, but is shortened to save space)\r\nand then each of the default filters the user\r\nHas set to true. This opens up a realm of possibilities like autoEscape, etc.\r\nList of shortened letters: d: default, e: escape, u: unescape. Escape and Unescape are also valid filter names*/\r\n    e: false // Escape is turned off by default for performance\r\n}\r\n\r\nfunction autoEscape(bool) {\r\n    if (bool) {\r\n        defaultFilters.e = true\r\n    } else {\r\n        defaultFilters.e = false\r\n    }\r\n}\n\n//# sourceURL=webpack://Sqrl/./src/utils.js?");

/***/ })

/******/ });
});