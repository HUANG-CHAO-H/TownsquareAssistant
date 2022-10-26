import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react'
import {Plugin, RenderedChunk} from 'rollup';

const rootDirName = resolve(__dirname, '../');

// https://vitejs.dev/config/
export default function ({ mode }) {
  const isDev = mode === 'development';
  return defineConfig({
    plugins: [react(), ClearImportPolyfill()],
    publicDir: resolve(rootDirName, 'static'),
    build: {
      target: 'esnext',
      // 指定输出路径（相对于 项目根目录)
      outDir: 'dist',
      // 指定生成静态资源的存放路径（相对于 build.outDir）。
      // assetsDir: 'static',
      rollupOptions: {
        input: {
          popup: resolve(rootDirName, 'src/popup.html'),
          contentScript: resolve(rootDirName, 'src/contentScript.html'),
        },
        output: {
          chunkFileNames: 'js/[name].js',
          entryFileNames: 'js/[name].js',
          assetFileNames: 'assets/[ext]/[name].[ext]',
        }
      },
      // 设置为 {} 则会启用 rollup 的监听器。对于只在构建阶段或者集成流程使用的插件很常用。
      watch: isDev ? {
        buildDelay: 1000,
        exclude: ['node_modules/**', 'package.json', 'yarn.lock', '.gitignore', 'tsconfig.json', 'config/**']
      } : undefined,
      // 设置为 false 可以禁用最小化混淆，或是用来指定使用哪种混淆器。默认为 Esbuild，它比 terser 快 20-40 倍，压缩率只差 1%-2%。
      minify: isDev ? false : 'esbuild',
      // 启用/禁用 gzip 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。
      reportCompressedSize: !isDev,
    }
  })
}

/**
 * 一个简单的插件，用来将contentScript.js文件中开头的import语句去掉
 */
function ClearImportPolyfill(): Plugin {
  return {
    name: 'clear-import-Polyfill',
    renderChunk(code: string, chunk: RenderedChunk) {
      if (chunk.fileName.includes('contentScript.js')) {
        const reg = /import (\S)*;/
        return code.replace(reg, '');
      }
      return null;
    }
  }
}
