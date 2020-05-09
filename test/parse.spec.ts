/* global it, expect, describe, test */

import { parse } from '../src/index'
import { defaultConfig, getConfig } from '../src/config'

var fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'templates/complex.sqrl')

const complexTemplate = fs.readFileSync(filePath, 'utf8')

describe('parse test', () => {
  it('parses a simple template', () => {
    var buff = parse('hi {{ hey }}', defaultConfig)
    expect(buff).toEqual(['hi ', { f: [], c: 'hey', t: 'i' }])
  })

  it('works with whitespace trimming', () => {
    var buff = parse('hi\n{{-hey-}} {{_hi_}}', defaultConfig)
    expect(buff).toEqual(['hi', { f: [], c: 'hey', t: 'i' }, { f: [], c: 'hi', t: 'i' }])
  })

  it('works with rmWhitespace', () => {
    var buff = parse(
      `
<ul>
    <li>Stuff</li>
    <li>Stuff</li>
</ul>

<br />
`,
      getConfig({ rmWhitespace: true })
    )

    // rmWhitespace will remove leading whitespace
    // and multiple newlines in a row

    expect(buff).toEqual(['<ul>\\n<li>Stuff</li>\\n<li>Stuff</li>\\n</ul>\\n<br />'])
  })

  it('works with filters', () => {
    var buff = parse('hi {{ hey | stuff | stuff2 ("param1") }}', defaultConfig)
    expect(buff).toEqual([
      'hi ',
      {
        f: [
          ['stuff', ''],
          ['stuff2', '"param1"']
        ],
        c: 'hey',
        t: 'i'
      }
    ])
  })

  it('works with helpers', () => {
    var buff = parse('{{@each(x) => hi }} Hey {{#else }} oops {{/ each}}', defaultConfig)
    expect(buff).toEqual([
      {
        f: [],
        n: 'each',
        p: 'x',
        res: 'hi',
        t: 'h',
        b: [{ f: [], n: 'else', t: 'b', d: [' oops '] }],
        d: [' Hey ']
      }
    ])
  })

  it('compiles complex template', () => {
    var buff = parse(complexTemplate, defaultConfig)
    expect(buff).toEqual([
      'Hi\\n',
      { f: [], n: 'log', p: '"Hope you like Squirrelly!"', t: 's' },
      { f: [], c: 'htmlstuff', t: 'i' },
      {
        f: [],
        n: 'foreach',
        p: 'options.obj',
        res: 'val, key',
        t: 'h',
        b: [],
        d: [
          '\\nReversed value: ',
          { f: [['reverse', '']], c: 'val', t: 'i' },
          ', Key: ',
          { f: [], c: 'key', t: 'i' },
          {
            f: [],
            n: 'if',
            p: 'key==="thirdchild"',
            t: 'h',
            b: [],
            d: [
              {
                f: [],
                n: 'each',
                p: 'options.obj[key]',
                res: 'index, key',
                t: 'h',
                b: [],
                d: [
                  '\\nSalutations! Index: ',
                  { f: [], c: 'index', t: 'i' },
                  ', old key: ',
                  { f: [], c: 'key', t: 'i' }
                ]
              }
            ]
          }
        ]
      },
      '\\n',
      {
        f: [],
        n: 'customhelper',
        p: '',
        t: 'h',
        b: [
          {
            f: [],
            n: 'cabbage',
            t: 'b',
            d: ['Cabbages taste good\\n', { f: [], c: 'console.log(hi)', t: 'e' }]
          },
          { f: [], n: 'pineapple', t: 'b', d: ['As do pineapples\\n'] }
        ],
        d: []
      },
      '\\nThis is a partial: ',
      { f: [], n: 'include', p: '"mypartial"', t: 's' }
    ])
  })

  test('throws with bad filter syntax', () => {
    expect(() => {
      parse('{{@hi () hey | hi /}}', defaultConfig)
    }).toThrow()
  })

  test('throws with unclosed tag', () => {
    expect(() => {
      parse('{{hi("hey")', defaultConfig)
    }).toThrowError(`unclosed tag at line 1 col 1:

  {{hi("hey")
  ^`)
  })

  test('throws with unclosed single-quote string', () => {
    expect(() => {
      parse("{{ ' }}", defaultConfig)
    }).toThrowError(`unclosed string at line 1 col 4:

  {{ ' }}
     ^`)
  })

  test('throws with unclosed double-quote string', () => {
    expect(() => {
      parse('{{ " }}', defaultConfig)
    }).toThrowError(`unclosed string at line 1 col 4:

  {{ " }}
     ^`)
  })

  test('throws with unclosed template literal', () => {
    expect(() => {
      parse('{{ ` }}', defaultConfig)
    }).toThrowError(`unclosed string at line 1 col 4:

  {{ \` }}
     ^`)
  })

  it('works with template literal', () => {
    var buff = parse('{{ `stuff ${val} stuff` }}', defaultConfig)
    expect(buff).toEqual([{ f: [], c: '`stuff ${val} stuff`', t: 'i' }])
  })

  it('works with comments', () => {
    var buff = parse('{{! /* comment */ console.log("HI"); /*comment*/ }}', defaultConfig)
    expect(buff).toEqual([{ f: [], c: '/* comment */ console.log("HI"); /*comment*/', t: 'e' }])
  })

  test('throws with unclosed multi-line comment', () => {
    expect(() => {
      parse('{{! /* }}', defaultConfig)
    }).toThrowError(`unclosed comment at line 1 col 5:

  {{! /* }}
      ^`)
  })

  it('works with self-closing helpers', () => {
    var buff = parse('{{@log ("hey") | hi /}}', defaultConfig)
    expect(buff).toEqual([{ f: [['hi', '']], n: 'log', p: '"hey"', t: 's' }])
  })

  it('works with helpers with results', () => {
    var buff = parse('{{@log ("hey") => res, res2}}{{/log}}', defaultConfig)
    expect(buff).toEqual([{ f: [], n: 'log', p: '"hey"', res: 'res, res2', t: 'h', b: [], d: [] }])
  })

  test("throws when helpers start and end don't match", () => {
    expect(() => {
      parse('{{@each(x) => hi }} Hey {{#else }} oops {{/ if}}', defaultConfig)
    }).toThrow()
  })
})
