import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  verbose: false,
  clearMocks: true,
  coverageDirectory: 'coverage',
  cache: false,
  maxWorkers: '50%',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/4-framework/**/*.ts',
    '!src/2-business/dto/**/*.ts',
    '!src/2-business/useCases/*.ts',
    '!src/3-controller/operations/*.ts',
    '!src/3-controller/serializers/*.ts',
    '!src/shared/*',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/2-business/module/',
    '<rootDir>/src/2-business/query/',
    '<rootDir>/src/util/',
    '[.]d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  testEnvironment: 'node',
  coverageProvider: 'babel',
  rootDir: './',
  testMatch: ['**/tests/**/*.(spec|test).[jt]s'],
  setupFiles: ['./jest-setup-file.ts'],
  moduleNameMapper: {
    '@domain/(.*)': '<rootDir>/src/1-domain/$1',
    '@business/(.*)': '<rootDir>/src/2-business/$1',
    '@controller/(.*)': '<rootDir>/src/3-controller/$1',
    '@framework/(.*)': '<rootDir>/src/4-framework/$1',
    '@shared/(.*)': '<rootDir>/src/shared/$1',
    '@tests/(.*)': '<rootDir>/tests/$1',
    '@root/(.*)': '<rootDir>/$1',
  },
}

export default config
