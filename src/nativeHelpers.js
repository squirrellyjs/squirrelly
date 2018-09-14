var nativeHelpers = {
    if: {
        helperStart: function (param) { //helperStart is called with (params, id) but id isn't needed
            return "if(" + param + "){"
        },
        helperEnd: function () {
            return "}"
        },
        blocks: {
            else: function () { //called with (id) but neither param is needed
                return "}else{"
            }
        }
    },
    each: {
        helperStart: function (param, id) { //helperStart is called with (params, id) but id isn't needed
            return "for(var i=0;i<" + param + ".length; i++){tmpltRes+=(function(hvals){var tmpltRes='';var hvals" + id + "=hvals;"
        },
        helperEnd: function (param) {
            return "return tmpltRes})({this:" + param + "[i],index:i})};"
        }
    },
    foreach: {
        helperStart: function (param, id) {
            return "for(var key in " + param + "){if(!" + param + ".hasOwnProperty(key)) continue;tmpltRes+=(function(hvals){var tmpltRes='';var hvals" + id + "=hvals;"
        },
        helperEnd: function (param) {
            return "return tmpltRes})({this:" + param + "[key], key: key})};"
        }
    },
    log: {
        selfClosing: function (param) {
            return "console.log(" + param + ");"
        }
    },
    tags: {
        selfClosing: function (param) {
            return ""
        }
    }
}
//We don't need to export nativeHelpers for the runtime script
if (RUNTIME) {
    nativeHelpers = {}
}
export default nativeHelpers