import F from './filters.js'
import Precompile from './precompile.js'
import * as Sqrl from './index.js'
import H from './helpers.js'
import nativeHelpers from './nativeHelpers.js'
import {paramHelperRefRegExp} from './regexps.js'

export function defineFilter(name, callback) {
    F[name] = callback
}

export function defineHelper(name, callback) {
    H[name] = callback
}

export function defineNativeHelpers(name, obj) {
    nativeHelpers[name] = obj
}
/*export function defineLayout(name, callback) {
    Sqrl.Helpers[name] = callback
    Sqrl.H = Sqrl.Helpers
}*/

export function Render(template, options) {
    if (typeof template === "function") {
        return template(options, Sqrl)
    } else if (typeof template === "string") {
        var templateFunc = Precompile(template)
        return templateFunc(options, Sqrl)
    }
}

export function replaceParamHelpers(params) {
    params = params.replace(paramHelperRefRegExp, function (m, p1, p2) { // p1 scope, p2 string
        if (typeof p2 === 'undefined') {
            return m
        } else {
            if (typeof p1 === 'undefined') {
                p1 = ''
            }
            return 'hvals' + p1 + '.' + p2
        }
    })
    return params
} 