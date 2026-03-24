import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // All /auth/* requests are forwarded to Spring Boot backend
      // This bypasses CORS since the request comes from Node.js server, not the browser
      '/auth': {
        target: 'http://192.168.1.3:9091',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
