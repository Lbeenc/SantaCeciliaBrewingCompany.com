import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In development, API calls go to the ASP.NET Core server.
// `npm run build` writes the site into the server's wwwroot so one app serves both.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5172',
    },
  },
  build: {
    outDir: '../server/SantaCecilia.Api/wwwroot',
    emptyOutDir: true,
  },
})
