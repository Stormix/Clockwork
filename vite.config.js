import nodePolyfills from 'rollup-plugin-node-polyfills'

import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [nodePolyfills()],
  resolve: {
    alias: {
      path: 'path-browserify',
    },
    extensions: ['.js', '.ts'],
  },
  server: {
    watch: {
      usePolling: true,
    },
    fs: {
      strict: true,
    },
  },
})
