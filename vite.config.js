import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// Custom plugin for SPA fallback in dev mode
const spaFallbackPlugin = () => {
  return {
    name: 'spa-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Skip API routes and static files
        if (
          req.url.startsWith('/@') ||
          req.url.startsWith('/node_modules') ||
          req.url.startsWith('/src') ||
          req.url.includes('.') ||
          req.url === '/'
        ) {
          return next()
        }
        
        // For SPA routes like /uniformes, serve index.html
        req.url = '/index.html'
        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    spaFallbackPlugin(),
    react()
  ],
  appType: 'spa',
})
