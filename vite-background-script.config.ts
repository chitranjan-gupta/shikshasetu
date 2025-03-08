import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

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
        background: resolve(root, 'background-script.ts'),
      },
      output: {
        entryFileNames(chunkInfo) {
          if (chunkInfo.name === 'background') return 'background-script.js'
          return '[name].js'
        },
      },
    },
  },
})
