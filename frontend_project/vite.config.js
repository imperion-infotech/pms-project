import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/user': {
        target: 'http://192.168.1.3:9091',
        changeOrigin: true,
        secure: false,
      },
      '/admin': {
        target: 'http://192.168.1.3:9091',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://192.168.1.3:9091',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
