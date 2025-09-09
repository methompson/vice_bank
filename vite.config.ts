import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    VitePWA({
      manifest: {
        name: 'Vice Bank',
        short_name: 'Vice Bank',
        description: 'A manager for your personal vices',
        theme_color: '#F9FFF2',
        icons: [
          {
            src: 'vb_logo_1024_transparent.png',
            sizes: '1024x1024',
            type: 'image/png',
          },
          {
            src: 'vb_logo_180_transparent.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@vice_bank': fileURLToPath(
        new URL('./packages/vice_bank_submodule/src', import.meta.url),
      ),
    },
  },
  server: {
    port: 3001,
  },
});
