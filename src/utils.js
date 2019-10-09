import F from './filters'
import C from './compile'
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
  // If the template parameter is a function, call that function with (options, squirrelly stuff)
  // If it's a string, first compile the string and then call the function
  if (typeof template === 'function') {
    return template(options, { H: H, F: F, P: P })
  } else if (typeof template === 'string') {
    var res = load(options, template)(options, { H: H, F: F, P: P })
    return res
  }
}

export function definePartial (name, str) {
  P[name] = str
}

export var cache = {}

export function load (options, str) {
  var filePath = options.$file
  var name = options.$name
  var caching = options.$cache

  if (filePath) {
    // If $file is passed in
    var fs = require('fs')
    if (caching !== false) {
      if (!cache.hasOwnProperty(filePath)) {
        cache[filePath] = C(fs.readFileSync(filePath, 'utf8'))
      }
      return cache[filePath]
    } else {
      return C(fs.readFileSync(filePath, 'utf8'))
    }
  } else if (typeof str === 'string') {
    // If str is passed in
    if (name && caching !== false) {
      if (!cache.hasOwnProperty(name)) {
        cache[name] = C(str)
      }
      return cache[name]
    } else if (caching === true) {
      if (!cache.hasOwnProperty(str)) {
        cache[str] = C(str)
      }
      return cache[str]
    } else {
      return C(str)
    }
  } else if (name && caching !== false && cache.hasOwnProperty(name)) {
    // If only name is passed in and it exists in cache
    return cache[name]
  } else {
    // Neither $file nor str nor existing name is passed in
    return 'No template'
  }
}

export function renderFile (filePath, options) {
  options.$file = filePath
  return load(options)(options, { H: H, F: F, P: P })
}

export function __express (filePath, options, callback) {
  return callback(null, renderFile(filePath, options))
}
