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
        //console.log("Helper added!")
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
    }

    Sqrl.Compiler.SetTags = function (otag, ctag) {
        /*TODO*/
    }

    Sqrl.Utils.EscapeHTML = function (string) {
        //To deal with XSS. I borrowed the function from Mustache.JS
        return String(string).replace(
            /[&<>"'`=\/]/g,
            function fromEscMap(s) {
                return escMap[s]
            }
        )
    }

    Sqrl.Precompile = function (str) {
        var regexps = Sqrl.Compiler.RegExps
        /*To separate all non-helper blocks of text into global refs and not global refs. I'll probably make this more efficient sometime...*/
        function parseGlobalRefs(str) {
            var tagArray = [];
            var lastMatchIndex = 0;
            while ((m = regexps.globalRef.exec(str)) !== null) {
                var content = m[1]
                if (m.index > lastMatchIndex) {
                    tagArray.push({
                        kind: "nonGlobalRef",
                        innerRefs: parseHelperRefs(str.slice(lastMatchIndex, m.index))
                    })
                }
                tagArray.push({
                    kind: "globalRef",
                    content: content
                })
                lastMatchIndex = regexps.globalRef.lastIndex
            }
            if (str.length > lastMatchIndex) {
                tagArray.push({
                    kind: "nonGlobalRef",
                    innerRefs: parseHelperRefs(str.slice(lastMatchIndex, str.length))
                })
            }
            return tagArray
        }
        /*End of parseGlobalRefs*/

        /*To separate all non-global refs into helper refs and strings*/
        function parseHelperRefs(str) {
            var tagArray = [];
            var lastMatchIndex = 0;
            while ((m = regexps.helperRef.exec(str)) !== null) {
                var content = m[2]
                if (m.index > lastMatchIndex) {
                    tagArray.push({
                        kind: "string",
                        value: str.slice(lastMatchIndex, m.index),
                    })
                }
                if (m[1] === undefined || !m[1]) {
                    var scope = ""
                } else {
                    var scope = m[1]
                }
                tagArray.push({
                    kind: "helperRef",
                    content: content,
                    scope: scope
                })
                lastMatchIndex = regexps.helperRef.lastIndex
            }
            if (str.length > lastMatchIndex) {
                tagArray.push({
                    kind: "string",
                    value: str.slice(lastMatchIndex, str.length)
                })
            }
            return tagArray
        }
        /*End of parseHelperRefs*/
        /*To parse the string into blocks: helpers and not helpers, after which it'll get parsed into refs and strings*/
        function parseString(str) {
            var tagArray = [];
            var lastMatchIndex = 0;
            while ((m = regexps.helper.exec(str)) !== null) {
                //p1 is helper name, p2 is helper parameters, p3 helper id, p4 helper first block, p5 everything else inside
                var name = m[1] || ""
                var params = m[2] || ""
                var id = m[3] || ""
                var firstblock = m[4] || ""
                var content = m[5] || ""

                if (m.index > lastMatchIndex) {
                    tagArray.push({
                        kind: "nonhelper",
                        innerRefs: parseGlobalRefs(str.slice(lastMatchIndex, m.index))
                    })
                }
                tagArray.push({
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
                })
                lastMatchIndex = regexps.helper.lastIndex
            }

            if (str.length > lastMatchIndex) {
                tagArray.push({
                    kind: "nonhelper",
                    innerRefs: parseGlobalRefs(str.slice(lastMatchIndex, str.length))
                })
            }
            return tagArray
        }

        /*NOW TO PARSE .... */
        var tagArray = parseString(str);
        //console.log("tagArray is : " + tagArray)
        /*NOW IT'S ALL PARSED HOPEFULLY*/
        var funcString = "var templateResult = \"\";"
        for (var i = 0; i < tagArray.length; ++i) {
            var currentBlock = tagArray[i]
            if (currentBlock.kind === "helper") {
                //The current block is a helper
            } else {
                var globalOrNotBlocks = currentBlock.innerRefs
                for (var j = 0; j < globalOrNotBlocks.length; j++) {
                    if (globalOrNotBlocks[j].kind === "globalRef") {
                        var globalVal = globalOrNotBlocks[j].content.trim()
                        if (globalVal !== "") {
                            funcString+="templateResult = templateResult + options." + globalVal + ";"
                        }
                    } else {
                        var helperOrNotBlocks = globalOrNotBlocks[j].innerRefs
                        for (var k = 0; k < helperOrNotBlocks.length; k++) {
                            if (helperOrNotBlocks[k].kind === "helperRef") {
                                //console.log("It's a helper reference. Scope: " + helperOrNotBlocks[k].scope + " , Content: " + helperOrNotBlocks[k].content)
                            } else {
                                var stringVal = helperOrNotBlocks[k].value.trim()
                                if (stringVal !== "") {
                                    funcString += "templateResult += \"" + stringVal + "\";"
                                }
                            }
                        }
                    }
                }
            }
        }

        function addToString() {

        }
        var func = new Function("options", funcString + "return templateResult;")
        return {
            tagArray: tagArray,
            func: func
        }
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