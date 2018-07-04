(function (root, factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            return (root.Sqrl = factory())
        })
    } else if (typeof module === "object" && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node. Do we neeed to fix this?
        module.exports = factory(require("fs"))
    } else {
        // Browser globals
        root.Sqrl = factory()
    }
})(typeof self !== "undefined" ? self : this, function (fs) {
    var Sqrl = {} //For all of the functions
    Sqrl.Utils = {} //For user-accessible ones
    Sqrl.Compiler = {} //For RegExp's, etc.
    Sqrl.Helpers = {} //For helpers, their namespaces
    /*These two are technically just helpers, but in Squirrelly they're 1st-class citizens.*/
    Sqrl.Partials = {} //For partials
    Sqrl.Layouts = {} //For layouts
    Sqrl.Helper = function (name, callback) {
        Sqrl.Helpers[name] = callback
    }
    Sqrl.Str = function (thing) { /*To make it more safe...I'll probably have people opt in for performance though*/
        if (typeof thing === "string") {
            return thing
        } else if (typeof thing === "object") {
            return JSON.stringify(thing)
        } else {
            return thing.toString()
        }
    }

    Sqrl.Render = function (template, options) {
        return template(options, Sqrl)
    }

    Sqrl.defaultFilters = { //All strings are automatically passed through the "d" filter (stands for default, but is shortened to save space)
        //, and then each of the default filters the user
        //Has set to true. This opens up a realm of possibilities like autoEscape, etc.
        //List of shortened letters: d: default, e: escape, u: unescape. Escape and Unescape are also valid filter names
        e: false //Escape is turned off by default for performance
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
            return String(str).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;").replace("'", "&#39;").replace("/", "&#x2F;").replace("`", "&#x60;").replace("=", "&#x3D;")
        },
        reverse: function (str) {
            var out = "";
            for (var i = str.length - 1; i >= 0; i--) {
                out += str.charAt(i);
            }
            return out || str
        }
    }

    Sqrl.Filters.escape = Sqrl.Filters.e


    Sqrl.Compiler.RegExps = {
        /*These are the default RegExps, when the tag isn't changed*/
        helperRef: /{{\s*@(?:([\w$]*):)?\s*(.+?)\s*}}/g, //Helper Reference (with a @)
        globalRef: /{{\s*?([^#@.\(\\/]+?(?:[.[].*?)*?)((?:\|[\w$]+?)*)}}/g, //Global reference (No prefix), supports filters
        helper: /{{ *?([\w$]+) *?\(([^\n]*)\) *?([\w$]*) *?}}([^]*?)((?:{{ *?# *?[\w$]* *?}}[^]*)*){{ *?\/ *?\1 *? \3 *?}}/g, //Helper
        helperBlock: /{{ *?# *?(\w*) *?}}([^]*){{ *?\/ *?\1 *?}}(?:\s*{{!--[\w$\s]*--}}\s*)*/g, //Helper block
        comment: /{{!--[^]*?--}}/g, //Comment regexp
        parameterGlobalRef: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\d(?:\.)?\d*|[[.@]\w+|(\w+)/g, //Parameter is a Global ref
        parameterHelperRef: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[\\]@(?:[\w$]*:)?[\w$]+|@(?:([\w$]*):)?([\w$]+)/g, //To tell if a parameter is a helper ref p1 scope, p2 is ref
        trim: /^ +| +$/gm
    }

    Sqrl.Compiler.SetTags = function (otag, ctag) {
        /*TODO*/
    }

    Sqrl.Precompile = function (str) {
        var funcString = "\"use strict\";var tmpltRes=\"\";Sqrl.F=Sqrl.Filters;"
        var regexps = Sqrl.Compiler.RegExps
        /*To separate all non-helper blocks of text into global refs and not global refs. I'll probably make this more efficient sometime...*/
        function parseGlobalRefs(str) {
            var lastMatchIndex = 0;
            while ((m = regexps.globalRef.exec(str)) !== null) {
                var content = m[1]
                var filters = m[2]
                if (m.index > lastMatchIndex) { //Block before the first match, in between each of the matches
                    //console.time("parseHRefs")
                    parseHelperRefs(str.slice(lastMatchIndex, m.index))
                    //console.timeEnd("parseHRefs")
                }
                if (content !== "") {
                    var returnStr = "Sqrl.F.d(options." + content + ")||\"\""
                    for (key in Sqrl.defaultFilters) {
                        if (Sqrl.defaultFilters[key] === true) {
                            returnStr = "Sqrl.F." + key + "(" + returnStr + ")"
                        }
                    }
                    if (typeof filters !== 'undefined' && filters !== null) {
                        var filtersArray = filters.split("|")
                        for (var i = 1; i < filtersArray.length; i++) {
                            returnStr = "Sqrl.F." + filtersArray[i] + "(" + returnStr + ")"
                        }
                        funcString += "tmpltRes+=" + returnStr + ";"
                    } else {
                        funcString += returnStr
                    }
                }
                lastMatchIndex = regexps.globalRef.lastIndex
            }
            if (str.length > lastMatchIndex) { //Block after the last match
                //console.time("parseHRefs2")
                parseHelperRefs(str.slice(lastMatchIndex, str.length))
                //console.timeEnd("parseHRefs2")

            }
        }
        /*End of parseGlobalRefs*/

        /*To separate all non-global refs into helper refs and strings*/
        function parseHelperRefs(str) {
            var lastMatchIndex = 0;
            while ((m = regexps.helperRef.exec(str)) !== null) {
                var content = m[2]
                if (m.index > lastMatchIndex) { //Block before first match
                    var stringVal = str.slice(lastMatchIndex, m.index) //.replace(/\n/g, "\\\n")
                    if (stringVal !== "") {
                        funcString += "tmpltRes+=\"" + stringVal + "\";"
                    }
                }
                if (m[1] === undefined || !m[1]) {
                    var scope = ""
                    funcString += "tmpltRes+=Sqrl.hvals.c." + content + ";" //hvals stands for helper values (their own namespaces) and "c" for current. Trying to keep space down
                } else {
                    var scope = m[1]
                    funcString += "tmpltRes+=Sqrl.hvals.c." + scope + "." + content + ";"

                }
                /*tagArray.push({
                    kind: "helperRef",
                    content: content,
                    scope: scope
                })*/
                lastMatchIndex = regexps.helperRef.lastIndex
            }
            if (str.length > lastMatchIndex) { //And block after last match
                var stringVal = str.slice(lastMatchIndex, str.length) //.replace(/\n/g, "\\\n")
                if (stringVal !== "") {
                    funcString += "tmpltRes+=\"" + stringVal + "\";"
                }
            }
        }
        /*End of parseHelperRefs*/
        /*To parse the string into blocks: helpers and not helpers, after which it'll get parsed into refs and strings*/
        function parseString(strng) {
            var str = strng.replace(regexps.comment, "") //.replace(/\n/g, "\\n").replace(/\"/g, "\\\"")
            var lastMatchIndex = 0;
            while ((m = regexps.helper.exec(str)) !== null) {
                //p1 is helper name, p2 is helper parameters, p3 helper id, p4 helper first block, p5 everything else inside
                var name = m[1] || ""
                var params = m[2] || ""
                var id = m[3] || ""
                var firstblock = m[4] || ""
                var content = m[5] || ""
                parseGlobalRefs(str.slice(lastMatchIndex, m.index))
                /*tagArray.push({
                    kind: "helper",
                    name: name,
                    params: "[" + params.replace(regexps.parameterGlobalRef, function (match, p1) {
                        if (p1 === undefined || !p1) return match;
                        else return "options." + p1;
                    }).replace(regexps.parameterHelperRef, function (match, p1, p2) { //p1 is path prefixes (../), p2 is the string
                        if (p1 === undefined || !p1) {
                            p1 = "currentHelperName"
                        } else {
                            p1 = "\"" + p1 + "\""
                        };
                        if (p2 === undefined || !p2) return match;
                        else return "Sqrl.Namespaces[" + p1 + "]." + p2;
                    }) + "]",
                    id: id,
                    firstblock: firstblock,
                    content: content
                })*/
                lastMatchIndex = regexps.helper.lastIndex
            }

            if (str.length > lastMatchIndex) {
                parseGlobalRefs(str.slice(lastMatchIndex, str.length))
            }
        }
        parseString(str)

        var func = new Function("options", "Sqrl", funcString.replace(/\n/g, "\\n").replace(/\r/g, "\\r") + "return tmpltRes;")
        return func
    }

    if (typeof fs !== "undefined" && fs !== null) {
        Sqrl.__express = function (filePath, options, callback) {
            fs.readFile(filePath, function (err, content) {
                if (err) {
                    return callback(err)
                }
                var sqrlFile = content.toString()
                var compiledFile = Sqrl.Compile(sqrlFile)
                var renderedFile = compiledFile(options)
                return callback(null, renderedFile)
            })
        }
    }
    return Sqrl
})