import * as F from './filters.js'
import Precompile from './precompile.js'
import * as Sqrl from './index.js'
import H from './helpers.js'

export function defineFilter(name, callback) {
    F[name] = callback
}

export function defineHelper(name, callback) {
    H[name] = callback
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

export var defaultFilters = {
    /* All strings are automatically passed through the "d" filter (stands for default, but is shortened to save space)
and then each of the default filters the user
Has set to true. This opens up a realm of possibilities like autoEscape, etc.
List of shortened letters: d: default, e: escape, u: unescape. Escape and Unescape are also valid filter names*/
    e: false // Escape is turned off by default for performance
}

export function autoEscape(bool) {
    if (bool) {
        defaultFilters.e = true
    } else {
        defaultFilters.e = false
    }
}