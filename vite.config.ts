import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This config is used for building the DEMO app (GitHub Pages), not the library itself.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Output demo to 'build' folder to avoid conflict with library 'dist'
  },
  // If deploying to https://<USERNAME>.github.io/react-dachswitch/
  // valid base is '/react-dachswitch/'
  base: './', 
});