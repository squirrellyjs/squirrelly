import SqrlErr from './err'

export function errWithBlocksOrFilters(
  name: string,
  blocks: Array<any> | false, // false means don't check
  filters: Array<any> | false,
  native?: boolean
) {
  if (blocks && blocks.length > 0) {
    throw SqrlErr((native ? 'Native' : '') + "Helper '" + name + "' doesn't accept blocks")
  }
  if (filters && filters.length > 0) {
    throw SqrlErr((native ? 'Native' : '') + "Helper '" + name + "' doesn't accept filters")
  }
}

/* ASYNC LOOP FNs */
export function asyncArrLoop(
  arr: Array<any>,
  index: number,
  fn: Function,
  res: string,
  cb: Function
) {
  fn(arr[index], index).then(function (val: string) {
    res += val
    if (index === arr.length - 1) {
      cb(res)
    } else {
      asyncArrLoop(arr, index + 1, fn, res, cb)
    }
  })
}

export function asyncObjLoop(
  obj: { [index: string]: any },
  keys: Array<string>,
  index: number,
  fn: Function,
  res: string,
  cb: Function
) {
  fn(keys[index], obj[keys[index]]).then(function (val: string) {
    res += val
    if (index === keys.length - 1) {
      cb(res)
    } else {
      asyncObjLoop(obj, keys, index + 1, fn, res, cb)
    }
  })
}

var escMap: EscapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function replaceChar(s: string): string {
  return escMap[s]
}

export function XMLEscape(str: unknown) {
  // To deal with XSS. Based on Escape implementations of Mustache.JS and Marko, then customized.
  var newStr = String(str)
  if (/[&<>"']/.test(newStr)) {
    return newStr.replace(/[&<>"']/g, replaceChar)
  } else {
    return newStr
  }
}

/* INTERFACES */
interface EscapeMap {
  '&': '&amp;'
  '<': '&lt;'
  '>': '&gt;'
  '"': '&quot;'
  "'": '&#39;'
  [index: string]: string
}
