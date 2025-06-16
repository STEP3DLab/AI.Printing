import { defineConfig } from 'vite';

export default defineConfig({
  base: '/ai-printing/',
  root: 'src',
  build: {
    outDir: '../dist'
  },
  test: {
    environment: 'jsdom'
  }
});
