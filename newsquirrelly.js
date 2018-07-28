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

    Sqrl.Compiler.RegExps = {
        /* These are the default RegExps, when the tag isn't changed */
        helperRef: /{{\s*@(?:([\w$]*):)?\s*(.+?)\s*((?: *?\| *?[\w$]* *?)* *?\|*)}}/g, // Helper Reference (with a @)
        globalRef: /{{\s*?([^#@.\(\\/ ]+?(?:[.[].*?)*?)((?: *?\| *?[\w$]* *?)* *?\|*)}}/g, // Global reference (No prefix), supports filters
        helper: /{{ *?([\w$]+) *?\(([^\n]*)\)((?: *?\| *?[\w$]* *?)* *?\|*) *?([\w$]*) *?}}([^]*?)((?:{{ *?# *?([\w$]*) *?}}[^]*{{ *?\/ *?\7 *?}}\s*)*){{ *?\/ *?\1 *? \4 *?}}/g, // Helper
        helperBlock: /{{ *?# *?(\w*) *?}}([^]*){{ *?\/ *?\1 *?}}(?:\s*{{!--[\w$\s]*--}}\s*)*/g, // Helper block
        comment: /{{!--[^]*?--}}/g, // Comment regexp
        parameterGlobalRef: /~~/g, // Parameter is a Global ref
        parameterHelperRef: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[\\]@(?:[\w$]*:)?[\w$]+|@(?:([\w$]*):)?([\w$]+)/g, // To tell if a parameter is a helper ref p1 scope, p2 is ref
        partial: /{{ *?(?:>|include) *?([\w$]*)((?: *?\| *?[\w$]* *?)* *?\|*)}}/g // To, obviously, get partials. Can be like {{>partial}} or {{include partial}}. p1 partial name, p2 filters
    }

    /* IMPORTANT PARSING FUNCTIONS */
    /* To separate all non-helper blocks of text into global refs and not global refs. I'll probably make this more efficient sometime... */
    /* To parse the string into blocks: helpers and not helpers, after which it'll get parsed into refs and strings */


    function returnFiltered(filterString, initialString) {
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
                //There's gotta be a more efficient way to do this
                if (typeof filtersArray !== 'undefined' && (filtersArray.includes("u") || filtersArray.includes("unescape")) && (key === "e" || key === "escape")) continue;
                initialString = 'Sqrl.F.' + key + '(' + initialString + ')'
            }
        }
        return initialString
    }

    function parseGlobalRefs(str, varName, funcString, regexps) {
        var lastMatchIndex = 0
        str.replace(regexps.globalRef, function (m, p1, p2, offset) {
            var content = p1
            var filters = p2
            if (offset > lastMatchIndex) { // Block before the first match, in between each of the matches
                funcString = parseHelperRefs(str.slice(lastMatchIndex, offset), varName, funcString, regexps)
            }
            if (content !== '') {
                var returnStr = 'Sqrl.F.d(options.' + content + '||"")'
                returnStr = returnFiltered(filters, returnStr)
                funcString += varName + '+=' + returnStr + ';'
            }
            lastMatchIndex = offset + m.length
        })

        if (str.length > lastMatchIndex) { // Block after the last match
            funcString = parseHelperRefs(str.slice(lastMatchIndex, str.length), varName, funcString, regexps)
        }
        return funcString
    }
    /* End of parseGlobalRefs */
    /* To separate all non-global refs into helper refs and strings */
    function parseHelperRefs(str, varName, funcString, regexps) {
        var lastMatchIndex = 0
        str.replace(regexps.helperRef, function (m, p1, p2, p3, offset) {
            var content = p2
            var filters = p3
            if (offset > lastMatchIndex) { // Block before first match
                var stringVal = str.slice(lastMatchIndex, offset).replace(/\"/g, '\\"')
                if (stringVal !== '') {
                    funcString += varName + '+="' + stringVal + '";'
                }
            }
            var returnStr;
            if (p1 === undefined || !p1) {
                returnStr = 'Sqrl.F.d(helpervals.' + content + ')' // hvals stands for helper values (their own namespaces) and "c" for current. Trying to keep space down
            } else {
                returnStr = 'Sqrl.F.d(helpervals' + p1 + '.' + content + ")" // p1 is scope
            }
            returnStr = returnFiltered(filters, returnStr)
            funcString += varName + '+=' + returnStr + ';'
            lastMatchIndex = offset + m.length
        })
        if (str.length > lastMatchIndex) { // And block after last match
            var stringVal = str.slice(lastMatchIndex, str.length).replace(/\"/g, '\\"')
            if (stringVal !== '') {
                funcString += varName + '+="' + stringVal + '";'
            }
        }
        return funcString
    }
    /* End of parseHelperRefs */
    /* END OF IMPORTANT PARSING FUNCTIONS */

    Sqrl.Precompile = function (str) {
        var regexps = Sqrl.Compiler.RegExps
        console.log("regexps: " + JSON.stringify(regexps))
        var regEx = /{{ *?(?:(?:([\w$]+) *?\(([^\n]*?)\)((?: *?\| *?[\w$]* *?)* *?\|*) *?([\w$]*))|(?:\/ *?([\w$]+))) *?}}/g;
        var lastIndex = 0
        var oLength = -1;
        var funcStr = ""
        var outstanding = [];
        var helperResult = ""
        currentVarName = "tmpltRes"
        str.replace(regEx, function (m, p1, p2, p3, p4, p5, offset) {
            if (p1 === null || typeof p1 === "undefined") {
                var previous = outstanding[oLength];
                if (previous && previous === p5) {
                    console.log("lastIndex --> cTag: " + str.slice(lastIndex, offset))
                    lastIndex = offset + m.length
                    //outstanding.pop(); don't actually need this
                    oLength -= 1;
                }
            } else {
                oLength += 1;
                console.log("lastIndex --> oTag: " + str.slice(lastIndex, offset))
                lastIndex = offset + m.length

                outstanding[oLength] = p1;
                //console.log("outstanding: " + JSON.stringify(outstanding))
            }
        });
        if (str.length > lastIndex) {
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