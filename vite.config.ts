import { defineConfig } from 'vite'
import { resolve } from 'path'

module.exports = defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'eveonline-sso',
      fileName: (format) => `eveonline-sso.${format}.js`
    }
  }
})