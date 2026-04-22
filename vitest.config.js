import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    projects: [
      {
        test: {
          include: ['tests/api/**/*.test.js'],
          setupFiles: ['./tests/global.setup.js'],
          name: 'api',
        },
      },
      {
        test: {
          globals: true,
          include: ['tests/models/**/*.test.js'],
          setupFiles: ['./tests/global.setup.js'],
          name: 'models',
        },
      },

      {
        test: {
          globals: true,
          include: ['src/**/*.test.js'],
          setupFiles: ['./tests/global.setup.js'],
          name: 'utils',
        },
      },
    ],
  },
});
