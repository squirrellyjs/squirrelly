/* global RUNTIME */
import {
  regEx,
  setup,
  replaceParamHelpers
} from './regexps'
import nativeHelpers from './nativeHelpers'
import {
  parseFiltered
} from './filters'
import P from './partials'

function Compile (str) {
  var lastIndex = 0
  var funcStr = '' // This will be called with Function() and returned
  var helperArray = [] // A list of all 'outstanding' helpers, or unclosed helpers
  var helperNumber = -1
  var helperAutoId = 0 // Squirrelly automatically generates an ID for helpers that don't have a custom ID
  var helperContainsBlocks = {} // If a helper contains any blocks, helperContainsBlocks[helperID] will be set to true
  var m
  setup()
  while ((m = regEx.exec(str)) !== null) {
    if (funcStr === '') {
      funcStr += "var tR='" + str.slice(lastIndex, m.index).replace(/'/g, "\\'") + '\';'
    } else if (lastIndex !== m.index) {
      funcStr += "tR+='" + str.slice(lastIndex, m.index).replace(/'/g, "\\'") + '\';'
    }
    lastIndex = m[0].length + m.index
    if (m[1]) {
      // It's a global ref. p4 = filters
      funcStr += 'tR+=' + globalRef(m[1], m[4]) + ';'
    } else if (m[3]) {
      // It's a helper ref. p2 = id (with ':' after it) or path, p4 = filters
      funcStr += 'tR+=' + helperRef(m[3], m[2], m[4]) + ';'
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
        funcStr += 'tR+=Sqrl.H.' + m[5] + '(' + params + ',function(hvals){var hvals' + id + "=hvals;var tR='';"
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
            funcStr += 'return tR}});'
          } else {
            funcStr += 'return tR});'
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
          funcStr += nativeH.blocks[m[9]](parent.id)
          lastIndex = regEx.lastIndex // Some native helpers set regEx.lastIndex
        } else {
          console.warn("Native helper '%s' doesn't accept that block.", parent.name)
        }
      } else {
        if (!helperContainsBlocks[parent.id]) {
          funcStr += 'return tR},{' + m[9] + ':function(hvals){var hvals' + parent.id + "=hvals;var tR='';"
          helperContainsBlocks[parent.id] = true
        } else {
          funcStr += 'return tR},' + m[9] + ':function(hvals){var hvals' + parent.id + "=hvals;var tR='';"
        }
      }
    } else if (m[10]) {
      // It's a self-closing helper
      var innerParams = m[11] || ''
      innerParams = replaceParamHelpers(innerParams)
      if (m[10] === 'include') {
      // This code literally gets the template string up to the include self-closing helper,
      // adds the content of the partial, and adds the template string after the include self-closing helper
        var preContent = str.slice(0, m.index)
        var endContent = str.slice(m.index + m[0].length)
        var partialParams = innerParams.replace(/'|"/g, '') // So people can write {{include(mypartial)/}} or {{include('mypartial')/}}
        var partialContent = P[partialParams]
        str = preContent + partialContent + endContent
        lastIndex = regEx.lastIndex = m.index
      } else if (nativeHelpers.hasOwnProperty(m[10]) && nativeHelpers[m[10]].hasOwnProperty('selfClosing')) {
        funcStr += nativeHelpers[m[10]].selfClosing(innerParams)
        lastIndex = regEx.lastIndex // changeTags sets regEx.lastIndex
      } else {
        funcStr += 'tR+=Sqrl.H.' + m[10] + '(' + innerParams + ');' // If it's not native, passing args to a non-native helper
      }
    }
    /* eslint-disable no-inner-declarations */
    function globalRef (refName, filters) {
      return parseFiltered('options.' + refName, filters)
    }

    function helperRef (name, id, filters) {
      var prefix
      if (typeof id !== 'undefined') {
        if (/(?:\.\.\/)+/g.test(id)) { // Test if the helper reference is prefixed with ../
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
  if (funcStr === '') {
    funcStr += "var tR='" + str.slice(lastIndex, str.length).replace(/'/g, "\\'") + "';"
  } else if (lastIndex !== str.length) {
    funcStr += "tR+='" + str.slice(lastIndex, str.length).replace(/'/g, "\\'") + "';"
  }
  funcStr += 'return tR'
  var func = new Function('options', 'Sqrl', funcStr.replace(/\n/g, '\\n').replace(/\r/g, '\\r')) //eslint-disable-line
  return func
}

if (RUNTIME) {
  Compile = {} // eslint-disable-line no-func-assign
}

export default Compile
