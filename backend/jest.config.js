module.exports = {
  testEnvironment: 'node',
  rootDir: './',
  moduleDirectories: ['node_modules', './'],
  moduleNameMapper: {
    '^../lib/(.*)$': '<rootDir>/backend/lib/$1'
  },
  testMatch: ['**/backend/test/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov']
};