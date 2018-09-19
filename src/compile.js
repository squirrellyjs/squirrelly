/* global RUNTIME */
import {
  regEx
} from './regexps'
import nativeHelpers from './nativeHelpers'
import {
  parseFiltered
} from './filters'
import {
  replaceParamHelpers,
  setup,
  takedown
} from './utils'

function Compile (str) {
  var lastIndex = 0
  var funcStr = ''
  var helperArray = []
  var helperNumber = -1
  var helperAutoId = 0
  var helperContainsBlocks = {}
  var m
  setup()
  while ((m = regEx.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regEx.lastIndex) {
      regEx.lastIndex++
    }
    if (funcStr === '') {
      funcStr += "var tmpltRes='" + str.slice(lastIndex, m.index).replace(/'/g, "\\'") + '\';'
    } else {
      if (lastIndex !== m.index) {
        funcStr += "tmpltRes+='" + str.slice(lastIndex, m.index).replace(/'/g, "\\'") + '\';'
      }
    }
    lastIndex = m[0].length + m.index
    if (m[1]) {
      // It's a global ref. p4 = filters
      funcStr += 'tmpltRes+=' + globalRef(m[1], m[4]) + ';'
    } else if (m[3]) {
      // It's a helper ref. p2 = id (with ':' after it) or path, p4 = filters
      funcStr += 'tmpltRes+=' + helperRef(m[3], m[2], m[4]) + ';'
    } else if (m[5]) {
      // It's a helper oTag. p6 parameters, p7 id
      var id = m[7]
      if (id === '' || id === null) {
        id = helperAutoId
        helperAutoId++
      }
      var native = nativeHelpers.hasOwnProperty(m[5]) // true or false
      helperNumber += 1
      var params = m[6] || ''
      params = replaceParamHelpers(params)
      if (!native) {
        params = '[' + params + ']'
      }
      var helperTag = {
        name: m[5],
        id: id,
        params: params,
        native: native
      }
      helperArray[helperNumber] = helperTag
      if (native) {
        funcStr += nativeHelpers[m[5]].helperStart(params, id)
        lastIndex = regEx.lastIndex // the changeTags function sets lastIndex already
      } else {
        funcStr += 'tmpltRes+=Sqrl.H.' + m[5] + '(' + params + ',function(hvals){var hvals' + id + '=hvals;'
      }
    } else if (m[8]) {
      // It's a helper cTag.
      var mostRecentHelper = helperArray[helperNumber]
      if (mostRecentHelper && mostRecentHelper.name === m[8]) {
        helperNumber -= 1
        if (mostRecentHelper.native === true) {
          funcStr += nativeHelpers[mostRecentHelper.name].helperEnd(mostRecentHelper.params, mostRecentHelper.id)
        } else {
          if (helperContainsBlocks[mostRecentHelper.id]) {
            funcStr += 'return tmpltRes}});'
          } else {
            funcStr += 'return tmpltRes});'
          }
        }
      } else {
        console.error("Helper beginning & end don't match.")
      }
    } else if (m[9]) {
      // It's a helper block.
      var parent = helperArray[helperNumber]
      if (parent.native) {
        var nativeH = nativeHelpers[parent.name]
        if (nativeH.blocks && nativeH.blocks[m[9]]) {
          var initialLastIndex = regEx.lastIndex
          funcStr += nativeH.blocks[m[9]](parent.id)
          regEx.lastIndex = lastIndex = initialLastIndex
        } else {
          console.warn("Native helper '%s' doesn't accept that block.", parent.name)
        }
      } else {
        if (!helperContainsBlocks[parent.id]) {
          funcStr += 'return tmpltRes}, {' + m[9] + ':function(hvals){var hvals' + parent.id + "=hvals;var tmpltRes='';"
          helperContainsBlocks[parent.id] = true
        } else {
          funcStr += 'return tmpltRes},' + m[9] + ':function(hvals){var hvals' + parent.id + "=hvals;var tmpltRes='';"
        }
      }
    } else if (m[10]) {
      // It's a self-closing helper
      var innerParams = m[11] || ''
      innerParams = replaceParamHelpers(innerParams)

      if (nativeHelpers.hasOwnProperty(m[10]) && nativeHelpers[m[10]].hasOwnProperty('selfClosing')) {
        funcStr += nativeHelpers[m[10]].selfClosing(innerParams)
        lastIndex = regEx.lastIndex // changeTags sets regEx.lastIndex
      } else {
        funcStr += 'tmpltRes+=Sqrl.H.' + m[10] + '(' + innerParams + ');'
      }
    } else {
      console.error('Err: Code 000')
    }
    /* eslint-disable no-inner-declarations */
    function globalRef (refName, filters) {
      return parseFiltered('options.' + refName, filters)
    }

    function helperRef (name, id, filters) {
      var prefix
      if (typeof id !== 'undefined') {
        if (/(?:\.\.\/)+/g.test(id)) {
          prefix = helperArray[helperNumber - (id.length / 3) - 1].id
        } else {
          prefix = id.slice(0, -1)
        }
        return parseFiltered('hvals' + prefix + '.' + name, filters)
      } // Implied 'else'
      return parseFiltered('hvals.' + name, filters)
    }
    /* eslint-enable no-inner-declarations */
  }
  if (str.length > regEx.lastIndex) {
    if (funcStr === '') {
      funcStr += "var tmpltRes='" + str.slice(lastIndex, str.length).replace(/'/g, "\\'") + "';"
    } else if (lastIndex !== str.length) {
      funcStr += "tmpltRes+='" + str.slice(lastIndex, str.length).replace(/'/g, "\\'") + "';"
    }
  }
  funcStr += 'return tmpltRes'
  takedown()
  var func = new Function('options', 'Sqrl', funcStr.replace(/\n/g, '\\n').replace(/\r/g, '\\r')) //eslint-disable-line
  return func
}

if (RUNTIME) {
  Compile = {} // eslint-disable-line no-func-assign
}

export default Compile
