import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Create an alias for firebase to ensure proper resolution
      'firebase': resolve(__dirname, 'node_modules/firebase')
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        // Handle global in Firebase
        global: 'globalThis'
      },
    },
    // Force include firebase packages
    include: [
      'firebase/app',
      'firebase/auth',
      'react-firebase-hooks/auth'
    ],
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 600, // Increase from default 500kb to 600kb
    sourcemap: false, // Disable sourcemaps for production to reduce file size
    cssCodeSplit: true, // Ensure CSS is properly handled
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Improved chunk strategy
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('scheduler') || id.includes('react-router')) {
              return 'vendor-react';
            }

            if (id.includes('firebase') || id.includes('fire')) {
              return 'vendor-firebase';
            }

            if (id.includes('@headlessui')) {
              return 'vendor-ui';
            }

            return 'vendor'; // Other 3rd-party dependencies
          }
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  }
})
