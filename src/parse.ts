import SqrlErr, { ParseErr } from './err'
import { trimWS } from './utils'

/* TYPES */

import { SqrlConfig } from './config'

export type TagType = 'h' | 'b' | 'i' | 'r' | 'c' | 'e' | 'q' | 's'
// TODO: change to anagram "QBIRCHES"
export type TemplateAttribute = 'c' | 'f' | 'fp' | 'p' | 'n' | 'res' | 'err'
export type TemplateObjectAttribute = 'c' | 'p' | 'n' | 'res'

export type AstObject = string | TemplateObject

export type Filter = [string, string] | [string, string, true]
// [name, params, async]
export interface TemplateObject {
  n?: string
  t?: 'h' | 'b' | 'i' | 'c' | 'q' | 'e' | 's'
  f: Array<Filter>
  c?: string
  p?: string
  res?: string
  d?: Array<AstObject>
  raw?: boolean
  a?: boolean // async
  b?: Array<ParentTemplateObject>
}

export interface ParentTemplateObject extends TemplateObject {
  d: Array<AstObject>
  b: Array<ParentTemplateObject>
}

/* END TYPES */

var asyncRegExp = /^async +/

var templateLitReg = /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g

var singleQuoteReg = /'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g

var doubleQuoteReg = /"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g

var specialCharsReg = /[.*+\-?^${}()|[\]\\]/g

function escapeRegExp (string: string) {
  // From MDN
  return specialCharsReg.test(string)
    ? string.replace(specialCharsReg, '\\$&') // $& means the whole matched string
    : string
}

