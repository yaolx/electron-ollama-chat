import fs from 'fs'
import path, { resolve } from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    server: {
      port: 5173,
      https: {
        cert: fs.readFileSync(path.join(__dirname, 'keys/cert.crt')),
        key: fs.readFileSync(path.join(__dirname, 'keys/cert.key'))
      }
    }
  }
})
