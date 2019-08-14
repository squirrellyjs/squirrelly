export var initialRegEx = /{{ *?(?:(?:([\w$]+) *?\((.*?)\) *?([\w$]*))|(?:([\w$]+) *?\((.*?)\) *?\/)|(?:([\w$@].*?) *?((?:\| *?[\w$]+ *)*))|(?:\/ *?([\w$]+))|(?:# *?([\w$]+))|(?:!--[^]+?--)) *?}}\n?/g
export var initialTags = {
  s: '{{',
  e: '}}'
}

// The regExp below matches all helper references inside helper parameters
var paramHelperRefRegExp = /@(?:((?:\.\.\/)+)|([\w$]+):)?/g

export var regEx = initialRegEx
export var tags = initialTags

export function setup () {
  // Resets the current tags to the default tags
  tags = initialTags
  regEx = initialRegEx
  regEx.lastIndex = 0
}

export function defaultTags (tagArray) {
  // Redefine the default tags of the regexp
  changeTags(tagArray[0], tagArray[1])
  initialRegEx = regEx
  initialTags = tags
}

export function changeTags (firstTag, secondTag) {
  // Update current tags
  var newRegEx =
    firstTag +
    regEx.source.slice(tags.s.length, 0 - (tags.e.length + 3)) +
    secondTag +
    '\\n?'
  var lastIndex = regEx.lastIndex
  tags = {
    s: firstTag,
    e: secondTag
  }
  regEx = RegExp(newRegEx, 'g')
  regEx.lastIndex = lastIndex
}

export function replaceHelperRefs (str, helperArray, helperNumber) {
  return str.replace(paramHelperRefRegExp, function (m, scope, id) {
    var suffix
    if (scope && scope.length) {
      suffix = helperArray[helperNumber - scope.length / 3 - 1].id
    } else if (id) {
      suffix = id
    } else {
      suffix = ''
    }
    return 'hvals' + suffix + '.'
  })
}

// The whole regular expression can be hard to comprehend, so here it's broken down.
// You can pass the string between "START REGEXP" and "END REGEXP" into a regular expression
// That removes whitespace and comments, and outputs a working regular expression.

/* START REGEXP
{{ *? //the beginning
(?: //or for each possible tag
(?:([\w$]+) *?\((.*?)\) *?([\w$]*)) //if a helper oTag
| //now for a self closing tag
(?:([\w$]+) *?\((.*?)\) *?\/)
| //now if a ref
(?: //if a global or helper ref
([\w$@].*?) *? //ref content
((?:\| *?[\w$]+ *)*) //filters
) //end if a global or helper ref
| //now if a helper cTag
(?:\/ *?([\w$]+))
| //now if a helper block
(?:# *?([\w$]+))
| //now for comments
(?:!--[^]+?--)
) //end or for each possible tag
 *?}}
\n? //To replace a newline at the end of a line

END REGEXP */
/*
p1: helper start name
p2: helper start params
p3: helper start id
p4: self-closing helper name
p5: self-closing helper params
p6: ref content
p7: ref filters
p8: helper close name
p9: helper block name
Here's the RegExp I use to turn the expanded version between START REGEXP and END REGEXP to a working one: I replace [^\S ]+| \/\/[\w ']+\n with "".
*/
