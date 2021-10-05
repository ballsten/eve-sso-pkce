import { test } from './main'
import { expect } from 'chai'

describe("test", () => {
  it("should pass", () => {
    expect(window.crypto).to.exist
    expect(test()).to.equal('this is a test')
  })
})