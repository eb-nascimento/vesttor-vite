import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { validarAmbienteFirebase } from './validarAmbienteFirebase.js'

// https://vite.dev/config/
const envDir = fileURLToPath(new URL('./env/', import.meta.url))

export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    validarAmbienteFirebase(loadEnv(mode, envDir, 'VITE_'))
  }
  return {
    root: fileURLToPath(new URL('../src/', import.meta.url)),
    publicDir: fileURLToPath(new URL('../public/', import.meta.url)),
    build: {
      outDir: fileURLToPath(new URL('../dist/', import.meta.url)),
      emptyOutDir: true,
    },
    test: {
      root: fileURLToPath(new URL('../', import.meta.url)),
    },
    envDir,
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
  }
})
