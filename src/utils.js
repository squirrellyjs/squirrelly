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
    var res = handleTemplateCache(options, template)(options, Sqrl)
    return res
  }
}

export function definePartial (name, str) {
  P[name] = str
}

export var cache = {}

export var softCache = false

export function softCaching (bool) {
  softCache = bool
}

function handleTemplateCache (options, str) {
  var filePath = options.filePath
  var name = options.templateName
  if (filePath) {
    if (cache[filePath]) {
      // returning template cached by filename
      return cache[filePath]
    } else {
      var fs = require('fs')
      var fileContent = fs.readFileSync(filePath, 'utf8')
      cache[filePath] = C(fileContent)
      return cache[filePath]
    }
  } else if (name) {
    if (cache[name]) {
      // returning template cached by name
      return cache[name]
    } else if (str) {
      cache[name] = C(str)
      return cache[name]
    }
  } else if (str) {
    if (options.softCache || (softCache && (options.softCache !== false))) {
      if (cache[str]) {
        return cache[str]
      } else {
        cache[str] = C(str)
        return cache[str]
      }
    }
    return C(str)
  }
  // Implied else
  return 'Error'
}

export function renderFile (filePath, options) {
  options.filePath = filePath
  return handleTemplateCache(options)(options, Sqrl)
}

export function __express (filePath, options, callback) {
  return callback(null, renderFile(filePath, options))
}
