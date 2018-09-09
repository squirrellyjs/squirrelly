import regEx, {
    paramHelperRefRegExp as parameterHelperRefRegEx
} from './regexps'
import nativeHelpers from './nativeHelpers'
import {
    defaultFilters,
    parseFiltered,
    cacheDefaultFilters
} from './filters'
import {
    replaceParamHelpers
} from './utils'

function Compile(str) {
    var lastIndex = 0
    var funcStr = ""
    var helperArray = [];
    var helperNumber = -1;
    var helperAutoId = 0
    var helperContainsBlocks = {};
    var m;
    cacheDefaultFilters()
    while ((m = regEx.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regEx.lastIndex) {
            regEx.lastIndex++;
        }
        if (funcStr === "") {
            funcStr += "var tmpltRes=\'" + str.slice(lastIndex, m.index).replace(/'/g, "\\'") + '\';'
        } else {
            if (lastIndex !== m.index) {
                funcStr += 'tmpltRes+=\'' + str.slice(lastIndex, m.index).replace(/'/g, "\\'") + '\';'
            }
        }
        lastIndex = m[0].length + m.index
        if (m[1]) {
            //It's a global ref. p4 = filters
            funcStr += 'tmpltRes+=' + globalRef(m[1], m[4]) + ';'
        } else if (m[3]) {
            //It's a helper ref. p2 = id (with ':' after it) or path, p4 = filters
            funcStr += 'tmpltRes+=' + helperRef(m[3], m[2], m[4]) + ';'
        } else if (m[5]) {
            //It's a helper oTag. p6 parameters, p7 id
            var id = m[7]
            if (id === "" || id === null) {
                id = helperAutoId;
                helperAutoId++;
            }
            var native = nativeHelpers.hasOwnProperty(m[5]) //true or false
            helperNumber += 1;
            var params = m[6] || ""
            params = replaceParamHelpers(params)
            if (!native) {
                params = '[' + params + ']'
            }
            var helperTag = {
                name: m[5],
                id: id,
                params: params,
                native: native
            }
            helperArray[helperNumber] = helperTag;
            if (native) {
                var nativeObj = nativeHelpers[m[5]]
                funcStr += nativeObj.helperStart(params, id)
            } else {
                funcStr += 'tmpltRes+=Sqrl.H.' + m[5] + '(' + params + ',function(hvals){var hvals' + id + '=hvals;'
            }
        } else if (m[8]) {
            //It's a helper cTag.
            var mostRecentHelper = helperArray[helperNumber];
            if (mostRecentHelper && mostRecentHelper.name === m[8]) {
                helperNumber -= 1;
                if (mostRecentHelper.native === true) {
                    funcStr += nativeHelpers[mostRecentHelper.name].helperEnd(mostRecentHelper.params, mostRecentHelper.id)
                } else {
                    if (helperContainsBlocks[mostRecentHelper.id]) {
                        funcStr += "return tmpltRes}});"
                    } else {
                        funcStr += "return tmpltRes});"
                    }
                }
            } else {
                console.error("Sorry, looks like your opening and closing tags don't match")
            }
        } else if (m[9]) {
            //It's a helper block.
            var parent = helperArray[helperNumber]
            if (parent.native) {
                var nativeH = nativeHelpers[parent.name]
                if (nativeH.blocks && nativeH.blocks[m[9]]) {
                    funcStr += nativeH.blocks[m[9]](parent.id)
                } else {
                    console.warn("Native helper '%s' doesn't accept that block.", parent.name)
                }
            } else {
                if (!helperContainsBlocks[parent.id]) {
                    funcStr += "return tmpltRes}, {" + m[9] + ":function(hvals){var hvals" + parent.id + "=hvals;var tmpltRes=\'\';"
                    helperContainsBlocks[parent.id] = true
                } else {
                    funcStr += "return tmpltRes}," + m[9] + ":function(hvals){var hvals" + parent.id + "=hvals;var tmpltRes=\'\';"
                }
            }
        } else if (m[10]) {
            //It's a self-closing helper
            var params = m[11] || ""
            params = replaceParamHelpers(params)

            if (nativeHelpers.hasOwnProperty(m[10]) && nativeHelpers[m[10]].hasOwnProperty('selfClosing')) {
                funcStr += nativeHelpers[m[10]].selfClosing(params)
            } else {
                funcStr += 'tmpltRes+=Sqrl.H.' + m[10] + '(' + params + ');'
            }
        } else {
            console.error("Err: Code 000")
        }

        function globalRef(refName, filters) {
            return parseFiltered('options.' + refName, filters)
        }

        function helperRef(name, id, filters) {
            var prefix;
            if (typeof id !== 'undefined') {
                if (/(?:\.\.\/)+/g.test(id)) {
                    prefix = helperArray[helperNumber - (id.length / 3) - 1].id
                } else {
                    prefix = id.slice(0, -1)
                }
                return parseFiltered("hvals" + prefix + "." + name, filters)
            } //Implied 'else'
            return parseFiltered("hvals." + name, filters)
        }



    }
    if (str.length > regEx.lastIndex) {
        if (funcStr === "") {
            funcStr += "var tmpltRes=\'" + str.slice(lastIndex, str.length).replace(/'/g, "\\'") + '\';'
        } else if (lastIndex !== str.length) {
            funcStr += "tmpltRes+=\'" + str.slice(lastIndex, str.length).replace(/'/g, "\\'") + '\';'
        }
    }
    funcStr += 'return tmpltRes'
    var func = new Function('options', 'Sqrl', funcStr.replace(/\n/g, '\\n').replace(/\r/g, '\\r'))
    return func
}

if (RUNTIME) {
    Compile = {}
}

export default Compile