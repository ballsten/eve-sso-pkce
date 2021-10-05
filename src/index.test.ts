import { test } from '.'
import { expect } from 'chai'

describe('test', () => {
  it('should pass', () => {
    expect(window.crypto).to.be.an('object')
    expect(test()).to.equal('this is a test')
  })
})
