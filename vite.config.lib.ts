import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      // Entry point for the library
      entry: resolve(__dirname, 'components/index.ts'),
      name: 'ReactDACHSwitch',
      // Output file names
      fileName: (format) => `react-dachswitch.${format === 'es' ? 'js' : 'umd.cjs'}`,
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      external: ['react', 'react-dom'],
      output: {
        // Global variables to use in the UMD build for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    sourcemap: true, // Generate source maps for debugging
    emptyOutDir: true, // Clear dist folder before build
  },
});