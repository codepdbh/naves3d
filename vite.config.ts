import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/naves3d/',
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    host: true,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
});
