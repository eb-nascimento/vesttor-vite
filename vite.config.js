import { defineConfig, loadEnv } from 'vite'
import process from 'node:process'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { validarAmbienteFirebase } from './config/validarAmbienteFirebase.js'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    validarAmbienteFirebase(loadEnv(mode, process.cwd(), 'VITE_'))
  }
  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
  }
})
