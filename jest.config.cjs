module.exports = {
  preset: 'jest-expo',
  cacheDirectory: '<rootDir>/node_modules/.cache/jest',
  testMatch: ['**/__tests__/**/*.test.tsx'],
  testTimeout: 15000,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: ['src/screens/**/*.tsx'],
  transformIgnorePatterns: ['node_modules/(?!\\.pnpm/|react-native/|@react-native/|@react-native-community/|expo[^/]*/|@expo/|react-native-[^/]*/|@noble/)'],
};
