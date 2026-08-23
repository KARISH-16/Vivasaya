import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@/contexts': fileURLToPath(new URL('./', import.meta.url)),
      '@/components': fileURLToPath(new URL('./', import.meta.url)),
      '@/layouts': fileURLToPath(new URL('./', import.meta.url)),
      '@/pages': fileURLToPath(new URL('./', import.meta.url)),
      '@/services': fileURLToPath(new URL('./', import.meta.url)),
      '@/types': fileURLToPath(new URL('./index (2).ts', import.meta.url)),
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
