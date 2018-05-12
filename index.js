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

exports.returnHTML = function (rendered, options, ifIndex) {
  var passedIfIndex
  if (rendered === null) {
    return 'err: rendered===null'
  } else {
    var optionsTwo = new Object(options)
    var renderedString = rendered.toString()
  // Do if statements
    if (ifIndex === null || ifIndex === undefined) {
      passedIfIndex = 1
    } else {
      passedIfIndex = ifIndex
    }

    function ifAsteriskCount (index) {
    	var returnAsteriskCount = ''
      for (i = 0; i < index; i++) {
        returnAsteriskCount += '\\*'
	    }
      console.log(returnAsteriskCount)
      return (returnAsteriskCount)
    }

    var ifRegExp = new RegExp('(\\{\\([^]*?\\}' + ifAsteriskCount(passedIfIndex) + '\\})', 'g')

    function ifEval (match) {
      var innerContentExp = /<[^]*>/g
      var returnContent
      console.log('match: ' + match)
      var fRegExp = /\{\(.*\)\{/g
      var sRegExp = /([^\(\)\{])*([^\(\)\{])/ // eslint-disable-line
      var fMatch = fRegExp.exec(match)
      console.log('fMatch: ' + fMatch)
      var sMatch = sRegExp.exec(fMatch)
      console.log('sMatch: ' + sMatch)
      var ifContent = sMatch[0].replace(/\s/g, '')
      console.log('ifContent: ' + ifContent)
      var conditionalTrueExp = /[^\w]/g
      if (conditionalTrueExp.exec(ifContent) === null) { // Conditional if variable is true
        if (optionsTwo[ifContent] === true) { // Conditional if variable is true
          console.log('second conditional')
          returnContent = exports.returnHTML(innerContentExp.exec(match), optionsTwo, passedIfIndex + 1)
          console.log('true returnContent: ' + returnContent)
          console.log('true conditional passed')
        } else {
          returnContent = ''
          console.log('conditional failed')
        }
      } else if (ifContent.charAt(0) === '!') { // Conditional if variable is false
        var withoutExclamationExp = /[^!][^]*/
        var withoutExclamationContent = withoutExclamationExp.exec(ifContent)
        console.log('withoutExclamationExp: ' + withoutExclamationContent)
        if (optionsTwo[withoutExclamationContent] === false) {
          console.log('t conditional')
          returnContent = exports.returnHTML(innerContentExp.exec(match), optionsTwo, passedIfIndex + 1)
          console.log('false returnContent: ' + returnContent)
        } else {
          returnContent = ''
          console.log('optionsTwo[withoutExclamationContent] !== false (conditional failed)')
        }
      }
      return returnContent
    };

    renderedString = renderedString.replace(ifRegExp, ifEval)

    var jsOptionRegExp = /\{\{\{[^]*?\}\}\}/g //eslint-disable-line
    var optionRegExp = /(\{\{[^]*?\}\})/g // eslint-disable-line
    var innerOptionRegExp = /[^{}]+/g

    function optionEval (match) {
      console.log("optionMatch: " + match)
      var innerOptionContent = match.match(innerOptionRegExp)[0]
      console.log("innerOp: " + innerOptionContent);
      console.log("optionEval return content: " + optionsTwo[innerOptionContent])
      return optionsTwo[innerOptionContent]

    }

    function jsOptionEval (match) {
      console.log("jsMatch: " + match);
      var returnOptionContent = match.match(innerOptionRegExp)[0]
      console.log("innerjsop: " +returnOptionContent);
      if (typeof optionsTwo[returnOptionContent] === 'string') {
          console.log("jsreturn: " + "'" + optionsTwo[returnOptionContent] + "'")
          return "'" + optionsTwo[returnOptionContent] + "'"
      } else {
          console.log("jsreturn: " + optionsTwo[returnOptionContent])
          return optionsTwo[returnOptionContent]
      }

    }

    renderedString = renderedString.replace(jsOptionRegExp, jsOptionEval);
    renderedString = renderedString.replace(optionRegExp, optionEval);


    console.log('renderedString: ' + renderedString)
    return renderedString
  }
}
