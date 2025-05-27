/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'], // Ensure it matches your test file naming convention
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Use ts-jest to transform TypeScript files
  },
};