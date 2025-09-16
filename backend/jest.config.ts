import type { Config } from 'jest';

const config: Config = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',

  // Timeout Configurations
  testTimeout: 30000, // 30 seconds for general tests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Test-specific timeouts
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/src/**/*.test.ts',
  ],

  // Performance and timeout settings
  maxWorkers: '50%', // Use 50% of available cores
  detectOpenHandles: true,
  forceExit: true,

  // Coverage settings
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
