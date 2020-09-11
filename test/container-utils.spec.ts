import * as utils from '../src/container-utils'
import SqrlErr from '../src/err'

describe('replaceChar', () => {
  it('should replace & with &amp;', () => {
    let res = utils.replaceChar('&')
    expect(res).toEqual('&amp;')
  })
  it('should replace < with &lt;', () => {
    let res = utils.replaceChar('<')
    expect(res).toEqual('&lt;')
  })
  it('should replace > with &gt;', () => {
    let res = utils.replaceChar('>')
    expect(res).toEqual('&gt;')
  })
  it('should replace " with &quot;', () => {
    let res = utils.replaceChar('"')
    expect(res).toEqual('&quot;')
  })
  it("should replace ' with &#39;", () => {
    let res = utils.replaceChar("'")
    expect(res).toEqual('&#39;')
  })
})

describe('errWithBlocksOrFilters', () => {
  it('should throw error if array of blocks is supplied', (done) => {
    var helperBlock = {
      name: 'block1',
      params: ['param1'],
      exec: function () {
        var tR = ''
        tR += 'Hi'
        return tR
      },
    }

    try {
      utils.errWithBlocksOrFilters('testHelper', [helperBlock], false)
      done('An error should have thrown')
    } catch (e) {
      expect(e).toBeInstanceOf(SqrlErr)
      expect(e.message).toEqual("Helper 'testHelper' doesn't accept blocks")
      done()
    }
  })

  it('should throw error if array of filters is supplied', (done) => {
    try {
      utils.errWithBlocksOrFilters('testHelper', false, ['filter1', 'param1'])
      done('An error should have thrown')
    } catch (e) {
      expect(e).toBeInstanceOf(SqrlErr)
      expect(e.message).toEqual("Helper 'testHelper' doesn't accept filters")
      done()
    }
  })
})
