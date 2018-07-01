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
    Sqrl.Utils.EscMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;",
        "`": "&#x60;",
        "=": "&#x3D;"
    }

    Sqrl.Compiler.RegExps = {
        /*These are the default RegExps, when the tag isn't changed*/
        helperRef: /{{\s*@(?:([\w$]*):)?\s*(.+?)\s*}}/g, //Helper Reference (with a @)
        globalRef: /{{\s*?([^#@.\(\\/]+?(?:[.[].*?)*?)}}/g, //Global reference (No prefix)
        helper: /{{ *?([\w$]+) *?\(([^\n]*)\) *?([\w$]*) *?}}([^]*?)((?:{{ *?# *?[\w$]* *?}}[^]*)*){{ *?\/ *?\1 *? \3 *?}}/g, //Helper
        helperBlock: /{{ *?# *?(\w*) *?}}([^]*){{ *?\/ *?\1 *?}}(?:\s*{{!--[\w$\s]*--}}\s*)*/g, //Helper block
        comment: /{{!--\w*--}}/g, //Comment regexp
        parameterGlobalRef: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\d(?:\.)?\d*|[[.@]\w+|(\w+)/g, //Parameter is a Global ref
        parameterHelperRef: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[\\]@(?:[\w$]*:)?[\w$]+|@(?:([\w$]*):)?([\w$]+)/g, //To tell if a parameter is a helper ref p1 scope, p2 is ref
        trim: /^ +| +$/gm
    }

    Sqrl.Compiler.SetTags = function (otag, ctag) {
        /*TODO*/
    }

    Sqrl.Utils.EscapeHTML = function (string) {
        //To deal with XSS. I borrowed the function from Mustache.JS
        return String(string).replace(
            /[&<>"'`=\/]/g,
            function fromEscMap(s) {
                return Sqrl.Utils.EscMap[s]
            }
        )
    }

    Sqrl.Precompile = function (str) {
        var funcString = "var templateResult = \"\";"
        var regexps = Sqrl.Compiler.RegExps
        /*To separate all non-helper blocks of text into global refs and not global refs. I'll probably make this more efficient sometime...*/
        function parseGlobalRefs(str) {
            var lastMatchIndex = 0;
            while ((m = regexps.globalRef.exec(str)) !== null) {
                var content = m[1].trim()
                if (m.index > lastMatchIndex) { //Block before the first match, in between each of the matches
                    //console.time("parseHRefs")
                    parseHelperRefs(str.slice(lastMatchIndex, m.index))
                    //console.timeEnd("parseHRefs")
                }
                if (content !== "") {
                    funcString += "templateResult = templateResult + options." + content + ";"
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
                var content = m[2].trim()
                if (m.index > lastMatchIndex) { //Block before first match
                    var stringVal = str.slice(lastMatchIndex, m.index).trim()
                    if (stringVal !== "") {
                        funcString += "templateResult += \"" + stringVal + "\";"
                    }
                }
                if (m[1] === undefined || !m[1]) {
                    var scope = ""
                } else {
                    var scope = m[1]
                }
                funcString += "templateResult += namespaces[\"" + scope + "\"]." + content + ";"
                /*tagArray.push({
                    kind: "helperRef",
                    content: content,
                    scope: scope
                })*/
                lastMatchIndex = regexps.helperRef.lastIndex
            }
            if (str.length > lastMatchIndex) { //And block after last match
                var stringVal = str.slice(lastMatchIndex, str.length).trim()
                if (stringVal !== "") {
                    funcString += "templateResult += \"" + stringVal + "\";"
                }
            }
        }
        /*End of parseHelperRefs*/
        /*To parse the string into blocks: helpers and not helpers, after which it'll get parsed into refs and strings*/
        function parseString(str) {
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

        function addToString() {

        }
        var func = new Function("options", funcString + "return templateResult;")
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