(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Sqrl"] = factory();
	else
		root["Sqrl"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
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

/***/ "./src/compile.js":
/*!************************!*\
  !*** ./src/compile.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _regexps__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regexps */ "./src/regexps.js");
/* harmony import */ var _nativeHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nativeHelpers */ "./src/nativeHelpers.js");
/* harmony import */ var _filters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./filters */ "./src/filters.js");
/* harmony import */ var _partials__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./partials */ "./src/partials.js");
/* global RUNTIME */





function Compile (str) {
  var lastIndex = 0
  var funcStr = '' // This will be called with Function() and returned
  var helperArray = [] // A list of all 'outstanding' helpers, or unclosed helpers
  var helperNumber = -1
  var helperAutoId = 0 // Squirrelly automatically generates an ID for helpers that don't have a custom ID
  var helperContainsBlocks = {} // If a helper contains any blocks, helperContainsBlocks[helperID] will be set to true
  var m
  Object(_regexps__WEBPACK_IMPORTED_MODULE_0__["setup"])()
  while ((m = _regexps__WEBPACK_IMPORTED_MODULE_0__["regEx"].exec(str)) !== null) {
    if (funcStr === '') {
      funcStr += "var tR='" + str.slice(lastIndex, m.index).replace(/'/g, "\\'") + '\';'
    } else if (lastIndex !== m.index) {
      funcStr += "tR+='" + str.slice(lastIndex, m.index).replace(/'/g, "\\'") + '\';'
    }
    lastIndex = m[0].length + m.index
    if (m[1]) {
      // It's a global ref. p4 = filters
      funcStr += 'tR+=' + globalRef(m[1], m[4]) + ';'
    } else if (m[3]) {
      // It's a helper ref. p2 = id (with ':' after it) or path, p4 = filters
      funcStr += 'tR+=' + helperRef(m[3], m[2], m[4]) + ';'
    } else if (m[5]) {
      // It's a helper oTag. p6 parameters, p7 id
      var id = m[7]
      if (id === '' || id === null) {
        id = helperAutoId
        helperAutoId++
      }
      var native = _nativeHelpers__WEBPACK_IMPORTED_MODULE_1__["default"].hasOwnProperty(m[5]) // true or false
      helperNumber += 1
      var params = m[6] || ''
      params = Object(_regexps__WEBPACK_IMPORTED_MODULE_0__["replaceParamHelpers"])(params)
      if (!native) {
        params = '[' + params + ']'
      }
      var helperTag = {
        name: m[5],
        id: id,
        params: params,
        native: native
      }
      helperArray[helperNumber] = helperTag
      if (native) {
        funcStr += _nativeHelpers__WEBPACK_IMPORTED_MODULE_1__["default"][m[5]].helperStart(params, id)
        lastIndex = _regexps__WEBPACK_IMPORTED_MODULE_0__["regEx"].lastIndex // the changeTags function sets lastIndex already
      } else {
        funcStr += 'tR+=Sqrl.H.' + m[5] + '(' + params + ',function(hvals){var hvals' + id + "=hvals;var tR='';"
      }
    } else if (m[8]) {
      // It's a helper cTag.
      var mostRecentHelper = helperArray[helperNumber]
      if (mostRecentHelper && mostRecentHelper.name === m[8]) {
        helperNumber -= 1
        if (mostRecentHelper.native === true) {
          funcStr += _nativeHelpers__WEBPACK_IMPORTED_MODULE_1__["default"][mostRecentHelper.name].helperEnd(mostRecentHelper.params, mostRecentHelper.id)
        } else {
          if (helperContainsBlocks[mostRecentHelper.id]) {
            funcStr += 'return tR}});'
          } else {
            funcStr += 'return tR});'
          }
        }
      } else {
        console.error("Helper beginning & end don't match.")
      }
    } else if (m[9]) {
      // It's a helper block.
      var parent = helperArray[helperNumber]
      if (parent.native) {
        var nativeH = _nativeHelpers__WEBPACK_IMPORTED_MODULE_1__["default"][parent.name]
        if (nativeH.blocks && nativeH.blocks[m[9]]) {
          funcStr += nativeH.blocks[m[9]](parent.id)
          lastIndex = _regexps__WEBPACK_IMPORTED_MODULE_0__["regEx"].lastIndex // Some native helpers set regEx.lastIndex
        } else {
          console.warn("Native helper '%s' doesn't accept that block.", parent.name)
        }
      } else {
        if (!helperContainsBlocks[parent.id]) {
          funcStr += 'return tR},{' + m[9] + ':function(hvals){var hvals' + parent.id + "=hvals;var tR='';"
          helperContainsBlocks[parent.id] = true
        } else {
          funcStr += 'return tR},' + m[9] + ':function(hvals){var hvals' + parent.id + "=hvals;var tR='';"
        }
      }
    } else if (m[10]) {
      // It's a self-closing helper
      var innerParams = m[11] || ''
      innerParams = Object(_regexps__WEBPACK_IMPORTED_MODULE_0__["replaceParamHelpers"])(innerParams)
      if (m[10] === 'include') {
      // This code literally gets the template string up to the include self-closing helper,
      // adds the content of the partial, and adds the template string after the include self-closing helper
        var preContent = str.slice(0, m.index)
        var endContent = str.slice(m.index + m[0].length)
        var partialParams = innerParams.replace(/'|"/g, '') // So people can write {{include(mypartial)/}} or {{include('mypartial')/}}
        var partialContent = _partials__WEBPACK_IMPORTED_MODULE_3__["default"][partialParams]
        str = preContent + partialContent + endContent
        lastIndex = _regexps__WEBPACK_IMPORTED_MODULE_0__["regEx"].lastIndex = m.index
      } else if (_nativeHelpers__WEBPACK_IMPORTED_MODULE_1__["default"].hasOwnProperty(m[10]) && _nativeHelpers__WEBPACK_IMPORTED_MODULE_1__["default"][m[10]].hasOwnProperty('selfClosing')) {
        funcStr += _nativeHelpers__WEBPACK_IMPORTED_MODULE_1__["default"][m[10]].selfClosing(innerParams)
        lastIndex = _regexps__WEBPACK_IMPORTED_MODULE_0__["regEx"].lastIndex // changeTags sets regEx.lastIndex
      } else {
        funcStr += 'tR+=Sqrl.H.' + m[10] + '(' + innerParams + ');' // If it's not native, passing args to a non-native helper
      }
    }
    /* eslint-disable no-inner-declarations */
    function globalRef (refName, filters) {
      return Object(_filters__WEBPACK_IMPORTED_MODULE_2__["parseFiltered"])('options.' + refName, filters)
    }

    function helperRef (name, id, filters) {
      var prefix
      if (typeof id !== 'undefined') {
        if (/(?:\.\.\/)+/g.test(id)) { // Test if the helper reference is prefixed with ../
          prefix = helperArray[helperNumber - (id.length / 3) - 1].id
        } else {
          prefix = id.slice(0, -1)
        }
        return Object(_filters__WEBPACK_IMPORTED_MODULE_2__["parseFiltered"])('hvals' + prefix + '.' + name, filters)
      } // Implied 'else'
      return Object(_filters__WEBPACK_IMPORTED_MODULE_2__["parseFiltered"])('hvals.' + name, filters)
    }
    /* eslint-enable no-inner-declarations */
  }
  if (funcStr === '') {
    funcStr += "var tR='" + str.slice(lastIndex, str.length).replace(/'/g, "\\'") + "';"
  } else if (lastIndex !== str.length) {
    funcStr += "tR+='" + str.slice(lastIndex, str.length).replace(/'/g, "\\'") + "';"
  }
  funcStr += 'return tR'
  var func = new Function('options', 'Sqrl', funcStr.replace(/\n/g, '\\n').replace(/\r/g, '\\r')) //eslint-disable-line
  return func
}

if (true) { // Don't include Sqrl.Compile() in the runtime library, to make it more lightweight
  Compile = {} // eslint-disable-line no-func-assign
}

/* harmony default export */ __webpack_exports__["default"] = (Compile);


/***/ }),

/***/ "./src/filters.js":
/*!************************!*\
  !*** ./src/filters.js ***!
  \************************/
/*! exports provided: filters, defaultFilters, defaultFilterCache, setDefaultFilters, autoEscape, autoEscaping, cacheDefaultFilters, parseFiltered, default, defineFilter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filters", function() { return filters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultFilters", function() { return defaultFilters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultFilterCache", function() { return defaultFilterCache; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setDefaultFilters", function() { return setDefaultFilters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "autoEscape", function() { return autoEscape; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "autoEscaping", function() { return autoEscaping; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cacheDefaultFilters", function() { return cacheDefaultFilters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseFiltered", function() { return parseFiltered; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return filters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defineFilter", function() { return defineFilter; });
var escMap = {
  '&': '&amp;',
  '<': '&lt;',
  '"': '&quot;',
  "'": '&#39;'
}

function replaceChar (s) {
  return escMap[s]
}

var escapeRegEx = /[&<"']/g
var escapeRegExTest = /[&<"']/

var filters = {
  e: function (str) {
    // To deal with XSS. Based on Escape implementations of Mustache.JS and Marko, then customized.
    var newStr = String(str)
    if (escapeRegExTest.test(newStr)) {
      return newStr.replace(escapeRegEx, replaceChar)
    } else {
      return newStr
    }
  }
}
// Don't need a filter for unescape because that's just a flag telling Squirrelly not to escape

var defaultFilters = {
  /*
  All strings are automatically passed through
  each of the default filters the user
  Has set to true. This opens up a realm of possibilities.
  */
  // e: false, // Escape is turned off by default for performance
}

var defaultFilterCache = {
  // This is to prevent having to re-calculate default filters every time you return a filtered string
  start: '',
  end: ''
}

function setDefaultFilters (obj) {
  if (obj === 'clear') { // If someone calls Sqrl.setDefaultFilters('clear') it clears all default filters
    defaultFilters = {}
  } else {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        defaultFilters[key] = obj[key]
      }
    }
  }
  cacheDefaultFilters()
}

