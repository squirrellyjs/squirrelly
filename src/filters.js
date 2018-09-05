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

export var defaultFilters = {
    /* All strings are automatically passed through the "d" filter (stands for default, but is shortened to save space)
and then each of the default filters the user
Has set to true. This opens up a realm of possibilities like autoEscape, etc.
List of shortened letters: d: default, e: escape, u: unescape. Escape and Unescape are also valid filter names*/
    e: false // Escape is turned off by default for performance
}

export var autoEscape = true;

export function parseFiltered(initialString, filterString) {
    var filtersArray;
    if (typeof filterString !== 'undefined' && filterString !== null) {
        filtersArray = filterString.split('|')
        console.log("filtersArray: " + filtersArray)
        for (var i = 0; i < filtersArray.length; i++) {
            filtersArray[i] = filtersArray[i].trim()
            if (filtersArray[i] === "unescape" || filtersArray[i] === "u" || filtersArray[i] === "safe") continue
            if (defaultFilters.e && (filtersArray[i] === "e" || filtersArray[i] === "escape")) continue
            initialString = 'Sqrl.F.' + filtersArray[i] + '(' + initialString + ')'
        }
    }
    for (var key in defaultFilters) {
        if (defaultFilters[key] === true) {
            if (typeof filtersArray !== 'undefined' && (filtersArray.includes("u") || filtersArray.includes("unescape")) && (key === "e" || key === "escape")) continue;
            initialString = 'Sqrl.F.' + key + '(' + initialString + ')'
        }
    }
    return initialString
}