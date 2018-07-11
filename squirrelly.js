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
            if (dd < 10) {dd = '0' + dd}
            if (mm < 10) {mm = '0' + mm}
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
    Sqrl.Filters = {
        d: function (str) {
            return str
        },
        e: function (str) {
            return String(str).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;').replace("'", '&#39;').replace('/', '&#x2F;').replace('`', '&#x60;').replace('=', '&#x3D;')
        },
        reverse: function (str) {
            var out = ''
            for (var i = str.length - 1; i >= 0; i--) {
                out += str.charAt(i)
            }
            return out || str
        }
    }

    Sqrl.Filters.escape = Sqrl.Filters.e
    Sqrl.F = Sqrl.Filters

    Sqrl.builtInHelpers = {
        if: function (param, blocks, varName, regexps, ofilters, cfilters) { // Opening closing filters, like "Sqrl.F.e(Sqrl.F.d(" and "))"
            var returnFunc = 'if(' + param + '){' + varName + '+=' + blocks.default + '(helpervals||{})}'
            if (blocks.hasOwnProperty('else')) {
                returnFunc += 'else { ' + varName + '+=' + blocks.else + '(helpervals||{})}'
            }
            return returnFunc
        },
        each: function (param, blocks, varName, regexps, ofilters, cfilters) {
            var returnFunc = 'for (var i = 0; i < ' + param + '.length ;i++) {'
                + varName + '+=' + blocks.default + '({this: ' + param + '[i], index: i})}'
            return returnFunc
        },
        foreach: function (param, blocks, varName, regexps, ofilters, cfilters) {
            var returnFunc = 'for (var key in ' + param + ') {if (!' + param + '.hasOwnProperty(key)) continue;'
                + varName + '+=' + blocks.default + '({this: ' + param + '[key], key: key})}'
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
        globalRef: /{{\s*?([^#@.\(\\/]+?(?:[.[].*?)*?)((?: *?\| *?[\w$]* *?)* *?\|*)}}/g, // Global reference (No prefix), supports filters
        helper: /{{ *?([\w$]+) *?\(([^\n]*)\)((?: *?\| *?[\w$]* *?)* *?\|*) *?([\w$]*) *?}}([^]*?)((?:{{ *?# *?([\w$]*) *?}}[^]*{{ *?\/ *?\7 *?}}\s*)*){{ *?\/ *?\1 *? \4 *?}}/g, // Helper
        helperBlock: /{{ *?# *?(\w*) *?}}([^]*){{ *?\/ *?\1 *?}}(?:\s*{{!--[\w$\s]*--}}\s*)*/g, // Helper block
        comment: /{{!--[^]*?--}}/g, // Comment regexp
        parameterGlobalRef: /~~/g, // Parameter is a Global ref
        parameterHelperRef: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[\\]@(?:[\w$]*:)?[\w$]+|@(?:([\w$]*):)?([\w$]+)/g, // To tell if a parameter is a helper ref p1 scope, p2 is ref
        partial: /{{ *?(?:>|include) *?([\w$]*)((?: *?\| *?[\w$]* *?)* *?\|*)}}/g // To, obviously, get partials. Can be like {{>partial}} or {{include partial}}. p1 partial name, p2 filters
    }

    Sqrl.Compiler.SetTags = function (otag, ctag) {
        var newRegExps = {

        }
        return newRegExps
    }

    /* IMPORTANT PARSING FUNCTIONS */
    /* To separate all non-helper blocks of text into global refs and not global refs. I'll probably make this more efficient sometime... */
    /* To parse the string into blocks: helpers and not helpers, after which it'll get parsed into refs and strings */
    function parseString(strng, varName, regexps) {
        regexps = regexps || Sqrl.Compiler.RegExps
        var funcString = 'var ' + varName + '="";'
        var str = strng.replace(regexps.comment, '')
        var lastMatchIndex = 0
        str.replace(regexps.helper, function (m, p1, p2, p3, p4, p5, p6, p7, offset) {
            // p1 is helper name, p2 is helper parameters, p3 filters, p4 helper id, p5 helper first block, p6 everything else inside
            var name = p1 || ''
            var args = p2 || ''
            var filters = p3
            var id = p4 || ''
            var firstblock = p5 || ''
            var content = p6 || ''
            funcString = parseGlobalRefs(str.slice(lastMatchIndex, offset), varName, funcString, regexps)
            lastMatchIndex = offset + m.length
            var helperFuncName = name + id
            // The following 2 "replace"s are for converting args into array form, converting all helper refs and global refs into options.*, helpervals.*, etc
            var params = args.replace(regexps.parameterGlobalRef, 'options.')
                .replace(regexps.parameterHelperRef, function (mp, pp1, pp2) { // p1 scope, p2 string
                    if (typeof pp2 === 'undefined') {
                        return mp
                    } else {
                        if (typeof pp1 === 'undefined') {
                            pp1 = ''
                        }
                        return 'helpervals' + pp1 + '.' + pp2
                    }
                })

            function createBlockFunction(fname, fid, fcontent) {
                var returnFunc = 'function (helpervals) {'
                returnFunc += 'var helpervals' + fid + '=helpervals;' + parseString(fcontent || '', 'block' + fname + fid) + '}'
                return returnFunc
            }

            function returnBlockFunctions(bId, bFirstblock, bContent) {
                var blockFunctions = {}
                blockFunctions.default = createBlockFunction('default', bId, bFirstblock)
                bContent.replace(regexps.helperBlock, function (m2, mp1, mp2) {
                    var bFunc = createBlockFunction(mp1, bId, mp2).replace(/\n/g, '\\n').replace(/\r/g, '\\r')
                    blockFunctions[mp1] = bFunc
                })
                return blockFunctions
            }
            if (Sqrl.builtInHelpers.hasOwnProperty(name)) {
                var blockFuncs = returnBlockFunctions(id, firstblock, content)
                funcString += Sqrl.builtInHelpers[name](params, blockFuncs, varName, regexps)
            } else {
                funcString += 'var ' + helperFuncName + '={name: "' + name + '", id: "' + id + '", args: ['
                funcString += params + '], blocks: {'
                funcString += 'default :' + createBlockFunction('default', id, firstblock) // .replace(/\n/g, "\\n").replace(/\r/g, "\\r")
                content.replace(regexps.helperBlock, function (m2, mp1, mp2) {
                    funcString += ',' + mp1 + ':' + createBlockFunction(mp1, id, mp2) // .replace(/\n/g, "\\n").replace(/\r/g, "\\r")
                })
                funcString += '}};'
                funcString += varName + '+=Sqrl.H.' + name + '(' + helperFuncName + '.args, ' + helperFuncName + '.blocks.default, ' + helperFuncName + '.blocks, options);'
            }
            lastMatchIndex = offset + m.length
        })

        if (str.length > lastMatchIndex) {
            funcString = parseGlobalRefs(str.slice(lastMatchIndex, str.length), varName, funcString, regexps)
        }
        funcString += 'return ' + varName
        return funcString
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
                var returnStr = 'Sqrl.F.d(options.' + content + ')||""'
                for (key in Sqrl.defaultFilters) {
                    if (Sqrl.defaultFilters[key] === true) {
                        returnStr = 'Sqrl.F.' + key + '(' + returnStr + ')'
                    }
                }
                if (typeof filters !== 'undefined' && filters !== null) {
                    var filtersArray = filters.split('|')
                    for (var i = 1; i < filtersArray.length; i++) {
                        returnStr = 'Sqrl.F.' + filtersArray[i] + '(' + returnStr + ')'
                    }
                    funcString += varName + '+=' + returnStr + ';'
                } else {
                    funcString += varName + '+=' + returnStr + ';'
                }
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
            if (offset > lastMatchIndex) { // Block before first match
                var stringVal = str.slice(lastMatchIndex, offset).replace(/\"/g, '\\"')
                if (stringVal !== '') {
                    funcString += varName + '+="' + stringVal + '";'
                }
            }
            if (p1 === undefined || !p1) {
                funcString += varName + '+=helpervals.' + content + ';' // hvals stands for helper values (their own namespaces) and "c" for current. Trying to keep space down
            } else {
                funcString += varName + '+=helpervals' + p1 + '.' + content + ';' // p1 is scope
            }
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
        var funcString = parseString(str, 'tRes', regexps)
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
