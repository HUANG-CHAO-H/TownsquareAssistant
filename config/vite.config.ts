import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, '../src/page_popup/index.html'),
        contentScript: resolve(__dirname, '../src/content-scripts/index.html'),
      }
    }
  }
})
