"use strict";
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            return (root.Sqrl = factory());
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node. Do we neeed to fix this?
        module.exports = factory(require('fs'));
    } else {
        // Browser globals
        root.Sqrl = factory();
    }
}(typeof self !== 'undefined' ? self : this, function (fs) {
    var Sqrl = {}
    
    Sqrl.Template = function (tmpltFunc, opts) {
        return tmpltFunc(opts)
    }

    var escMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    Sqrl.EscapeHTML = function (string) {//To deal with XSS, borrowed function from Mustache
        return String(string).replace(/[&<>"'`=\/]/g, function fromEscMap(s) {
            return escMap[s];
        });
    }

    String.prototype.regexIndexOf = function(regex, startpos) {
      var indexOf = this.substring(startpos || 0).search(regex);
      return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf;
    }

    function getPosition(string, subString, n) {
      return string.split(subString, n).join(subString).length+subString.length
    }

    function getFirstSubsection(str, otag, ctag) {
      var substr;
      var count1 = "no";
      var count2 = "nope";
      var ctagExp = new RegExp(ctag, "g")
      var otagExp = new RegExp(otag, "g")
      let i = 0;
      const matches = str.match(ctagExp).length;
      for (; i < matches; i++) {
        var position = getPosition(str, ctag, i + 1);
        substr = str.slice(0, position);
        count1 = substr.match(otagExp).length;
        count2 = substr.match(ctagExp).length;
        if (count1 === count2) {
          return substr.trim();
        }
      }
      return "error, somethin"
    }
    var firstSeg = toParse.slice(0, toParse.regexIndexOf(/{{setTag\([^]+\)}}/));
    toParse = toParse.replace(firstSeg, "");
    console.log(getFirstSubsection(firstSeg, "{{", "}}"));
    
    Sqrl.Parse.Basic = function (str, ops) {
      return ops[str].toString();
    }

    Sqrl.Compile = function (str, opts) {
        console.time("compile")
        toParse = str.replace(/[\f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/g, "")
        var sections = [, ];
        var tags = [];
        returnString = "";
        
        console.timeEnd("compile")
    }




    if (typeof fs !== 'undefined' && fs !== null) {
        Sqrl.__express = function (filePath, options, callback) {
            fs.readFile(filePath, function (err, content) {
                if (err) {
                    return callback(err)
                }
                var sqrlFile = content.toString()
                var compiledFile = Sqrl.Compile(sqrlFile)
                var renderedFile = Sqrl.Template(compiledFile, options)
                return callback(null, renderedFile)
            })
        }
    }
    return Sqrl;
}));