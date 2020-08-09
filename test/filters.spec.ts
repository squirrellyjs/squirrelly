/* global it, expect, describe */

import { render, filters } from '../src'

filters.define('capitalize', function (str: string) {
  return str.toUpperCase()
})

describe('Simple render checks', () => {
  describe('render works', () => {
    it('Simple filter works', () => {
      expect(render('Hi {{it.name | capitalize}}', { name: 'Ada Lovelace' })).toEqual(
        'Hi ADA LOVELACE'
      )
    })
    it('Escaping works', () => {
      expect(render('{{it.html}}', { html: '<script>Malicious XSS</script>' })).toEqual(
        '&lt;script&gt;Malicious XSS&lt;/script&gt;'
      )
    })
    it('Unescaping with * works', () => {
      expect(render('{{ * it.html}}', { html: '<script>Malicious XSS</script>' })).toEqual(
        '<script>Malicious XSS</script>'
      )
    })
    it('Unescaping with | safe works', () => {
      expect(render('{{it.html | safe}}', { html: '<script>Malicious XSS</script>' })).toEqual(
        '<script>Malicious XSS</script>'
      )
    })
    it('Custom filter with parameters', () => {
      filters.define('customFilterWithParams', function (obj: any, ...filterParameters: any[]): string {
        const [joinStr, lastJoinStr] = filterParameters
        const last = obj.splice(-1)
        return obj.join(joinStr) + lastJoinStr + last;
      })
      expect(render(`{{ it.fruits | customFilterWithParams(', ', ' or ') /}}?`, { fruits: [1, 2, 3] }))
      .toEqual('Banana, Kiwi or Apple?')
    })
  })
})
