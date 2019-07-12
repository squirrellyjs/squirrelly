import { changeTags } from './regexps'
var nativeHelpers = {
  if: {
    helperStart: function (param) { // helperStart is called with (params, id) but id isn't needed
      return 'if(' + param + '){'
    },
    helperEnd: function () {
      return '}'
    },
    blocks: {
      else: function () { // called with (id) but neither param is needed
        return '}else{'
      }
    }
  },
  each: {
    helperStart: function (param, id) { // helperStart is called with (params, id) but id isn't needed
      return 'for(var i=0;i<' + param + ".length; i++){tR+=(function(hvals){var tR='';var hvals" + id + '=hvals;'
    },
    helperEnd: function (param) {
      return 'return tR})({this:' + param + '[i],index:i})};'
    }
  },
  foreach: {
    helperStart: function (param, id) {
      return 'for(var key in ' + param + '){if(!' + param + ".hasOwnProperty(key)) continue;tR+=(function(hvals){var tR='';var hvals" + id + '=hvals;'
    },
    helperEnd: function (param) {
      return 'return tR})({this:' + param + '[key], key: key})};'
    }
  },
  log: {
    selfClosing: function (param) {
      return 'console.log(' + param + ');'
    }
  },
  tags: {
    selfClosing: function (param) {
      var firstTag = param.slice(0, param.indexOf(',')).trim()
      var secondTag = param.slice(param.indexOf(',') + 1).trim()
      changeTags(firstTag, secondTag)
      return ''
    }
  },
  js: { // The js self-closing helper allows you to inject JavaScript straight into your template function
    selfClosing: function (param) {
      return param + ';'
    }
  }
}

export default nativeHelpers
