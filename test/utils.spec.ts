/* global it, expect, describe */

import { trimWS } from '../src/utils'
import { defaultConfig, getConfig } from '../src/config'

describe('Whitespace trim', () => {
  describe('#trimLeft', () => {
    it('WS slurp with str.trimLeft', () => {
      expect(trimWS('  jestjs', defaultConfig, '_')).toBe('jestjs')
    })
    it('WS slurp without str.trimLeft', () => {
      Object.defineProperty(String.prototype, 'trimLeft', { value: undefined })
      expect(trimWS('  jestjs', defaultConfig, '_')).toBe('jestjs')
    })
    it('WS newline', () => {
      expect(trimWS('\njestjs', defaultConfig, '-')).toBe('jestjs')
    })
    it('WS slurp and WS newline are equal with nl or newline of whitespace', () => {
      Object.defineProperty(String.prototype, 'trimLeft', { value: undefined })
      expect(trimWS(' jestjs', defaultConfig, '_')).toBe(trimWS('\njestjs', defaultConfig, '-'))
    })
  })

  describe('#trimRight', () => {
    it('WS slurp with str.trimRight', () => {
      expect(trimWS('jestjs  ', defaultConfig, '', '_')).toBe('jestjs')
    })
    it('WS slurp without str.trimRight', () => {
      Object.defineProperty(String.prototype, 'trimRight', { value: undefined })
      expect(trimWS('jestjs  ', defaultConfig, '', '_')).toBe('jestjs')
    })
    it('WS nl', () => {
      expect(trimWS('jestjs\n', defaultConfig, '', '-')).toBe('jestjs')
    })
    it('WS slurp and WS nl are equal with nl of whitespace', () => {
      Object.defineProperty(String.prototype, 'trimRight', { value: undefined })
      expect(trimWS('jestjs ', defaultConfig, '', '_')).toBe(
        trimWS('jestjs\n', defaultConfig, '', '-')
      )
    })
  })

  describe('#trim', () => {
    it('WS trim - manual', () => {
      expect(trimWS('   jestjs  ', defaultConfig, '_', '_')).toBe('jestjs')
    })

    it('WS trim - config array slurp', () => {
      expect(
        trimWS('  \n jestjs  \r\n  ', getConfig({ autoTrim: ['slurp', 'slurp'] }), '', '')
      ).toBe('jestjs')
    })

    it('WS trim - config slurp', () => {
      expect(trimWS('  \n jestjs  \r\n  ', getConfig({ autoTrim: 'slurp' }), '', '')).toBe('jestjs')
    })

    it('WS trim - config manual hybrid', () => {
      expect(trimWS('  \n jestjs  \r\n', getConfig({ autoTrim: 'slurp' }), '', '-')).toBe(
        'jestjs  '
      )
    })
  })
})
