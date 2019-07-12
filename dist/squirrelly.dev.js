(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.Sqrl = {}));
}(this, function (exports) { 'use strict';

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
  };

  var Partials = {/*
      partialName: "partialString"
  */};

  var initialRegEx = /{{ *?(?:(?:(?:(?:([\w$]+ *?(?:[^\s\w($][^\n]*?)*?))|(?:@(?:([\w$]+:|(?:\.\.\/)+))? *(.+?) *))(?: *?(\| *?[\w$]+? *?)+?)?)|(?:([\w$]+) *?\(([^\n]*?)\) *?([\w$]*))|(?:\/ *?([\w$]+))|(?:# *?([\w$]+))|(?:([\w$]+) *?\(([^\n]*?)\) *?\/)|(?:!--[^]+?--)) *?}}\n?/g;
  var initialTags = {
    s: '{{',
    e: '}}'
  };

  // The regExp below matches all helper references inside helper parameters
  var paramHelperRefRegExp = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[\\]@(?:[\w$]*:)?[\w$]+|@(?:([\w$]*):)?([\w$]+)/g;

  var regEx = initialRegEx;
  var tags = initialTags;

  function setup () { // Resets the current tags to the default tags
    tags = initialTags;
    regEx = initialRegEx;
    regEx.lastIndex = 0;
  }

  function defaultTags (tagArray) { // Redefine the default tags of the regexp
    changeTags(tagArray[0], tagArray[1]);
    initialRegEx = regEx;
    initialTags = tags;
  }

  function changeTags (firstTag, secondTag) { // Update current tags
    var newRegEx = firstTag + regEx.source.slice(tags.s.length, 0 - (tags.e.length + 3)) + secondTag + '\\n?';
    var lastIndex = regEx.lastIndex;
    tags = {
      s: firstTag,
      e: secondTag
    };
    regEx = RegExp(newRegEx, 'g');
    regEx.lastIndex = lastIndex;
  }

  function replaceParamHelpers (params) {
    params = params.replace(paramHelperRefRegExp, function (m, p1, p2) { // p1 scope, p2 string
      if (typeof p2 === 'undefined') {
        return m
      } else {
        if (typeof p1 === 'undefined') {
          p1 = '';
        }
        return 'hvals' + p1 + '.' + p2
      }
    });
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
  (?:([\w$]+ *?(?:[^\s\w($][^\n]*?)*?)) //global reference
  |
  (?:@(?:([\w$]+:|(?:\.\.\/)+))? *(.+?) *) //helper reference
  )
  (?: *?(\| *?[\w$]+? *?)+?)? //filter
  ) //end if a global or helper ref
  | //now if a helper oTag
  (?:([\w$]+) *?\(([^\n]*?)\) *?([\w$]*))
  | //now if a helper cTag
  (?:\/ *?([\w$]+))
  | //now if a helper block
  (?:# *?([\w$]+))
  | //now for a self closing tag
  (?:([\w$]+) *?\(([^\n]*?)\) *?\/)
  | //now for comments
  (?:!--[^]+?--)
  ) //end or for each possible tag
   *?}}
  \n? //To replace a newline at the end of a line

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
        var firstTag = param.slice(0, param.indexOf(',')).trim();
        var secondTag = param.slice(param.indexOf(',') + 1).trim();
        changeTags(firstTag, secondTag);
        return ''
      }
    },
    js: { // The js self-closing helper allows you to inject JavaScript straight into your template function
      selfClosing: function (param) {
        return param + ';'
      }
    }
  };

  var escMap = {
    '&': '&amp;',
    '<': '&lt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  function replaceChar (s) {
    return escMap[s]
  }

  var escapeRegEx = /[&<"']/g;
  var escapeRegExTest = /[&<"']/;

  var filters = {
    e: function (str) {
      // To deal with XSS. Based on Escape implementations of Mustache.JS and Marko, then customized.
      var newStr = String(str);
      if (escapeRegExTest.test(newStr)) {
        return newStr.replace(escapeRegEx, replaceChar)
      } else {
        return newStr
      }
    }
  };
  // Don't need a filter for unescape because that's just a flag telling Squirrelly not to escape

  var defaultFilters = {
    /*
    All strings are automatically passed through each of the default filters the user
    Has set to true. This opens up a realm of possibilities.
    */
    // somefilter: false
  };

  var defaultFilterCache = {
    // This is to prevent having to re-calculate default filters every time you return a filtered string
    start: '',
    end: ''
  };

  function setDefaultFilters (obj) {
    if (obj === 'clear') { // If someone calls Sqrl.setDefaultFilters('clear') it clears all default filters
      defaultFilters = {};
    } else {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          defaultFilters[key] = obj[key];
        }
      }
    }
    cacheDefaultFilters();
  }

  var autoEscape = true;

  function autoEscaping (bool) {
    autoEscape = bool;
    return autoEscape
  }

  function cacheDefaultFilters () {
    defaultFilterCache = {
      start: '',
      end: ''
    };
    for (var key in defaultFilters) {
      if (!defaultFilters.hasOwnProperty(key) || !defaultFilters[key]) continue
      defaultFilterCache.start += 'Sqrl.F.' + key + '(';
      defaultFilterCache.end += ')';
    }
  }
  function parseFiltered (initialString, filterString) {
    var filtersArray;
    var safe = false;
    var filterStart = '';
    var filterEnd = '';
    if (filterString && filterString !== '') {
      filtersArray = filterString.split('|');
      for (var i = 0; i < filtersArray.length; i++) {
        filtersArray[i] = filtersArray[i].trim(); // Removing the spaces just in case someone put | filter| or | filter | or something similar
        if (filtersArray[i] === '') continue
        if (filtersArray[i] === 'safe') {
          // If 'safe' is one of the filters, set safe to true but don't add Sqrl.F.safe
          // Essentially, 'safe' is a flag telling Squirrelly not to autoEscape
          safe = true;
          continue
        }
        filterStart = 'Sqrl.F.' + filtersArray[i] + '(' + filterStart;
        filterEnd += ')';
      }
    }
    filterStart += defaultFilterCache.start;
    filterEnd += defaultFilterCache.end;
    if (!safe && autoEscape) {
      filterStart += 'Sqrl.F.e(';
      filterEnd += ')';
    }

    return filterStart + initialString + filterEnd
  }

  function Compile (str) {
    var lastIndex = 0; // Because lastIndex can be complicated, and this way the minifier can minify more
    var funcStr = ''; // This will be called with Function() and returned
    var helperArray = []; // A list of all 'outstanding' helpers, or unclosed helpers
    var helperNumber = -1;
    var helperAutoId = 0; // Squirrelly automatically generates an ID for helpers that don't have a custom ID
    var helperContainsBlocks = {}; // If a helper contains any blocks, helperContainsBlocks[helperID] will be set to true
    var m;
    setup();
    while ((m = regEx.exec(str)) !== null) {
      if (funcStr === '') {
        funcStr += "var tR='" + str.slice(lastIndex, m.index).replace(/'/g, "\\'") + '\';';
      } else if (lastIndex !== m.index) {
        funcStr += "tR+='" + str.slice(lastIndex, m.index).replace(/'/g, "\\'") + '\';';
      }
      lastIndex = m[0].length + m.index;
      if (m[1]) {
        // It's a global ref. p4 = filters
        funcStr += 'tR+=' + globalRef(m[1], m[4]) + ';';
      } else if (m[3]) {
        // It's a helper ref. p2 = id (with ':' after it) or path, p4 = filters
        funcStr += 'tR+=' + helperRef(m[3], m[2], m[4]) + ';';
      } else if (m[5]) {
        // It's a helper oTag. p6 parameters, p7 id
        var id = m[7];
        if (id === '' || id === null) {
          id = helperAutoId;
          helperAutoId++;
        }
        var native = nativeHelpers.hasOwnProperty(m[5]); // true or false
        helperNumber += 1;
        var params = m[6] || '';
        params = replaceParamHelpers(params);
        if (!native) {
          params = '[' + params + ']';
        }
        var helperTag = {
          name: m[5],
          id: id,
          params: params,
          native: native
        };
        helperArray[helperNumber] = helperTag;
        if (native) {
          funcStr += nativeHelpers[m[5]].helperStart(params, id);
          lastIndex = regEx.lastIndex; // the changeTags function sets lastIndex already
        } else {
          funcStr += 'tR+=Sqrl.H.' + m[5] + '(' + params + ',function(hvals){var hvals' + id + "=hvals;var tR='';";
        }
      } else if (m[8]) {
        // It's a helper cTag.
        var mostRecentHelper = helperArray[helperNumber];
        if (mostRecentHelper && mostRecentHelper.name === m[8]) {
          helperNumber -= 1;
          if (mostRecentHelper.native === true) {
            funcStr += nativeHelpers[mostRecentHelper.name].helperEnd(mostRecentHelper.params, mostRecentHelper.id);
          } else {
            if (helperContainsBlocks[mostRecentHelper.id]) {
              funcStr += 'return tR}});';
            } else {
              funcStr += 'return tR});';
            }
          }
        } else {
          console.error("Helper beginning & end don't match.");
        }
      } else if (m[9]) {
        // It's a helper block.
        var parent = helperArray[helperNumber];
        if (parent.native) {
          var nativeH = nativeHelpers[parent.name];
          if (nativeH.blocks && nativeH.blocks[m[9]]) {
            funcStr += nativeH.blocks[m[9]](parent.id);
            lastIndex = regEx.lastIndex; // Some native helpers set regEx.lastIndex
          } else {
            console.warn("Native helper '%s' doesn't accept that block.", parent.name);
          }
        } else {
          if (!helperContainsBlocks[parent.id]) {
            funcStr += 'return tR},{' + m[9] + ':function(hvals){var hvals' + parent.id + "=hvals;var tR='';";
            helperContainsBlocks[parent.id] = true;
          } else {
            funcStr += 'return tR},' + m[9] + ':function(hvals){var hvals' + parent.id + "=hvals;var tR='';";
          }
        }
      } else if (m[10]) {
        // It's a self-closing helper
        var innerParams = m[11] || '';
        innerParams = replaceParamHelpers(innerParams);
        if (m[10] === 'include') {
        // This code literally gets the template string up to the include self-closing helper,
        // adds the content of the partial, and adds the template string after the include self-closing helper
          var preContent = str.slice(0, m.index);
          var endContent = str.slice(m.index + m[0].length);
          var partialParams = innerParams.replace(/'|"/g, ''); // So people can write {{include(mypartial)/}} or {{include('mypartial')/}}
          var partialContent = Partials[partialParams];
          str = preContent + partialContent + endContent;
          lastIndex = regEx.lastIndex = m.index;
        } else if (nativeHelpers.hasOwnProperty(m[10]) && nativeHelpers[m[10]].hasOwnProperty('selfClosing')) {
          funcStr += nativeHelpers[m[10]].selfClosing(innerParams);
          lastIndex = regEx.lastIndex; // changeTags sets regEx.lastIndex
        } else {
          funcStr += 'tR+=Sqrl.H.' + m[10] + '(' + innerParams + ');'; // If it's not native, passing args to a non-native helper
        }
      }
      /* eslint-disable no-inner-declarations */
      function globalRef (refName, filters) {
        return parseFiltered('options.' + refName, filters)
      }

      function helperRef (name, id, filters) {
        var prefix;
        if (typeof id !== 'undefined') {
          if (/(?:\.\.\/)+/g.test(id)) { // Test if the helper reference is prefixed with ../
            prefix = helperArray[helperNumber - (id.length / 3) - 1].id;
          } else {
            prefix = id.slice(0, -1);
          }
          return parseFiltered('hvals' + prefix + '.' + name, filters)
        } // Implied 'else'
        return parseFiltered('hvals.' + name, filters)
      }
      /* eslint-enable no-inner-declarations */
    }
    if (funcStr === '') {
      funcStr += "var tR='" + str.slice(lastIndex, str.length).replace(/'/g, "\\'") + "';";
    } else if (lastIndex !== str.length) {
      funcStr += "tR+='" + str.slice(lastIndex, str.length).replace(/'/g, "\\'") + "';";
    }
    funcStr += 'return tR';
    var func = new Function('options', 'Sqrl', funcStr.replace(/\n/g, '\\n').replace(/\r/g, '\\r')); //eslint-disable-line
    return func
  }

  function defineFilter (name, callback) {
    filters[name] = callback;
  }

  function defineHelper (name, callback) {
    helpers[name] = callback;
  }

  function defineNativeHelper (name, obj) {
    nativeHelpers[name] = obj;
  }

  function Render (template, options) {
    // If the template parameter is a function, call that function with (options, squirrelly stuff)
    // If it's a string, first compile the string and then call the function
    if (typeof template === 'function') {
      return template(options, { H: helpers, F: filters, P: Partials })
    } else if (typeof template === 'string') {
      var res = load(options, template)(options, { H: helpers, F: filters, P: Partials });
      return res
    }
  }

  function definePartial (name, str) {
    Partials[name] = str;
  }

  var cache = {};

  function load (options, str) {
    var filePath = options.$file;
    var name = options.$name;
    var caching = options.$cache;
    if (caching !== false) {
      // If caching isn't disabled
      if (filePath) {
        // If the $file attribute is passed in
        if (cache[filePath]) {
          // If the template is cached
          return cache[filePath] // Return template
        } else {
          // Otherwise, read file
          var fs = require('fs');
          var fileContent = fs.readFileSync(filePath, 'utf8');
          cache[filePath] = Compile(fileContent); // Add the template to the cache
          return cache[filePath] // Then return the cached template
        }
      } else if (name) {
        // If the $name attribute is passed in
        if (cache[name]) {
          // If there's a cache for that name
          return cache[name] // Return cached template
        } else if (str) {
          // Otherwise, as long as there's a string passed in
          cache[name] = Compile(str); // Add the template to the cache
          return cache[name] // Return cached template
        }
      } else if (str) {
        // If the string is passed in
        if (caching === true) {
          if (cache[str]) {
            // If it's cached
            return cache[str]
          } else {
            cache[str] = Compile(str); // Add it to cache
            return cache[str]
          }
        } else {
          return Compile(str)
        }
      } else {
        return 'Error'
      }
    } else {
      // If caching is disabled
      if (filePath) {
        // If the $file attribute is passed in
        var fs2 = require('fs');
        return Compile(fs2.readFileSync(filePath, 'utf8')) // Then return the cached template
      } else if (str) {
        // If the string is passed in
        return Compile(str)
      } else {
        throw Error('No template')
      }
    }
  }

  function renderFile (filePath, options) {
    options.$file = filePath;
    return load(options)(options, { H: helpers, F: filters, P: Partials })
  }

  function __express (filePath, options, callback) {
    return callback(null, renderFile(filePath, options))
  }

  exports.Compile = Compile;
  exports.F = filters;
  exports.H = helpers;
  exports.P = Partials;
  exports.Render = Render;
  exports.__express = __express;
  exports.autoEscaping = autoEscaping;
  exports.defaultTags = defaultTags;
  exports.defineFilter = defineFilter;
  exports.defineHelper = defineHelper;
  exports.defineNativeHelper = defineNativeHelper;
  exports.definePartial = definePartial;
  exports.load = load;
  exports.renderFile = renderFile;
  exports.setDefaultFilters = setDefaultFilters;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=squirrelly.dev.js.map
