import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
    // TODO: Remove `host: true` from production
    host: true
  },
  build: {
    target: 'esnext',
  },
});