var autoEscape = true

function autoEscaping (bool) {
  autoEscape = bool
  return autoEscape
}

function cacheDefaultFilters () {
  defaultFilterCache = {
    start: '',
    end: ''
  }
  for (var key in defaultFilters) {
    if (!defaultFilters.hasOwnProperty(key) || !defaultFilters[key]) continue
    defaultFilterCache.start += 'Sqrl.F.' + key + '('
    defaultFilterCache.end += ')'
  }
}
function parseFiltered (initialString, filterString) {
  var filtersArray
  var safe
  var filterStart = ''
  var filterEnd = ''
  if (filterString && filterString !== '') {
    filtersArray = filterString.split('|')
    for (var i = 0; i < filtersArray.length; i++) {
      filtersArray[i] = filtersArray[i].trim() // Removing the spaces just in case someone put | filter| or | filter | or something similar
      if (filtersArray[i] === '') continue
      if (filtersArray[i] === 'safe') {
        // If 'safe' is one of the filters, set safe to true but don't add Sqrl.F.safe
        // Essentially, 'safe' is a flag telling Squirrelly not to autoEscape
        safe = true
        continue
      }
      filterStart = 'Sqrl.F.' + filtersArray[i] + '(' + filterStart
      filterEnd += ')'
    }
  }
  filterStart += defaultFilterCache.start
  filterEnd += defaultFilterCache.end
  if (!safe && autoEscape) {
    filterStart += 'Sqrl.F.e('
    filterEnd += ')'
  }

  return filterStart + initialString + filterEnd
}

