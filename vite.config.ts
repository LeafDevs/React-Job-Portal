import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import webpConverter from './plugins/webp-converter';
import obfuscator from './plugins/obfuscator';

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
    obfuscator({
      exclude: [
        'vendor',
        'polyfills',
        'manifest',
      ],
      options: {
        // Override default options if needed
        stringArrayEncoding: ['base64'],
        debugProtection: true,
        selfDefending: true
      }
    }),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
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