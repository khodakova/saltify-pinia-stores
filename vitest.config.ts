import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      all: true,
      include: ['src'],
      exclude: [
        'node_modules',
        'src/index.ts',
        'src/**/__tests__/*',
      ],
      extension: ['.js', '.ts'],
      reporter: ['text', 'lcov', 'html'],
      provider: 'istanbul',
    },
    includeSource: ['src/**/*.{js,ts}'],
    reporters: ['default'],
    globals: true,
  },
})