function defineFilter (name, callback) {
  filters[name] = callback
}




/***/ }),

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var helpers = {
// No helpers are included by default for the sake of size,
// But there's an example of a helper below
/*
  Date: function (args, content, blocks, options) {
    var today = new Date()
    var dd = today.getDate()
    var mm = today.getMonth() + 1 // January is 0!
    var yyyy = today.getFullYear()
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }
    today = mm + '/' + dd + '/' + yyyy
    return today
  } */
}

/* harmony default export */ __webpack_exports__["default"] = (helpers);


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: H, Compile, defineFilter, defineHelper, defineNativeHelper, definePartial, Render, softCaching, renderFile, load, __express, F, setDefaultFilters, autoEscaping, defaultTags */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "H", function() { return _helpers__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _compile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./compile */ "./src/compile.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Compile", function() { return _compile__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "defineFilter", function() { return _utils__WEBPACK_IMPORTED_MODULE_2__["defineFilter"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "defineHelper", function() { return _utils__WEBPACK_IMPORTED_MODULE_2__["defineHelper"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "defineNativeHelper", function() { return _utils__WEBPACK_IMPORTED_MODULE_2__["defineNativeHelper"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "definePartial", function() { return _utils__WEBPACK_IMPORTED_MODULE_2__["definePartial"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Render", function() { return _utils__WEBPACK_IMPORTED_MODULE_2__["Render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "softCaching", function() { return _utils__WEBPACK_IMPORTED_MODULE_2__["softCaching"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "renderFile", function() { return _utils__WEBPACK_IMPORTED_MODULE_2__["renderFile"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "load", function() { return _utils__WEBPACK_IMPORTED_MODULE_2__["load"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "__express", function() { return _utils__WEBPACK_IMPORTED_MODULE_2__["__express"]; });

/* harmony import */ var _filters__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./filters */ "./src/filters.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "F", function() { return _filters__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setDefaultFilters", function() { return _filters__WEBPACK_IMPORTED_MODULE_3__["setDefaultFilters"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "autoEscaping", function() { return _filters__WEBPACK_IMPORTED_MODULE_3__["autoEscaping"]; });

/* harmony import */ var _regexps__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./regexps */ "./src/regexps.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "defaultTags", function() { return _regexps__WEBPACK_IMPORTED_MODULE_4__["defaultTags"]; });








/***/ }),

/***/ "./src/nativeHelpers.js":
/*!******************************!*\
  !*** ./src/nativeHelpers.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _regexps__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regexps */ "./src/regexps.js");
/* global RUNTIME */

var nativeHelpers = {
  if: {
    helperStart: function (param) { // helperStart is called with (params, id) but id isn't needed
      return 'if(' + param + '){'
    },
    helperEnd: function () {
      return '}'
    },
    blocks: {
      else: function () { // called with (id) but neither param is needed
        return '}else{'
      }
    }
  },
  each: {
    helperStart: function (param, id) { // helperStart is called with (params, id) but id isn't needed
      return 'for(var i=0;i<' + param + ".length; i++){tR+=(function(hvals){var tR='';var hvals" + id + '=hvals;'
    },
    helperEnd: function (param) {
      return 'return tR})({this:' + param + '[i],index:i})};'
    }
  },
  foreach: {
    helperStart: function (param, id) {
      return 'for(var key in ' + param + '){if(!' + param + ".hasOwnProperty(key)) continue;tR+=(function(hvals){var tR='';var hvals" + id + '=hvals;'
    },
    helperEnd: function (param) {
      return 'return tR})({this:' + param + '[key], key: key})};'
    }
  },
  log: {
    selfClosing: function (param) {
      return 'console.log(' + param + ');'
    }
  },
  tags: {
    selfClosing: function (param) {
      var firstTag = param.slice(0, param.indexOf(',')).trim()
      var secondTag = param.slice(param.indexOf(',') + 1).trim()
      Object(_regexps__WEBPACK_IMPORTED_MODULE_0__["changeTags"])(firstTag, secondTag)
      return ''
    }
  },
  js: { // The js self-closing helper allows you to inject JavaScript straight into your template function
    selfClosing: function (param) {
      return param + ';'
    }
  }
}
// We don't need to export nativeHelpers for the runtime script
if (true) {
  nativeHelpers = {}
}
/* harmony default export */ __webpack_exports__["default"] = (nativeHelpers);


/***/ }),

/***/ "./src/partials.js":
/*!*************************!*\
  !*** ./src/partials.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Partials = {/*
    partialName: "partialString"
*/}

/* harmony default export */ __webpack_exports__["default"] = (Partials);


/***/ }),

/***/ "./src/regexps.js":
/*!************************!*\
  !*** ./src/regexps.js ***!
  \************************/
/*! exports provided: initialRegEx, initialTags, regEx, tags, setup, defaultTags, changeTags, replaceParamHelpers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initialRegEx", function() { return initialRegEx; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initialTags", function() { return initialTags; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "regEx", function() { return regEx; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tags", function() { return tags; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setup", function() { return setup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultTags", function() { return defaultTags; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "changeTags", function() { return changeTags; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "replaceParamHelpers", function() { return replaceParamHelpers; });
var initialRegEx = /{{ *?(?:(?:(?:(?:([a-zA-Z_$][\w]* *?(?:[^\s\w($][^\n]*)*?))|(?:@(?:([\w$]+:|(?:\.\.\/)+))? *(.+?) *))(?: *?(\| *?[\w$]+? *?)+?)?)|(?:([a-zA-Z_$][\w]*) *?\(([^\n]*)\) *?([\w]*))|(?:\/ *?([a-zA-Z_$][\w]*))|(?:# *?([a-zA-Z_$][\w]*))|(?:([a-zA-Z_$][\w]*) *?\(([^\n]*)\) *?\/)|(?:!--[^]+?--)) *?}}/g
var initialTags = {
  s: '{{',
  e: '}}'
}

// The regExp below matches all helper references inside helper parameters
var paramHelperRefRegExp = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[\\]@(?:[\w$]*:)?[\w$]+|@(?:([\w$]*):)?([\w$]+)/g

var regEx = initialRegEx
var tags = initialTags

function setup () { // Resets the current tags to the default tags
  tags = initialTags
  regEx = initialRegEx
  regEx.lastIndex = 0
}

function defaultTags (tagArray) { // Redefine the default tags of the regexp
  changeTags(tagArray[0], tagArray[1])
  initialRegEx = regEx
  initialTags = tags
}

function changeTags (firstTag, secondTag) { // Update current tags
  var newRegEx = firstTag + regEx.source.slice(tags.s.length, 0 - tags.e.length) + secondTag
  var lastIndex = regEx.lastIndex
  tags = {
    s: firstTag,
    e: secondTag
  }
  regEx = RegExp(newRegEx, 'g')
  regEx.lastIndex = lastIndex
}

function replaceParamHelpers (params) {
  params = params.replace(paramHelperRefRegExp, function (m, p1, p2) { // p1 scope, p2 string
    if (typeof p2 === 'undefined') {
      return m
    } else {
      if (typeof p1 === 'undefined') {
        p1 = ''
      }
      return 'hvals' + p1 + '.' + p2
    }
  })
  return params
}

// The whole regular expression can be hard to comprehend, so here it's broken down.
// You can pass the string between "START REGEXP" and "END REGEXP" into a regular expression
// That removes whitespace and comments, and outputs a working regular expression.

/* START REGEXP
{{ *? //the beginning
(?: //or for each possible tag
(?: //if a global or helper ref
(?: //choosing global or helper ref
(?:([a-zA-Z_$][\w]* *?(?:[^\s\w($][^\n]*)*?)) //global reference
|
(?:@(?:([\w$]+:|(?:\.\.\/)+))? *(.+?) *) //helper reference
)
(?: *?(\| *?[\w$]+? *?)+?)? //filter
) //end if a global or helper ref
| //now if a helper oTag
(?:([a-zA-Z_$][\w]*) *?\(([^\n]*)\) *?([\w]*))
| //now if a helper cTag
(?:\/ *?([a-zA-Z_$][\w]*))
| //now if a helper block
(?:# *?([a-zA-Z_$][\w]*))
| //now for a self closing tag
(?:([a-zA-Z_$][\w]*) *?\(([^\n]*)\) *?\/)
| //now for comments
(?:!--[^]+?--)
) //end or for each possible tag
 *?}}

END REGEXP */
/*
p1: global ref main
p2: helper ref id (with ':' after it) or path
p3: helper ref main
p4: filters
p5: helper name
p6: helper parameters
p7: helper id
p8: helper cTag name
p9: helper block name
p10: self closing helper name
p11: self closing helper params
Here's the RegExp I use to turn the expanded version between START REGEXP and END REGEXP to a working one: I replace [\f\n\r\t\v\u00a0\u1680\u2000\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]| \/\/[\w ']+\n with nothing.
*/


/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! exports provided: defineFilter, defineHelper, defineNativeHelper, Render, definePartial, cache, softCache, softCaching, load, renderFile, __express */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defineFilter", function() { return defineFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defineHelper", function() { return defineHelper; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defineNativeHelper", function() { return defineNativeHelper; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Render", function() { return Render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "definePartial", function() { return definePartial; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cache", function() { return cache; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "softCache", function() { return softCache; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "softCaching", function() { return softCaching; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "load", function() { return load; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderFile", function() { return renderFile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__express", function() { return __express; });
/* harmony import */ var _filters__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./filters */ "./src/filters.js");
/* harmony import */ var _compile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./compile */ "./src/compile.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index */ "./src/index.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");
/* harmony import */ var _nativeHelpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./nativeHelpers */ "./src/nativeHelpers.js");
/* harmony import */ var _partials__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./partials */ "./src/partials.js");


 // So we can pass Sqrl as a parameter to Render()




function defineFilter (name, callback) {
  _filters__WEBPACK_IMPORTED_MODULE_0__["default"][name] = callback
}

function defineHelper (name, callback) {
  _helpers__WEBPACK_IMPORTED_MODULE_3__["default"][name] = callback
}

function defineNativeHelper (name, obj) {
  _nativeHelpers__WEBPACK_IMPORTED_MODULE_4__["default"][name] = obj
}

function Render (template, options) {
  // If the template parameter is a function, call that function with (options, Sqrl)
  // If it's a string, first compile the string and then call the function
  if (typeof template === 'function') {
    return template(options, _index__WEBPACK_IMPORTED_MODULE_2__)
  } else if (typeof template === 'string') {
    var res = load(options, template)(options, _index__WEBPACK_IMPORTED_MODULE_2__)
    return res
  }
}

function definePartial (name, str) {
  _partials__WEBPACK_IMPORTED_MODULE_5__["default"][name] = str
}

var cache = {}

var softCache = false

function softCaching (bool) {
  softCache = bool
}

function load (options, str) {
  var filePath = options.$file
  var name = options.$name
  if (options.$cache !== false) { // If caching isn't disabled
    if (filePath) { // If the $file attribute is passed in
      if (cache[filePath]) { // If the template is cached
        return cache[filePath] // Return template
      } else { // Otherwise, read file
        var fs = __webpack_require__(/*! fs */ "fs")
        var fileContent = fs.readFileSync(filePath, 'utf8')
        cache[filePath] = Object(_compile__WEBPACK_IMPORTED_MODULE_1__["default"])(fileContent) // Add the template to the cache
        return cache[filePath] // Then return the cached template
      }
    } else if (name) { // If the $name attribute is passed in
      if (cache[name]) { // If there's a cache for that name
        return cache[name] // Return cached template
      } else if (str) { // Otherwise, as long as there's a string passed in
        cache[name] = Object(_compile__WEBPACK_IMPORTED_MODULE_1__["default"])(str) // Add the template to the cache
        return cache[name] // Return cached template
      }
    } else if (str) { // If the string is passed in
      if (softCache) {
        if (cache[str]) { // If it's cached
          return cache[str]
        } else {
          cache[str] = Object(_compile__WEBPACK_IMPORTED_MODULE_1__["default"])(str) // Add it to cache
          return cache[str]
        }
      } else {
        return Object(_compile__WEBPACK_IMPORTED_MODULE_1__["default"])(str)
      }
    } else {
      return 'Error'
    }
  } else { // If caching is disabled
    return Object(_compile__WEBPACK_IMPORTED_MODULE_1__["default"])(str)
  }
}

function renderFile (filePath, options) {
  options.$file = filePath
  return load(options)(options, _index__WEBPACK_IMPORTED_MODULE_2__)
}

function __express (filePath, options, callback) {
  return callback(null, renderFile(filePath, options))
}


/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ })

/******/ });
});
//# sourceMappingURL=squirrelly.runtime.dev.js.map