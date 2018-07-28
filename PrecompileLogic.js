Sqrl.Precompile = function (str) {
    var regEx = /{{ *?(?:(?:([\w$]+) *?\(([^\n]*?)\)((?: *?\| *?[\w$]* *?)* *?\|*) *?([\w$]*))|(?:\/ *?([\w$]+))) *?}}/g;
    var lastIndex = 0
    var oLength = -1;
    var funcStr = ""
    var outstanding = [];
    var helperResult = ""
    currentVarName = "tmpltRes"
    str.replace(regEx, function (m, p1, p2, p3, p4, p5, offset) {
        if (p1 === null || typeof p1 === "undefined") {
            var previous = outstanding[oLength];
            if (previous && previous === p5) {
                console.log("lastIndex --> cTag: " + str.slice(lastIndex, offset))
                lastIndex = offset + m.length
                //outstanding.pop(); don't actually need this
                oLength -= 1;
            }
        } else {
            if (p4 === null || typeof p4 === "undefined") {
                
            }
            oLength += 1;
            console.log("lastIndex --> oTag: " + str.slice(lastIndex, offset))
            lastIndex = offset + m.length

            outstanding[oLength] = p1;
            //console.log("outstanding: " + JSON.stringify(outstanding))
        }
    });
    if (str.length > lastIndex) {
        console.log("last part of string: " + parseGlobalRefs(str.slice(lastIndex, str.length), currentVarName, funcStr, regexps))
    }
    console.log("funcString is: " + funcStr)
    return funcStr
    var func = new Function('options', 'Sqrl', funcString.replace(/\n/g, '\\n').replace(/\r/g, '\\r'))
    return func
}