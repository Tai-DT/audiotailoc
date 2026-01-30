module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist', 'node_modules', 'coverage'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // Temporarily disable no-explicit-any - requires major refactor
    '@typescript-eslint/no-explicit-any': 'off',
    // Allow unused vars if prefixed with underscore
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_|^error$|^e$|^err$'
    }],
    '@typescript-eslint/no-empty-function': 'off',
    // Allow require() for dynamic/optional imports (e.g., @sentry/node, cron, etc.)
    '@typescript-eslint/no-require-imports': 'off',
    'prettier/prettier': ['error', {
      endOfLine: 'auto',
    }],
    // Allow console.log in development
    'no-console': 'off',
  },
};
