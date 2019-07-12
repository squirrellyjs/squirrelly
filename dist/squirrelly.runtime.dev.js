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

  function defineFilter (name, callback) {
    filters[name] = callback;
  }

  function defineHelper (name, callback) {
    helpers[name] = callback;
  }

  function Render (template, options) {
    // If the template parameter is a function, call that function with (options, Sqrl)
    // If it's a string, first compile the string and then call the function
    if (typeof template === 'function') {
      return template(options, { H: helpers, F: filters, P: Partials })
    } else {
      return 'Err: Function must be 1st arg'
    }
  }

  function definePartial (name, str) {
    Partials[name] = str;
  }

  exports.F = filters;
  exports.H = helpers;
  exports.P = Partials;
  exports.Render = Render;
  exports.autoEscaping = autoEscaping;
  exports.defineFilter = defineFilter;
  exports.defineHelper = defineHelper;
  exports.definePartial = definePartial;
  exports.setDefaultFilters = setDefaultFilters;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=squirrelly.runtime.dev.js.map