export default function parse (str: string, env: SqrlConfig): Array<AstObject> {
  /* Adding for EJS compatibility */
  if (env.rmWhitespace) {
    // Code taken directly from EJS
    // Have to use two separate replaces here as `^` and `$` operators don't
    // work well with `\r` and empty lines don't work well with the `m` flag.
    // Essentially, this replaces the whitespace at the beginning and end of
    // each line and removes multiple newlines.
    str = str.replace(/[\r\n]+/g, '\n').replace(/^\s+|\s+$/gm, '')
  }
  /* End rmWhitespace option */

  templateLitReg.lastIndex = 0
  singleQuoteReg.lastIndex = 0
  doubleQuoteReg.lastIndex = 0

  var envPrefixes = env.prefixes

  var prefixes = [
    envPrefixes.h,
    envPrefixes.b,
    envPrefixes.i,
    envPrefixes.r,
    envPrefixes.c,
    envPrefixes.e
  ].reduce(function (accumulator, prefix) {
    if (accumulator && prefix) {
      return accumulator + '|' + escapeRegExp(prefix)
    } else if (prefix) {
      // accumulator is empty
      return escapeRegExp(prefix)
    } else {
      // prefix and accumulator are both empty strings
      return accumulator
    }
  }, '')

  var parseCloseReg = new RegExp(
    '([|()]|=>)|' + // powerchars
    '(\'|"|`|\\/\\*)|\\s*((\\/)?(-|_)?' + // comments, strings
      escapeRegExp(env.tags[1]) +
      ')',
    'g'
  )

  var tagOpenReg = new RegExp(
    '([^]*?)' + escapeRegExp(env.tags[0]) + '(-|_)?\\s*(' + prefixes + ')?\\s*',
    'g'
  )

  var startInd = 0
  var trimNextLeftWs: string | false = false

  function parseTag (tagOpenIndex: number, currentType: TagType): TemplateObject {
    var currentObj: TemplateObject = { f: [] }
    var numParens = 0
    var currentAttribute: TemplateAttribute = 'c' // default - Valid values: 'c'=content, 'f'=filter, 'fp'=filter params, 'p'=param, 'n'=name

    if (currentType === 'h' || currentType === 'b' || currentType === 'c') {
      currentAttribute = 'n'
    } else if (currentType === 'r') {
      currentObj.raw = true
      currentType = 'i'
    }

    function addAttrValue (indx: number) {
      var valUnprocessed = str.slice(startInd, indx)
      // console.log(valUnprocessed)
      var val = valUnprocessed.trim()
      if (currentAttribute === 'f') {
        if (val === 'safe') {
          currentObj.raw = true
        } else {
          if (env.async && asyncRegExp.test(val)) {
            val = val.replace(asyncRegExp, '')
            currentObj.f.push([val, '', true])
          } else {
            currentObj.f.push([val, ''])
          }
        }
      } else if (currentAttribute === 'fp') {
        currentObj.f[currentObj.f.length - 1][1] += val
      } else if (currentAttribute === 'err') {
        if (val) {
          var found = valUnprocessed.search(/\S/)
          ParseErr('invalid syntax', str, startInd + found)
        }
      } else {
        // if (currentObj[currentAttribute]) { // TODO make sure no errs
        //   currentObj[currentAttribute] += val
        // } else {
        currentObj[currentAttribute] = val
        // }
      }
      startInd = indx + 1
    }

    parseCloseReg.lastIndex = startInd

    var m
    // tslint:disable-next-line:no-conditional-assignment
    while ((m = parseCloseReg.exec(str)) !== null) {
      var char = m[1]
      var punctuator = m[2]
      var tagClose = m[3]
      var slash = m[4]
      var wsControl = m[5]
      var i = m.index

      if (char) {
        // Power character
        if (char === '(') {
          if (numParens === 0) {
            if (currentAttribute === 'n') {
              addAttrValue(i)
              currentAttribute = 'p'
            } else if (currentAttribute === 'f') {
              addAttrValue(i)
              currentAttribute = 'fp'
            }
          }
          numParens++
        } else if (char === ')') {
          numParens--
          if (numParens === 0 && currentAttribute !== 'c') {
            // Then it's closing a filter, block, or helper
            addAttrValue(i)

            currentAttribute = 'err' // Reset the current attribute
          }
        } else if (numParens === 0 && char === '|') {
          addAttrValue(i) // this should actually always be whitespace or empty
          currentAttribute = 'f'
        } else if (char === '=>') {
          addAttrValue(i)
          startInd += 1 // this is 2 chars
          currentAttribute = 'res'
        }
      } else if (punctuator) {
        if (punctuator === '/*') {
          var commentCloseInd = str.indexOf('*/', parseCloseReg.lastIndex)
          if (commentCloseInd === -1) {
            ParseErr('unclosed comment', str, m.index)
          }
          parseCloseReg.lastIndex = commentCloseInd + 2 // since */ is 2 characters, and we're using indexOf rather than a RegExp
        } else if (punctuator === "'") {
          singleQuoteReg.lastIndex = m.index

          var singleQuoteMatch = singleQuoteReg.exec(str)
          if (singleQuoteMatch) {
            parseCloseReg.lastIndex = singleQuoteReg.lastIndex
          } else {
            ParseErr('unclosed string', str, m.index)
          }
        } else if (punctuator === '"') {
          doubleQuoteReg.lastIndex = m.index
          var doubleQuoteMatch = doubleQuoteReg.exec(str)

          if (doubleQuoteMatch) {
            parseCloseReg.lastIndex = doubleQuoteReg.lastIndex
          } else {
            ParseErr('unclosed string', str, m.index)
          }
        } else if (punctuator === '`') {
          templateLitReg.lastIndex = m.index
          var templateLitMatch = templateLitReg.exec(str)
          if (templateLitMatch) {
            parseCloseReg.lastIndex = templateLitReg.lastIndex
          } else {
            ParseErr('unclosed string', str, m.index)
          }
        }
      } else if (tagClose) {
        addAttrValue(i)
        startInd = i + m[0].length
        tagOpenReg.lastIndex = startInd
        // console.log('tagClose: ' + startInd)
        trimNextLeftWs = wsControl
        if (slash && currentType === 'h') {
          currentType = 's'
        } // TODO throw err
        currentObj.t = currentType
        return currentObj
      }
    }
    ParseErr('unclosed tag', str, tagOpenIndex)
    return currentObj // To prevent TypeScript from erroring
  }

  function parseContext (parentObj: TemplateObject, firstParse?: boolean): ParentTemplateObject {
    parentObj.b = [] // assume there will be blocks // TODO: perf optimize this
    parentObj.d = []
    var lastBlock: ParentTemplateObject | false = false
    var buffer: Array<AstObject> = []

    function pushString (strng: string, shouldTrimRightOfString?: string | false) {
      if (strng) {
        // if string is truthy it must be of type 'string'

        // TODO: benchmark replace( /(\\|')/g, '\\$1')
        strng = trimWS(
          strng,
          env,
          trimNextLeftWs, // this will only be false on the first str, the next ones will be null or undefined
          shouldTrimRightOfString
        )

        if (strng) {
          // replace \ with \\, ' with \'

          strng = strng.replace(/\\|'/g, '\\$&').replace(/\r\n|\n|\r/g, '\\n')
          // we're going to convert all CRLF to LF so it doesn't take more than one replace

          buffer.push(strng)
        }
      }
    }

    // Random TODO: parentObj.b doesn't need to have t: #
    var tagOpenMatch
    // tslint:disable-next-line:no-conditional-assignment
    while ((tagOpenMatch = tagOpenReg.exec(str)) !== null) {
      var precedingString = tagOpenMatch[1]
      var shouldTrimRightPrecedingString = tagOpenMatch[2]
      var prefix = tagOpenMatch[3] || ''
      var prefixType: TagType | undefined

      for (var key in envPrefixes) {
        if (envPrefixes[key] === prefix) {
          prefixType = key as TagType
          break
        }
      }

      pushString(precedingString, shouldTrimRightPrecedingString)
      startInd = tagOpenMatch.index + tagOpenMatch[0].length

      if (!prefixType) {
        ParseErr('unrecognized tag type: ' + prefix, str, startInd)
      }

      var currentObj = parseTag(tagOpenMatch.index, prefixType as TagType)
      // ===== NOW ADD THE OBJECT TO OUR BUFFER =====

      var currentType = currentObj.t
      if (currentType === 'h') {
        var hName = currentObj.n || ''
        if (env.async && asyncRegExp.test(hName)) {
          currentObj.a = true
          currentObj.n = hName.replace(asyncRegExp, '')
        }
        currentObj = parseContext(currentObj) // currentObj is the parent object
        buffer.push(currentObj)
      } else if (currentType === 'c') {
        // tag close
        if (parentObj.n === currentObj.n) {
          if (lastBlock) {
            // If there's a previous block
            lastBlock.d = buffer
            parentObj.b.push(lastBlock)
          } else {
            parentObj.d = buffer
          }
          // console.log('parentObj: ' + JSON.stringify(parentObj))
          return parentObj as ParentTemplateObject
        } else {
          ParseErr(
            "Helper start and end don't match",
            str,
            tagOpenMatch.index + tagOpenMatch[0].length
          )
        }
      } else if (currentType === 'b') {
        // block
        // TODO: make sure async stuff inside blocks are recognized
        if (lastBlock) {
          // If there's a previous block
          lastBlock.d = buffer
          parentObj.b.push(lastBlock)
        } else {
          parentObj.d = buffer
        }

        var blockName = currentObj.n || ''
        if (env.async && asyncRegExp.test(blockName)) {
          currentObj.a = true
          currentObj.n = blockName.replace(asyncRegExp, '')
        }

        lastBlock = currentObj as ParentTemplateObject // Set the 'lastBlock' object to the value of the current block

        buffer = []
      } else if (currentType === 's') {
        var selfClosingHName = currentObj.n || ''
        if (env.async && asyncRegExp.test(selfClosingHName)) {
          currentObj.a = true
          currentObj.n = selfClosingHName.replace(asyncRegExp, '')
        }
        buffer.push(currentObj)
      } else {
        buffer.push(currentObj)
      }
      // ===== DONE ADDING OBJECT TO BUFFER =====
    }

    if (firstParse) {
      pushString(str.slice(startInd, str.length), false)
      parentObj.d = buffer
    } else {
      throw SqrlErr('unclosed helper "' + parentObj.n + '"')
      // It should have returned by now
    }

    return parentObj as ParentTemplateObject
  }

  var parseResult = parseContext({ f: [] }, true)
  // console.log(JSON.stringify(parseResult))
  if (env.plugins) {
    for (var i = 0; i < env.plugins.length; i++) {
      var plugin = env.plugins[i]
      if (plugin.processAST) {
        parseResult.d = plugin.processAST(parseResult.d, env)
      }
    }
  }
  return parseResult.d // Parse the very outside context
}
