import { defineConfig } from 'vite';
import { adminApiPlugin } from './lib/admin-api-plugin.js';

export default defineConfig({
  plugins: [adminApiPlugin()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: 'index.html',
        admin: 'admin.html',
      },
    },
  },
});
