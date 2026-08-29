import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/health': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/chat': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/skills': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/gemini': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/generate-files': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  }
})
