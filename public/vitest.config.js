import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',      // <--- ключевой момент!
    setupFiles: ['./vitest.setup.js'], // подключаем setup
    globals: true,              // удобно для expect и vi
  },
});
