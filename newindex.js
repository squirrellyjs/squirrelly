"use strict";

(function() {
  var root = this
  var oldSqrl = root.Sqrl
  
  Sqrl.noConflict = function() {
    root.mymodule = oldSqrl
    return mymodule
  }
  if( typeof exports !== 'undefined' ) {
    if( typeof module !== 'undefined' && module.exports ) {
      exports = module.exports = mymodule
    }
    exports.mymodule = mymodule
  } 
  else {
    root.mymodule = mymodule
  }

}).call(this);

var fs = require('fs') // this engine requires the fs module

exports.__express = function (filePath, options, callback) {
    fs.readFile(filePath, function (err, content) {
        if (err) {
            return callback(err)
        }
        var sqrlFile = content.toString()
        var renderedFile = exports.returnHTML(sqrlFile, options)
        return callback(null, renderedFile)
    })
}

exports.handleStr = function (string) {

}
var RegExps = {
    tagMatcher: [^]+?(?={{=)
}
exports.compile = function (sqrlString, opts) {
    console.time('compile')
    var sqrlStr = sqrlString
    sqrlStr = exports.handleStr(sqrlStr)
    var options = new Object(opts)
    console.log("options: " + options)

    var compileFunc = new Function("options", 'return `' + sqrlStr + '`')

    newStr = compileFunc(options)
    console.timeEnd('compile')
    return newStr;
}

exports.preCompile = function (sqrlString, opts) {
    console.time('precompile')
    var sqrlStr = sqrlString
    sqrlStr = exports.handleStr(sqrlStr)
    var options = new Object(opts)
    console.log("options: " + options)

    var compileFunc = new Function("options", 'return `' + sqrlStr + '`')

    newStr = compileFunc(options)
    console.timeEnd('precompile')
    return newStr;
}
