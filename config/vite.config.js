import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  root: fileURLToPath(new URL('../src/', import.meta.url)),
  publicDir: fileURLToPath(new URL('../public/', import.meta.url)),
  build: {
    outDir: fileURLToPath(new URL('../dist/', import.meta.url)),
    emptyOutDir: true,
  },
  test: {
    root: fileURLToPath(new URL('../', import.meta.url)),
  },
  envDir: fileURLToPath(new URL('./env/', import.meta.url)),
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
