export var filters = {
  e: function (str) {
    var escMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    }
    // To deal with XSS. Based on Escape implementations of Mustache.JS and Marko, then customized.
    function replaceChar (s) {
      return escMap[s]
    }
    var newStr = String(str)
    if (/[&<>"'/]/.test(newStr)) {
      return newStr.replace(/[&<>"'/]/g, replaceChar)
    } else {
      return newStr
    }
  }
}
// Don't need a filter for unescape because that's just a flag telling Squirrelly not to escape

export var defaultFilters = {
  /* All strings are automatically passed through
each of the default filters the user
Has set to true. This opens up a realm of possibilities like autoEscape, etc.
*/
  // e: false, // Escape is turned off by default for performance
}

export var defaultFilterCache = {
  // This is to prevent having to re-calculate default filters every time you return a filtered string
  start: '',
  end: ''
}

export function setDefaultFilters (obj) {
  if (obj === 'clear') { // If someone calls Sqrl.setDefaultFilters('clear') it clears all default filters
    defaultFilters = {}
  } else {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        defaultFilters[key] = obj[key]
      }
    }
  }
  cacheDefaultFilters()
}

export function autoEscaping (bool) {
  if (bool) {
    autoEscape = true
  } else {
    autoEscape = false
  }
  return autoEscape
}

export var autoEscape = true

export function cacheDefaultFilters () {
  defaultFilterCache = {
    start: '',
    end: ''
  }
  for (var key in defaultFilters) {
    if (!defaultFilters.hasOwnProperty(key) || !defaultFilters[key]) continue
    defaultFilterCache.start += 'Sqrl.F.' + key + '('
    defaultFilterCache.end += ')'
  }
}
export function parseFiltered (initialString, filterString) {
  var filtersArray
  var safe
  var filterStart = ''
  var filterEnd = ''
  if (filterString && filterString !== '') {
    filtersArray = filterString.split('|')
    for (var i = 0; i < filtersArray.length; i++) {
      filtersArray[i] = filtersArray[i].trim() // Removing the spaces just in case someone put | filter| or | filter | or something similar
      if (filtersArray[i] === '') continue
      if (filtersArray[i] === 'safe') {
        // If 'safe' is one of the filters, set safe to true but don't add Sqrl.F.safe
        // Essentially, 'safe' is a flag telling Squirrelly not to autoEscape
        safe = true
        continue
      }
      filterStart = 'Sqrl.F.' + filtersArray[i] + '(' + filterStart
      filterEnd += ')'
    }
  }
  filterStart += defaultFilterCache.start
  filterEnd += defaultFilterCache.end
  if (!safe && autoEscape) {
    filterStart += 'Sqrl.F.e('
    filterEnd += ')'
  }

  return filterStart + initialString + filterEnd
}

function defineFilter (name, callback) {
  filters[name] = callback
}

export { filters as default, defineFilter }
