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

    // Replace optionsTwo
    for (var i = 0; i < Object.keys(optionsTwo).length; i++) {
      var cOption = Object.keys(optionsTwo)[i]
      // cOption stands for current option)
      if (cOption !== 'settings' && cOption !== '_locals' && cOption !== 'cache') {
        var jsOptionRegExp = new RegExp('\{\{\{' + cOption + '\}\}\}', 'g') //eslint-disable-line
        // console.log('optionsTwo.cOption: ' + optionsTwo[cOption])
        var optionRegExp = new RegExp('\{\{' + cOption + '\}\}', 'g') // eslint-disable-line
        // console.log('optionRegExp: ' + optionRegExp)
        if (typeof optionsTwo[cOption] === 'string') {
          renderedString = renderedString.replace(jsOptionRegExp, '"' + optionsTwo[cOption] + '"')
        } else {
          renderedString = renderedString.replace(jsOptionRegExp, optionsTwo[cOption])
        }

        renderedString = renderedString.replace(optionRegExp, optionsTwo[cOption])
      }
    }
    console.log('renderedString: ' + renderedString)
    return renderedString
  }
}
