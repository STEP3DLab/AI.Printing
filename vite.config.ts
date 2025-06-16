import { defineConfig } from 'vite';

export default defineConfig({
  base: '/AI.Printing/',
  root: 'src',
  build: {
    outDir: '../dist'
  },
  test: {
    environment: 'jsdom',
    include: ['../tests/**/*.{test,spec}.ts']
  }
});
