import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: resolve(__dirname, '../dist/contentScript'),
        lib: {
            entry: resolve(__dirname, '../src/content-scripts/index.tsx'),
            name: 'TownSquareAssistant',
            // the proper extensions will be added
            fileName: 'contentScript',
            formats: ['umd'],
        },
    }
})
