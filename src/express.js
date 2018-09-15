/* global fs, RUNTIME */
import {
    Render
} from './utils'
import Compile from './compile'

function __express (filePath, options, callback) {
  fs.readFile(filePath, function (err, content) {
    if (err) {
      return callback(err)
    }
    var sqrlString = content.toString()
    var template = Compile(sqrlString)
    var renderedFile = Render(template, options)
    return callback(null, renderedFile)
  })
}

if (RUNTIME) {
  __express = {} // eslint-disable-line no-func-assign
}

export default __express
