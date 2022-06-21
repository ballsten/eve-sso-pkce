const Environment = require('jest-environment-jsdom')
const crypto = require('crypto')

module.exports = class CustomTestEnvironment extends Environment {
  async setup () {
    await super.setup()
    if (this.global.TextEncoder === undefined) {
      const { TextEncoder, TextDecoder } = require('util')
      this.global.TextEncoder = TextEncoder
      this.global.TextDecoder = TextDecoder
    }
    if (this.global.window.crypto === undefined) {
      this.global.window.crypto = {
        getRandomValues: function (buffer) { return crypto.randomFillSync(buffer) },
        subtle: crypto.webcrypto.subtle
      }
    }
  }
}
