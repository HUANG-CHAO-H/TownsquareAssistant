import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from "@vitejs/plugin-react";

const path_root = resolve(__dirname, '../../');
const path_packages = resolve(path_root, 'packages');


// https://vitejs.dev/config/
export default function ({mode}) {
    const isDev = mode === 'development';
    return defineConfig({
        plugins: [react()],
        resolve: {
            alias: {
                "@": path_packages,
            }
        },
        build: {
            target: 'esnext',
            // 指定输出路径（相对于 项目根目录)
            outDir: resolve(path_root, 'dist/unitTest'),
            emptyOutDir: true,
            rollupOptions: {
                input: {
                    contentScript: resolve(path_packages, 'unitTest/index.html'),
                },
                output: {
                    chunkFileNames: 'js/[name].js',
                    entryFileNames: 'index.js',
                    assetFileNames: '[ext]/[name].[ext]',
                }
            },
            // 设置为 {} 则会启用 rollup 的监听器。对于只在构建阶段或者集成流程使用的插件很常用。
            watch: isDev ? {
                buildDelay: 1000,
                exclude: ['/node_modules/', 'package.json', 'yarn.lock', '.gitignore', 'tsconfig.json', '.']
            } : undefined,
            // 设置为 false 可以禁用最小化混淆，或是用来指定使用哪种混淆器。默认为 Esbuild，它比 terser 快 20-40 倍，压缩率只差 1%-2%。
            minify: isDev ? false : 'esbuild',
            // 启用/禁用 gzip 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。
            reportCompressedSize: !isDev,
            // 是否生成sourcemap文件
            sourcemap: isDev ? "inline" : undefined,
        },
        preview: {
            host: 'localhost',
            port: 6789,
            open: true,
        }
    })
}
