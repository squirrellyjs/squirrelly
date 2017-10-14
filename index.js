const express = require('express')
const app = express()
var fs = require('fs') // this engine requires the fs module
exports.__express = function(filePath, options, callback) {
  fse.readFile(filePath, function (err, content) {
    if (err) return callback(err)
    // this is an extremely simple template engine
    var rendered = content.toString();
    for(var i=0; i < Object.keys(options).length; i++) {
        var cOption = Object.keys(options)[i];
        console.log("cOption: " + cOption);
        if (cOption !== 'settings' && cOption !== '_locals' && cOption !== 'cache') {
        console.log("options.cOption: " + options[cOption]);
        var newRegExp = new RegExp('\{\{'+cOption+'\}\}', 'g')
        console.log("newRegExp: " + newRegExp);
        rendered = rendered.replace(newRegExp, options[cOption]);
        }
    }
    return callback(null, rendered)
  })
}
