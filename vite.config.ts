import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The largest chunk is three.js for Friday's bulb scene, which is lazy-loaded only on that theme.
  build: { chunkSizeWarningLimit: 1100 },
})
