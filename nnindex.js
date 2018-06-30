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
        hr: /{{\s*@((?:\.\.\/)*)\s*(.+?)\s*}}/g, //Helper Reference (with a @)
        gr: /{{\s*?([^#@.\(\\/]+?(?:[.[].*?)*?)}}/g, //Global reference (No prefix)
        h: /{{ *?([\w$]+) *?\(([^\n]*)\) *?(\w*) *?}}([^]*?)(?:{{ *?# *?\w* *?}}[^]*)*{{ *?\/ *?\1 *? \3 *?}}/g, //Helper
        hb: /{{ *?# *?(\w*) *?}}([^]*){{ *?\/ *?\1 *?}}(?:\s*{{!--[\w$\s]*--}}\s*)*/g, //Helper block
        c: /{{!--\w*--}}/g, //Comment regexp
        hp: /[^,](?:(?:"|').*?(?:"|'))*[^,]*/g, //To get separate helper parameters
        ps: /("|').*?\1/, //To tell if a parameter is a literal string
        pn: /\d+(?:\.\d*)*/, //To tell if a helper parameter is a literal number
        phr: /@((?:\.\.\/)*)\s*(.+)/, //To tell if a parameter is a literal helper ref
        pgr: /([^#@.\(\\/]+?(?:[.[].*?)*?)/, //Parameter is a Global ref
        rs: /[\.[\]"']/g, //Stands for Ref is Simple, used to tell whether to return new Function() or just use options

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

    Sqrl.Compile = function (strng) {
        //console.log(Sqrl)
        return (function (options) {
            const str = strng
            var regexps = Sqrl.Compiler.RegExps
            var helperScope = {}
            var opts = options

            function helperRef(match, p1, p2, offset, string) {
                return helperScope[p2]
            }

            function globalRef(match, p1, offset, string) {
                if (regexps.rs.test(p1)) {
                    return Function("options", "return options." + p1)(opts)
                } else {
                    return opts[p1]
                }
            }

            function helper(match, p1, p2, p3, offset, string) {
                var newparams = p2.match(regexps.hp)
                //console.log(newparams)
                var funcParams = [];
                for (var i = 0; i < newparams.length; ++i) {
                    var trimmed = newparams[i].trim() //Removing front and back whitespace from the parameters
                    if (((regexpResult = regexps.pn.exec(trimmed)) !== null) && regexpResult[0] === trimmed) {
                        //If the parameter matches my number regexp, convert it to a number
                        funcParams[i] = Number(regexpResult[0])
                    } else if (((regexpResult = regexps.ps.exec(trimmed)) !== null) && regexpResult[0] === trimmed) {
                        funcParams[i] = trimmed.slice(1, -1)
                    } else if ((regexpResult = String(regexps.pn.exec(trimmed))) === trimmed) {
                        funcParams[i] = newparams[i].trim()

                    } else if ((regexpResult = String(regexps.pn.exec(trimmed))) === trimmed) {
                        funcParams[i] = newparams[i].trim()

                    } else if ((regexpResult = String(regexps.pn.exec(trimmed))) === trimmed) {
                        funcParams[i] = newparams[i].trim()
                    } else {
                        funcParams[i] = trimmed
                    }
                }
                //console.log(funcParams)
                return Sqrl.Helpers[p1]()
            }

            function helperBlock(match, p1, p2, p3, p4, offset, string) {

            }
            var result = str
            result = result.replace(regexps.h, helper)
            result = result.replace(regexps.gr, globalRef)
            //console.log("Done replacing")
            return result
        })
    }

    Sqrl.Precompile = function (str) {
        var regexps = Sqrl.Compiler.RegExps
        var tagArray = [];
        var lastMatchIndex = 0;
        while (match = regexps.h.exec(str)) {
            if (match.index > lastMatchIndex) {
                tagArray.push({
                    kind: "nonhelper",
                    fullmatch: str.slice(lastMatchIndex, match.index)
                })
            }
            tagArray.push({
                kind: "helper",
                fullmatch: str.slice(match.index, regexps.h.lastIndex),
                helpername: match[1],
                helperparams: match[2],
                helperid: match[3],
                helpercontent: match[4]
            })
            lastMatchIndex = regexps.h.lastIndex
        }

        if (str.length > lastMatchIndex) {
            tagArray.push({
                kind: "nonhelper",
                fullmatch: str.slice(lastMatchIndex, str.length)
            })
        }
        return tagArray
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