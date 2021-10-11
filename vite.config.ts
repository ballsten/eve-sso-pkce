import { defineConfig } from 'vite'
import { resolve } from 'path'

module.exports = defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'eve-sso-pkce',
      fileName: (format) => `eve-sso-pkce.${format}.js`
    }
  }
})