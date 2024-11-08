import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import webpConverter from './webp-converter';

export default defineConfig({
  plugins: [
    react(),
    webpConverter({ 
      quality: 80,
      exclude: [
        'texture',
        'background',
        'bg',
        '.svg',
        'logo',
      ],
      preserveOriginal: true
    }),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    commonjsOptions: {
      include: [/\.tsx?$/, /\.jsx?$/],
    },
  },
  preview: {
    port: 4173,
    strictPort: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});