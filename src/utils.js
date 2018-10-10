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
    // console.log('Cache at Render: ' + JSON.stringify(cache))
    return res
  }
}

export function definePartial (name, str) {
  P[name] = str
}

export var cache = {}

function handleTemplateCache (options, str) {
  var filePath = options.filePath
  var name = options.templateName
  if (filePath) {
    if (cache[filePath]) {
      // console.log('returning cached 43')
      return cache[filePath]
    } else {
      var fs = require('fs')
      var fileContent = fs.readFileSync(filePath, 'utf8')
      cache[filePath] = C(fileContent)
      return cache[filePath]
    }
  } else if (name) {
    if (cache[name]) {
      // console.log('returning cached 53')
      return cache[name]
    } else if (str) {
      cache[name] = C(str)
      return cache[name]
    }
  } else if (str) {
    // console.log('no cache')
    return C(str)
  }
}

export function __express (filePath, options, callback) {
  options.filePath = filePath
  var renderedFile = handleTemplateCache(options)(options, Sqrl)
  // console.log('Cache at __express: ' + JSON.stringify(cache))
  return callback(null, renderedFile)
}
