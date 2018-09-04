export default /{{ *?(?:(?:(?:(?:([a-zA-Z_$]+[\w]* *?(?:[^\s\w\($]+[^\n]*)*?))|(?:@(?:([\w$]+:|(?:\.\.\/)+))? *(.+?) *))(?: *?(\| *?[\w$]+? *?)*?)?)|(?:([a-zA-Z_$]+[\w]*) *?\(([^\n]*)\) *?([A-Za-z$_]*[\w]*))|(?:\/ *?([a-zA-Z_$]+[\w]*))|(?:# *?([a-zA-Z_$]+[\w]*))|(?:([a-zA-Z_$]+[\w]*) *?\(([^\n]*)\) *?\/)) *?}}/g
export var paramHelperRefRegExp = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[\\]@(?:[\w$]*:)?[\w$]+|@(?:([\w$]*):)?([\w$]+)/g


//The default RegExp broken down:

//Total RegEx:
/* START REGEXP
{{ *? //the beginning
(?: //or for each possible tag
(?: //if a global or helper ref
(?: //choosing global or helper ref
(?:([a-zA-Z_$]+[\w]* *?(?:[^\s\w\($]+[^\n]*)*?)) //global reference
|
(?:@(?:([\w$]+:|(?:\.\.\/)+))? *(.+?) *) //helper reference
)
(?: *?(\| *?[\w$]+? *?)*?)? //filter
) //end if a global or helper ref
| //now if a helper oTag
(?:([a-zA-Z_$]+[\w]*) *?\(([^\n]*)\) *?([A-Za-z$_]*[\w]*))
| //now if a helper cTag
(?:\/ *?([a-zA-Z_$]+[\w]*))
| //now if a helper block
(?:# *?([a-zA-Z_$]+[\w]*))
| //now if a possible macro
(?:([a-zA-Z_$]+[\w]*) *?\(([^\n]*)\) *?\/)
) //end or for each possible tag
 *?}}		


END REGEXP*/
/*
p1: global ref main
p2: helper ref id (with ':' after it) or path
p3: helper ref main
p4: filters
p5: helper name
p6: helper parameters
p7: helper id
p8: helper cTag name
p9: helper block name
p10: self closing helper name
p11: self closing helper params
Which equals: /{{ *?(?:(?:(?:(?:([a-zA-Z_$]+[\w]* *?(?:[^\s\w\($]+[^\n]*)*?))|(?:@(?:([\w$]+:|(?:\.\.\/)+))? *(.+?) *))(?: *?(\| *?[\w$]+? *?)*?)?)|(?:([a-zA-Z_$]+[\w]*) *?\(([^\n]*)\) *?([A-Za-z$_]*[\w]*))|(?:\/ *?([a-zA-Z_$]+[\w]*))|(?:# *?([a-zA-Z_$]+[\w]*))|(?:([a-zA-Z_$]+[\w]*) *?\(([^\n]*)\) *?\/)) *?}}/g
Here's the RegExp I use to turn the expanded version between START REGEXP and END REGEXP to a working one: I replace [\f\n\r\t\v\u00a0\u1680\u2000\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]| \/\/[\w ']+\n with nothing.
*/