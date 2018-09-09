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
            "/": "&#x2F;"
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
    //e: false, // Escape is turned off by default for performance
}

export var defaultFilterCache = {
    start: "",
    end: ""
}

export function autoEscaping (bool) {
    if (bool) {
        autoEscape = true
    } else {
        autoEscape = false
    }
}

export var autoEscape = true;

export function cacheDefaultFilters() {
    for (var key in defaultFilters) {
        if (!defaultFilters.hasOwnProperty(key) || !defaultFilters[key]) continue
        defaultFilterCache = {
            start: "",
            end: ""
        }
        defaultFilterCache.start += "Sqrl.F." + key + "("
        defaultFilterCache.end += ")"
    }
}
export function parseFiltered(initialString, filterString) {
    var filtersArray;
    var safe;
    var filterStart = ""
    var filterEnd = ""
    if (filterString && filterString !== "") {
        filtersArray = filterString.split('|')
        for (var i = 0; i < filtersArray.length; i++) {
            filtersArray[i] = filtersArray[i].trim()
            if (filtersArray[i] === "") continue
            if (filtersArray[i] === "safe") {
                safe = true
                continue
            }
            filterStart = 'Sqrl.F.' + filtersArray[i] + '(' + filterStart
            filterEnd += ")"
        }
    }
    filterStart += defaultFilterCache.start
    filterEnd += defaultFilterCache.end
    if (!safe && autoEscape) {
        filterStart += "Sqrl.F.e("
        filterEnd += ")"
    }

    return filterStart + initialString + filterEnd;
}