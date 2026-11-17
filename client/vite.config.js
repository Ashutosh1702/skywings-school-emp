import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const hasRouter = fs.existsSync(path.resolve(__dirname, 'node_modules/react-router-dom'))
const hasRecharts = fs.existsSync(path.resolve(__dirname, 'node_modules/recharts'))
const hasAxios = fs.existsSync(path.resolve(__dirname, 'node_modules/axios'))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      ...(!hasRouter && {
        'react-router-dom': path.resolve(__dirname, 'src/routes/router.jsx'),
      }),
      ...(!hasRecharts && {
        'recharts': path.resolve(__dirname, 'src/components/ui/RechartsFallback.jsx'),
      }),
      ...(!hasAxios && {
        'axios': path.resolve(__dirname, 'src/services/axiosPolyfill.js'),
      }),
    },
  },
})
