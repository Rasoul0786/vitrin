import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const isDocker = process.env.DOCKER_DEV === 'true';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    host: isDocker ? '0.0.0.0' : 'localhost',

    watch: isDocker
      ? { usePolling: true }
      : undefined,

    proxy: {
      '/api': {
        target:
          process.env.VITE_API_PROXY_TARGET ||
          'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
