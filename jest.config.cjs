module.exports = {
  preset: 'jest-expo',
  cacheDirectory: '<rootDir>/node_modules/.cache/jest',
  testMatch: ['**/__tests__/**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: ['src/screens/**/*.tsx'],
};
