/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "test-config",
    "interfaces",
    "jestGlobalMocks.ts",
    ".module.ts",
    "<rootDir>/src/app/main.ts",
    ".mock.ts",
  ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^app/(.+)$': '<rootDir>/src/app/$1',
    '^components/(.+)$': '<rootDir>/src/app/components/$1',
    '^services/(.+)$': '<rootDir>/src/app/services/$1',
    '^models/(.+)$': '<rootDir>/src/app/models/$1',
    '^modules/(.+)$': '<rootDir>/src/app/modules/$1',
    '^utilities/(.+)$': '<rootDir>/src/app/utilities/$1',
    '^classes/(.+)$': '<rootDir>/src/app/classes/$1',
    '^pipes/(.+)$': '<rootDir>/src/app/pipes/$1',
    '^text-content/(.+)$': '<rootDir>/src/app/text-content/$1',
    '^assets/(.+)$': '<rootDir>/src/assets/$1',
    '^environments/(.+)$': '<rootDir>/src/environments/$1',
  },
};

export default config;
