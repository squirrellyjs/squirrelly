const express = require('express')
const app = express()
var fs = require('fs') // this engine requires the fs module
exports.__express = function(filePath, options, callback) {
  fs.readFile(filePath, function (err, content) {
    if (err) {
      return callback(err);
    }
    var rendered = content.toString();
    console.log("initial rendered: " + rendered);
    //Do if statements
    var ifRegExp = /(\{\([^]*?\}\})/g;

    function ifEval(match, p1, p2, p3, offset, string) {
      var innerContent;
      var innerContentExp = /<[^]*>/g;
      var returnContent;
      var truthfulness;
      console.log("match: " + match);
      var fRegExp = /\{\(.*\)\{/g;
      var sRegExp = /([^\(\)\{])*([^\(\)\{])/;
      var fMatch = fRegExp.exec(match);
      console.log("fMatch: " + fMatch);
      var sMatch = sRegExp.exec(fMatch);
      console.log("sMatch: " + sMatch);
      var ifContent = sMatch[0].replace(/\s/g, '');
      console.log("ifContent: " + ifContent);
      var conditionalTrueExp = /[^\w]/g;
      if (conditionalTrueExp.exec(ifContent)===null) {//Conditional if variable is true
        if (options[ifContent]===true) {//Conditional if variable is true
          returnContent = innerContentExp.exec(match);
          console.log("true conditional passed");
        } else {
          returnContent = "";
          console.log("conditional failed");
        }
      } else if (ifContent.charAt(0)==="!") {//Conditional if variable is false
        var withoutExclamationExp = /[^!][^]*/;
        var withoutExclamationContent = withoutExclamationExp.exec(ifContent);
        console.log("withoutExclamationExp: " + withoutExclamationContent);
        if (options[withoutExclamationContent]===false) {
          returnContent = innerContentExp.exec(match);
          console.log("returnContent: " + returnContent);
        } else {
          console.log("options[withoutExclamationContent] !== false (conditional failed)");
        }
      }
      return returnContent;
    };

    rendered = rendered.replace(ifRegExp, ifEval);

    //Replace options
    for(var i=0; i < Object.keys(options).length; i++) {
        var cOption = Object.keys(options)[i];
        console.log("cOption: " + cOption);
        if (cOption !== 'settings' && cOption !== '_locals' && cOption !== 'cache') {
        console.log("options.cOption: " + options[cOption]);
        var optionRegExp = new RegExp('\{\{'+cOption+'\}\}', 'g')
        console.log("optionRegExp: " + optionRegExp);
        rendered = rendered.replace(optionRegExp, options[cOption]);
        }
    }
    console.log("rendered: " + rendered);
    return callback(null, rendered)
  })
}
