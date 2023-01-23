import { defineConfig } from 'vite';
import { resolve } from "path";
import react from '@vitejs/plugin-react'

const path_packages = resolve(__dirname, 'packages');

// https://vitejs.dev/config/
export default function ({ mode }) {
  const isDev = mode === 'development';
  return defineConfig({
    plugins: [react()],
    // publicDir: resolve(rootDir, 'static'),
    // resolve: {
    //   alias: {
    //     "@": path_packages,
    //   }
    // },
  })
}

/**
 * 一个简单的插件，用来将contentScript.js文件中开头的import语句去掉
 */
// function ClearImportPolyfill(): Plugin {
//   return {
//     name: 'clear-import-Polyfill',
//     renderChunk(code: string, chunk: RenderedChunk) {
//       if (chunk.fileName.includes('contentScript.js')) {
//         const reg = /import (\S)*;/
//         return code.replace(reg, '');
//       }
//       return null;
//     }
//   }
// }
