import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import path from 'path'
import { tsconfigBaseAliases } from './tsconfig-base-aliases'

const resolve = (p: string): string => path.resolve(__dirname, p)

export default defineConfig({
  assetsInclude: /\.(pdf|jpg|png|webm|mp4|svg|wasm)$/,
  plugins: [Vue()],
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@theme/': `${resolve('./src/theme')}/`,
      '@samatech/learn-chinese': resolve('../learn-chinese/src/index.ts'),
      '@samatech/learn-vietnamese': resolve('../learn-vietnamese/src/index.ts'),
      ...tsconfigBaseAliases(__dirname),
    },
  },
  server: {
    port: Number(process.env.VITE_LEARN_FRONTEND_PORT || 3050),
    host: '127.0.0.1',
    strictPort: true,
    allowedHosts: true,
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        format: 'es',
        dir: 'dist',
      },
    },
  },
})
