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
    var res = load(options, template)(options, Sqrl)
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

export function load (options, str) {
  var filePath = options.$file
  var name = options.$name
  if (options.$cache !== false) { // If caching isn't disabled
    if (filePath) { // If the $file attribute is passed in
      if (cache[filePath]) { // If the template is cached
        return cache[filePath] // Return template
      } else { // Otherwise, read file
        var fs = require('fs')
        var fileContent = fs.readFileSync(filePath, 'utf8')
        cache[filePath] = C(fileContent) // Add the template to the cache
        return cache[filePath] // Then return the cached template
      }
    } else if (name) { // If the $name attribute is passed in
      if (cache[name]) { // If there's a cache for that name
        return cache[name] // Return cached template
      } else if (str) { // Otherwise, as long as there's a string passed in
        cache[name] = C(str) // Add the template to the cache
        return cache[name] // Return cached template
      }
    } else if (str) { // If the string is passed in
      if (softCache) {
        if (cache[str]) { // If it's cached
          return cache[str]
        } else {
          cache[str] = C(str) // Add it to cache
          return cache[str]
        }
      } else {
        return C(str)
      }
    } else {
      return 'Error'
    }
  } else { // If caching is disabled
    return C(str)
  }
}

export function renderFile (filePath, options) {
  options.$file = filePath
  return load(options)(options, Sqrl)
}

export function __express (filePath, options, callback) {
  return callback(null, renderFile(filePath, options))
}
