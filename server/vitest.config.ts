import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@buttercup/shared': new URL('../shared/src', import.meta.url).pathname,
    },
  },
});
