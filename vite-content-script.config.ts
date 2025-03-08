import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Resolve root path
const root = resolve(__dirname, 'src')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': root, // Alias for 'src' directory
    },
  },
  build: {
    outDir: 'build', // Output directory
    emptyOutDir: false, // Clean output directory before build
    rollupOptions: {
      input: {
        content: resolve(root, 'content-script.ts'),
      },
      output: {
        entryFileNames(chunkInfo) {
          if (chunkInfo.name === 'content') return 'content-script.js'
          return '[name].js'
        },
        format: 'iife',
      },
    },
  },
})
