import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

const jestWatchIgnorePatterns = [
  '/node_modules/',
  '/\\.next/',
  '/out/',
  '/build/',
  '/dist/',
  '/coverage/',
  '/playwright-report/',
  '/test-results/',
];

// Add any custom config to be passed to Jest
const customJestConfig: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  watchman: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: [
    ...jestWatchIgnorePatterns,
    '/tests/', // Playwright tests
  ],
  modulePathIgnorePatterns: [
    ...jestWatchIgnorePatterns,
  ],
  watchPathIgnorePatterns: [
    ...jestWatchIgnorePatterns,
  ],
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
