module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.setup.js'],
  // opcional si quieres más matchers
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};
