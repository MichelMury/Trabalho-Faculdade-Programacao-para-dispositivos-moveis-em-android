module.exports = {
  preset: 'jest-expo',
  cacheDirectory: '<rootDir>/node_modules/.cache/jest',
  testTimeout: 15000,
  testMatch: ['**/__tests__/**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: ['src/screens/**/*.tsx', 'src/auth/**/*.ts', 'src/AuthApp.tsx'],
};
