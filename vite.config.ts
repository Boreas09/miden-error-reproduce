import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  optimizeDeps: {
    exclude: ['@demox-labs/miden-sdk'],
    include: ['buffer'],
  },
  assetsInclude: ['**/*.masm'],
  worker: {
    format: 'es'
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'miden-wallet': [
            '@demox-labs/miden-wallet-adapter',
            '@demox-labs/miden-wallet-adapter-react',
            '@demox-labs/miden-wallet-adapter-reactui'
          ],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-slot',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-separator',
            '@radix-ui/react-accordion'
          ],
          'form-vendor': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
