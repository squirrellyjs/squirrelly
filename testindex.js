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

exports.returnHTML = function (sqrlstring, opts) {
    var sqrlstr = sqrlstring
    var options = new Object(opts)
    console.log("options: " + options)
    //Functions to deal with each type of squirrelly pass-in
    function basicParse(match) {
        console.log("basicParse match: " + match)
        var m = match
        var splitExp = /[\[\]]\[*/g
        var insideBracketsExp = /[\w]+(?:\[[\"\'\w]\w*[\"\'\w]\])*/g
        m = m.replace(" ", "")
        console.log("m")
        m = insideBracketsExp.exec(m)[0]
        console.log("m: "+ m)
        m = m.split(splitExp)
        result = options[m[0]]
        console.log("fresult: " + JSON.stringify(result))
        for (var i = 1; i < m.length-1; i++) {
            var thisOp = m[i]
            if (/[\"\']/g.test(m)) {
                thisOp = thisOp.replace(/\"/g, "")
                thisOp = thisOp.replace(/\'/g, "")
                console.log("has quotations")
                result = result[thisOp]
                console.log("result: " + JSON.stringify(result) + "i: " + i)
            } else {
                console.log("result[options]: " + result[options])
                var parsedOp = options[thisOp]
                result = result[parsedOp]
                console.log("result: " + JSON.stringify(result) + "i: " + i)
            }
        }
        return result
    }
    function ifParse(stringtoparse) {

    }
    function forParse(stringtoparse) {

    }
    function whileParse(stringtoparse) {

    }
    function includeParse(stringtoparse) {

    }
    function helperParse(stringtoparse) {

    }
    //Functions to find and execute each kind of squirrelly pass-in
    function basicMatch() {
        //Really long, but covers all of the possibilities
        var RegExp = /(?:\{\{[^]*?\}\})/g
        sqrlstr = sqrlstr.replace(RegExp, basicParse);
    }
    function ifMatch() {

    }
    function forMatch() {

    }
    function whileMatch() {

    }
    function includeMatch() {

    }
    function helperMatch() {

    }
    basicMatch();
    ifMatch();
    forMatch();
    whileMatch();
    includeMatch();
    helperMatch();
    return sqrlstr;
}