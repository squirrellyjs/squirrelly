import F from './filters.js'
import Compile from './compile.js'
import * as Sqrl from './index.js'
import H from './helpers.js'
import nativeHelpers from './nativeHelpers.js'
import {
    paramHelperRefRegExp,
    tags,
    regEx,
    setRegEx,
    setTags
} from './regexps.js'

export function defineFilter (name, callback) {
  F[name] = callback
}

export function defineHelper (name, callback) {
  H[name] = callback
}

export function defineNativeHelper (name, obj) {
  nativeHelpers[name] = obj
}

export var initialSetup = {
  tags: tags,
  regEx: regEx
}
export function setup () {
  initialSetup = {
    tags: tags,
    regEx: regEx
  }
}

export function takedown () {
  setTags(initialSetup.tags)
  setRegEx(initialSetup.regEx)
}

export function Render (template, options) {
  if (typeof template === 'function') {
    return template(options, Sqrl)
  } else if (typeof template === 'string') {
    var templateFunc = Compile(template)
    return templateFunc(options, Sqrl)
  }
}

export function replaceParamHelpers (params) {
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
