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

var initialRegEx = /{{ *?(?:(?:([\w$]+) *?\((.*?)\) *?([\w$]*))|(?:([\w$]+) *?\((.*?)\) *?\/)|(?:([\w$@].*?) *?((?:\| *?[\w$]+ *)*))|(?:\/ *?([\w$]+))|(?:# *?([\w$]+))|(?:!\-\-[^]+?\-\-)) *?}}\n?/g; // eslint-disable-line no-useless-escape
var initialTags = {
  s: '{{',
  e: '}}'
};

// The regExp below matches all helper references inside helper parameters
var paramHelperRefRegExp = /@(?:((?:\.\.\/)+)|([\w$]+):)?/g;

var regEx = initialRegEx;
var tags = initialTags;

function setup () {
  // Resets the current tags to the default tags
  tags = initialTags;
  regEx = initialRegEx;
  regEx.lastIndex = 0;
}

function defaultTags (tagArray) {
  // Redefine the default tags of the regexp
  changeTags(tagArray[0], tagArray[1]);
  initialRegEx = regEx;
  initialTags = tags;
}

function changeTags (firstTag, secondTag) {
  // Update current tags
  var newRegEx =
    firstTag +
    regEx.source.slice(tags.s.length, 0 - (tags.e.length + 3)) +
    secondTag +
    '\\n?';
  var lastIndex = regEx.lastIndex;
  tags = {
    s: firstTag,
    e: secondTag
  };
  regEx = RegExp(newRegEx, 'g');
  regEx.lastIndex = lastIndex;
}

function replaceHelperRefs (str, helperArray, helperNumber) {
  return str.replace(paramHelperRefRegExp, function (m, scope, id) {
    var suffix;
    if (scope && scope.length) {
      suffix = helperArray[helperNumber - scope.length / 3 - 1].id;
    } else if (id) {
      suffix = id;
    } else {
      suffix = '';
    }
    return 'hvals' + suffix + '.'
  })
}

// The whole regular expression can be hard to comprehend, so here it's broken down.
// You can pass the string between "START REGEXP" and "END REGEXP" into a regular expression
// That removes whitespace and comments, and outputs a working regular expression.

/* START REGEXP
{{ *? //the beginning
(?: //or for each possible tag
(?:([\w$]+) *?\((.*?)\) *?([\w$]*)) //if a helper oTag
| //now for a self closing tag
(?:([\w$]+) *?\((.*?)\) *?\/)
| //now if a ref
(?: //if a global or helper ref
([\w$@].*?) *? //ref content
((?:\| *?[\w$]+ *)*) //filters
) //end if a global or helper ref
| //now if a helper cTag
(?:\/ *?([\w$]+))
| //now if a helper block
(?:# *?([\w$]+))
| //now for comments
(?:!\-\-[^]+?\-\-)
) //end or for each possible tag
 *?}}
\n? //To replace a newline at the end of a line

END REGEXP */
/*
p1: helper start name
p2: helper start params
p3: helper start id
p4: self-closing helper name
p5: self-closing helper params
p6: ref content
p7: ref filters
p8: helper close name
p9: helper block name
Here's the RegExp I use to turn the expanded version between START REGEXP and END REGEXP to a working one: I replace [^\S ]+| \/\/[\w ']+\n with "".
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
  var funcStr = "var tR='';"; // This will be called with Function() and returned
  var helperArray = []; // A list of all 'outstanding' helpers, or unclosed helpers
  var helperNumber = -1;
  var helperAutoId = 0; // Squirrelly automatically generates an ID for helpers that don't have a custom ID
  var helperContainsBlocks = {}; // If a helper contains any blocks, helperContainsBlocks[helperID] will be set to true
  var m;

  function addString (indx) {
    if (lastIndex !== indx) {
      funcStr +=
        "tR+='" +
        str
          .slice(lastIndex, indx)
          .replace(/\\/g, '\\\\')
          .replace(/'/g, "\\'") +
        "';";
    }
  }
  function ref (content, filters) {
    // console.log('refcontent: ' + content)
    // console.log('filters: ' + filters)
    var replaced = replaceHelperRefs(content, helperArray, helperNumber);

    if (content[0] === '@') {
      return parseFiltered(replaced, filters)
    }
    return parseFiltered('options.' + replaced, filters)
  }

  setup();
  while ((m = regEx.exec(str)) !== null) {
    addString(m.index); // Add the string between the last tag (or start of file) and the current tag
    lastIndex = m[0].length + m.index;

    if (m[1]) {
      // helper start. m[1] = helpername, m[2] = helper params, m[3] = id
      var id = m[3];
      if (id === '' || id === null) {
        id = helperAutoId;
        helperAutoId++;
      }
      var native = nativeHelpers.hasOwnProperty(m[1]); // true or false
      helperNumber += 1;
      var params = m[2] || '';
      params = replaceHelperRefs(params, helperArray, helperNumber);
      // console.log(params)
      if (!native) {
        params = '[' + params + ']';
      }
      var helperTag = {
        name: m[1],
        id: id,
        params: params,
        native: native
      };
      helperArray[helperNumber] = helperTag;
      if (native) {
        funcStr += nativeHelpers[m[1]].helperStart(params, id);
        lastIndex = regEx.lastIndex; // the changeTags function sets lastIndex already
      } else {
        funcStr +=
          'tR+=Sqrl.H.' +
          m[1] +
          '(' +
          params +
          ',function(hvals){var hvals' +
          id +
          "=hvals;var tR='';";
      }
    } else if (m[4]) {
      // self-closing helper. m[4] name, m[5] params
      // It's a self-closing helper
      var innerParams = m[5] || '';
      innerParams = replaceHelperRefs(innerParams, helperArray, helperNumber);
      if (m[4] === 'include') {
        // This code literally gets the template string up to the include self-closing helper,
        // adds the content of the partial, and adds the template string after the include self-closing helper
        var preContent = str.slice(0, m.index);
        var endContent = str.slice(m.index + m[0].length);
        var partialParams = innerParams.replace(/'|"/g, ''); // So people can write {{include(mypartial)/}} or {{include('mypartial')/}}
        var partialContent = Partials[partialParams];
        str = preContent + partialContent + endContent;
        lastIndex = regEx.lastIndex = m.index;
      } else if (
        nativeHelpers.hasOwnProperty(m[4]) &&
        nativeHelpers[m[4]].hasOwnProperty('selfClosing')
      ) {
        funcStr += nativeHelpers[m[4]].selfClosing(innerParams);
        lastIndex = regEx.lastIndex; // changeTags sets regEx.lastIndex
      } else {
        funcStr += 'tR+=Sqrl.H.' + m[4] + '(' + innerParams + ');'; // If it's not native, passing args to a non-native helper
      }
    } else if (m[6]) {
      // ref. m[6] content, m[7] filters
      funcStr += 'tR+=' + ref(m[6], m[7]) + ';';
    } else if (m[8]) {
      // helper close. m[8] name
      var mostRecentHelper = helperArray[helperNumber];
      if (mostRecentHelper && mostRecentHelper.name === m[8]) {
        helperNumber -= 1;
        if (mostRecentHelper.native === true) {
          funcStr += nativeHelpers[mostRecentHelper.name].helperEnd(
            mostRecentHelper.params,
            mostRecentHelper.id
          );
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
      // helper block. m[9] name
      var parent = helperArray[helperNumber];
      if (parent.native) {
        var nativeH = nativeHelpers[parent.name];
        if (nativeH.blocks && nativeH.blocks[m[9]]) {
          funcStr += nativeH.blocks[m[9]](parent.id);
          lastIndex = regEx.lastIndex; // Some native helpers set regEx.lastIndex
        } else {
          console.warn(
            "Native helper '%s' doesn't accept that block.",
            parent.name
          );
        }
      } else {
        if (!helperContainsBlocks[parent.id]) {
          funcStr +=
            'return tR},{' +
            m[9] +
            ':function(hvals){var hvals' +
            parent.id +
            "=hvals;var tR='';";
          helperContainsBlocks[parent.id] = true;
        } else {
          funcStr +=
            'return tR},' +
            m[9] +
            ':function(hvals){var hvals' +
            parent.id +
            "=hvals;var tR='';";
        }
      }
    }
  }
  addString(str.length); // Add the string from the last tag-close to the end of the file, if there is one
  funcStr += 'return tR';
  var func = new Function( //eslint-disable-line
    'options',
    'Sqrl',
    funcStr.replace(/\n/g, '\\n').replace(/\r/g, '\\r')
  );
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

  if (filePath) {
    // If $file is passed in
    var fs = require('fs');
    if (caching !== false) {
      if (!cache.hasOwnProperty(filePath)) {
        cache[filePath] = Compile(fs.readFileSync(filePath, 'utf8'));
      }
      return cache[filePath]
    } else {
      return Compile(fs.readFileSync(filePath, 'utf8'))
    }
  } else if (typeof str === 'string') {
    // If str is passed in
    if (name && caching !== false) {
      if (!cache.hasOwnProperty(name)) {
        cache[name] = Compile(str);
      }
      return cache[name]
    } else if (caching === true) {
      if (!cache.hasOwnProperty(str)) {
        cache[str] = Compile(str);
      }
      return cache[str]
    } else {
      return Compile(str)
    }
  } else if (name && caching !== false && cache.hasOwnProperty(name)) {
    // If only name is passed in and it exists in cache
    return cache[name]
  } else {
    // Neither $file nor str nor existing name is passed in
    return 'No template'
  }
}

function renderFile (filePath, options) {
  options.$file = filePath;
  return load(options)(options, { H: helpers, F: filters, P: Partials })
}

function __express (filePath, options, callback) {
  return callback(null, renderFile(filePath, options))
}

export { Compile, filters as F, helpers as H, Partials as P, Render, __express, autoEscaping, defaultTags, defineFilter, defineHelper, defineNativeHelper, definePartial, load, renderFile, setDefaultFilters };
//# sourceMappingURL=squirrelly.dev.js.map
