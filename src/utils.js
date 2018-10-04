import F from './filters'
import C from './compile'
import * as Sqrl from './index' // So we can pass Sqrl as a parameter to Render()
import H from './helpers'
import n from './nativeHelpers'
import P from './partials'

export function defineFilter (name, callback) {
  F[name] = callback
}

export function defineHelper (name, callback) {
  H[name] = callback
}

export function defineNativeHelper (name, obj) {
  n[name] = obj
}

export function Render (template, options) {
  // If the template parameter is a function, call that function with (options, Sqrl)
  // If it's a string, first compile the string and then call the function
  if (typeof template === 'function') {
    return template(options, Sqrl)
  } else if (typeof template === 'string') {
    var templateFunc = C(template)
    return templateFunc(options, Sqrl)
  }
}

export function definePartial (name, str) {
  P[name] = str
}
