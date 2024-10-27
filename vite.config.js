import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        '@firebase/auth', // Mark @firebase/auth as external
        '@firebase/analytics', // Add other Firebase packages if necessary
      ],}},
  plugins: [react()],
});
