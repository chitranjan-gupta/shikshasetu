import { resolve } from 'path'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// Resolve root path
const root = resolve(__dirname, 'src')
const CHROME_ENV = process.env.CHROME_ENV;
const isChrome = CHROME_ENV ? CHROME_ENV.toLowerCase() === "true" : undefined;
const name = typeof isChrome !== "undefined" ? isChrome ? '-chrome' : '-firefox' : '';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: `src/manifest${name}.json`,
          dest: '.', // Copy manifest to the root of the build folder
          rename: 'manifest.json'
        },
        {
          src: 'src/assets/icons/icon16.png',
          dest: './assets/icons/', // Copy manifest to the root of the build folder
        },
        {
          src: 'src/assets/icons/icon32.png',
          dest: './assets/icons/', // Copy manifest to the root of the build folder
        },
        {
          src: 'src/assets/icons/icon48.png',
          dest: './assets/icons/', // Copy manifest to the root of the build folder
        },
        {
          src: 'src/assets/icons/icon128.png',
          dest: './assets/icons/', // Copy manifest to the root of the build folder
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': root, // Alias for 'src' directory
    },
  },
  build: {
    outDir: 'build', // Output directory
    emptyOutDir: true, // Clean output directory before build
    rollupOptions: {
      input: {
        index: resolve('./index.html'),
        popup: resolve(root, 'popup', 'index.html'), // Entry point for popup (index.html)
        option: resolve(root, 'option', 'index.html'), // Entry point for option (index.html)
        sidepanel: resolve(root, 'sidepanel', 'index.html'), // Entry point for sidepanel (index.html)
      },
    },
  },
});
