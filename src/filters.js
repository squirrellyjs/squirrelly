function d(str) {
    return str
}

function e(str) {
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
//Don't need a filter for unescape because that's just a flag telling Squirrelly not to escape

export {d, e, e as escape}