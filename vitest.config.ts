import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './src/core'),
      '@tenant': path.resolve(__dirname, './src/tenant'),
    },
  },
});
