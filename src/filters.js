export default {
    d: function (str) {
        return str
    },
    e: function (str) {
        var escMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "/": "&#x2F;",
            "`": "&#x60;",
            "=": "&#x3D;"
        }
        //To deal with XSS. Based on Escape implementations of Mustache.JS and Marko, then customized.
        function replaceChar(s) {
            return escMap[s]
        }
        var newStr = String(str)
        if (/[&<>"'`=\/]/.test(newStr)) {
            return newStr.replace(/[&<>"'`=\/]/g, replaceChar)
        } else {
            return newStr
        }
    }
}
//Don't need a filter for unescape because that's just a flag telling Squirrelly not to escape

var defaultFilters = {
    /* All strings are automatically passed through the "d" filter (stands for default, but is shortened to save space)
and then each of the default filters the user
Has set to true. This opens up a realm of possibilities like autoEscape, etc.
List of shortened letters: d: default, e: escape, u: unescape. Escape and Unescape are also valid filter names*/
    e: false // Escape is turned off by default for performance
}

var autoEscape = true;
export {
    defaultFilters,
    autoEscape
}