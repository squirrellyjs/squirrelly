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
        hr: /{{\s*@((?:\.\.\/)*)\s*(.+?)\s*}}/g,//Helper Reference (with a @)
        rr: /{{\s*?((?:\.\.\/)*)\s*?([^@.\(\\/]+?(?:[.[].*?)*?)}}/g,//Regular reference
        gr: /{{\s*\.((?:\.\.\/)*)\s*(.+?)\s*}}/g,//Global reference (with a .)
        h: /{{ *?([\w$]+) *?\(([^\n]*)\) *?(\w*) *?}}([^]*?)(?:{{ *?# *?\w* *?}}[^]*)*{{ *?\/ *?\1 *? \3 *?}}/g, //Helper
        hb: /{{ *?# *?(\w*) *?}}([^]*){{ *?\/ *?\1 *?}}(?:\s*{{!--[\w$\s]*--}}\s*)*/g, //Helper block
        c: /{{!--\w*--}}/g, //Comment regexp
        hp: /[^,](?:(?:"|').*?(?:"|'))*[^,]*/g, //To get separate helper parameters
        ps: RegExp("("|").*?\1"), //To tell if a parameter is a literal string
        pn: /\d+(?:\.\d*)*/, //To tell if a helper parameter is a literal number
        phr: /@((?:\.\.\/)*)\s*(.+)/, //To tell if a parameter is a literal helper ref
        pgr: /\.((?:\.\.\/)*)\s*(.+?)/, //Global ref

    }

    Sqrl.Compiler.SetTags = function (otag, ctag) {
        return {
            hr: RegExp(otag + "s*@s*([^]+?)s*" + ctag, "g"),
            rr: RegExp(
                otag + "\\s*?([^@.\\(\\/]+?(?:[.[][^]*?)*?)" + ctag,
                "g"
            ),
            gr: RegExp(otag + "\\s*\\.\\s*([^]+?)\\s*" + ctag, "g"),
            h: RegExp(
                otag +
                " *?([\\w$]+) *?\\(([^\\n]*)\\) *?(\\w*) *?" +
                ctag +
                "([^]*)" +
                otag +
                " *?\\/ *?\\1 *? \\3 *?" +
                ctag,
                "g"
            ),
            hb: RegExp(
                otag +
                " *?# *?(\\w*) *?" +
                ctag +
                "([^]*)" +
                otag +
                " *?\\/ *?\\1 *?" +
                ctag +
                "(?:\\s*" +
                otag +
                "!--[\\w$]*--" +
                ctag +
                "\\s*)*",
                "g"
            ),
            c: RegExp(otag + "!--\\w*--" + ctag, "g")
        }
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
            var scope = options
            var helperScope = {}

            function helperRef(match, p1, offset, string) {
                return helperScope[p1]
            }

            function regRef(match, p1, offset, string) {
                return scope[p1]
            }

            function globalRef(match, p1, offset, string) {
                return options[p1]
            }

            function helper(match, p1, p2, p3, offset, string) {
                return options[p1]
            }

            function helperBlock(match, p1, p2, p3, offset, string) {
                return options[p1]
            }
            var result = str
            result = result.replace(regexps.h, helper)
            result = result.replace(regexps.rr, regRef)
            //console.log("Done replacing")
            return result
        })
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