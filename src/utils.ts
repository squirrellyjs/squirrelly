// TODO: allow '-' to trim up until newline. Use [^\S\n\r] instead of \s
// TODO: only include trimLeft polyfill if not in ES6

/* TYPES */

import { SqrlConfig } from './config'

/* END TYPES */

export var promiseImpl = new Function('return this')().Promise

var asyncFunc: FunctionConstructor | false = false

try {
  asyncFunc = new Function('return (async function(){}).constructor')()
} catch (e) {
  // We shouldn't actually ever have any other errors, but...
  if (!(e instanceof SyntaxError)) {
    throw e
  }
}

export { asyncFunc }

export function hasOwnProp (obj: object, prop: string) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export function copyProps<T> (toObj: T, fromObj: T, notConfig?: boolean) {
  for (var key in fromObj) {
    if (hasOwnProp((fromObj as unknown) as object, key)) {
      if (
        fromObj[key] != null &&
        typeof fromObj[key] == 'object' &&
        (key === 'storage' || key === 'prefixes') &&
        !notConfig // not called from Cache.load
      ) {
        // plugins or storage
        // Note: this doesn't merge from initial config!
        // Deep clone instead of assigning
        // TODO: run checks on this
        toObj[key] = copyProps(/*toObj[key] ||*/ {} as T[Extract<keyof T, string>], fromObj[key])
      } else {
        toObj[key] = fromObj[key]
      }
    }
  }
  return toObj
}

function trimWS (
  str: string,
  env: SqrlConfig,
  wsLeft: string | false,
  wsRight?: string | false
): string {
  var leftTrim
  var rightTrim

  if (typeof env.autoTrim === 'string') {
    leftTrim = rightTrim = env.autoTrim
    // Don't need to check if env.autoTrim is false
    // Because leftTrim, rightTrim are initialized as falsy
  } else if (Array.isArray(env.autoTrim)) {
    // kinda confusing
    // but _}} will trim the left side of the following string
    leftTrim = env.autoTrim[1]
    rightTrim = env.autoTrim[0]
  }

  if (wsLeft || wsLeft === false) {
    leftTrim = wsLeft
  }

  if (wsRight || wsRight === false) {
    rightTrim = wsRight
  }

  if (leftTrim === 'slurp' && rightTrim === 'slurp') {
    return str.trim()
  }

  if (leftTrim === '_' || leftTrim === 'slurp') {
    // console.log('trimming left' + leftTrim)
    // full slurp
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!String.prototype.trimLeft) {
      str = str.trimLeft()
    } else {
      str = str.replace(/^[\s\uFEFF\xA0]+/, '')
    }
  } else if (leftTrim === '-' || leftTrim === 'nl') {
    // console.log('trimming left nl' + leftTrim)
    // nl trim
    str = str.replace(/^(?:\n|\r|\r\n)/, '')
  }

  if (rightTrim === '_' || rightTrim === 'slurp') {
    // console.log('trimming right' + rightTrim)
    // full slurp
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!String.prototype.trimRight) {
      str = str.trimRight()
    } else {
      str = str.replace(/[\s\uFEFF\xA0]+$/, '')
    }
  } else if (rightTrim === '-' || rightTrim === 'nl') {
    // console.log('trimming right nl' + rightTrim)
    // nl trim
    str = str.replace(/(?:\n|\r|\r\n)$/, '') // TODO: make sure this gets \r\n
  }

  return str
}

export { trimWS }
