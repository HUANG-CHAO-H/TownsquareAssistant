import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react'
import {OutputBundle, OutputOptions, Plugin} from 'rollup';

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
      assetsDir: 'static',
      // 指定生成静态资源的存放路径（相对于 build.outDir）。
      rollupOptions: {
        input: {
          popup: resolve(rootDirName, 'src/page_popup/index.html'),
          contentScript: resolve(rootDirName, 'src/content-scripts/index.html'),
        },
        output: {
          chunkFileNames: 'static/js/[name].js',
          entryFileNames: 'static/js/[name].js',
          assetFileNames: 'static/[ext]/[name].[ext]',
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

function ClearImportPolyfill(): Plugin {
  return {
    name: 'clear-import-Polyfill',
    writeBundle(options: OutputOptions, bundle: OutputBundle) {
      debugger;
    }
  }
}
