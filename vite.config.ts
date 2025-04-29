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
        theme_color: '',
        icons: [
          {
            src: 'vb_logo_1024.png',
            sizes: '1024x1024',
            type: 'image/png',
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
