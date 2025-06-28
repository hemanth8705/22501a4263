import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
     proxy: {
      '/logs': {
        target: 'http://20.244.56.144/evaluation-service',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/logs/, '/logs'),
      },
    },
  },
});
