import { defineConfig } from 'vite';
import { resolve } from "path";
import react from '@vitejs/plugin-react'
import postcssImport from 'postcss-import'
import autoprefixer from 'autoprefixer'

export const path_root = resolve(__dirname, './');
export const path_packages = resolve(path_root, 'packages');
export const path_dist = resolve(path_root, 'dist');

// https://vitejs.dev/config/
export default function getGlobalConfig(props: Props) {
  const isDev = props.mode === 'development';
  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path_packages,
      }
    },
    css: {
      postcss: {
        plugins: [postcssImport, autoprefixer]
      },
      modules: {
        // generateScopedName: '[local]_[hash:base64:5]',
        hashPrefix: 'prefix',
        localsConvention: 'camelCase',
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        }
      }
    }
  })
}

export interface Props {
  mode?: 'development'
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
