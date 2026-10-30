import type { Config } from 'jest';
import { createCjsPreset } from 'jest-preset-angular/presets/index.js';

export default {
  ...createCjsPreset(),
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$|@angular/common/locales/.*\\.js$|@angular-architects|@bancolombia/(?!design-system-behaviors)|@svn|uuid|@ngneat/falso|jspdf|jspdf-autotable|file-saver|fflate|fast-png|@babel/runtime)',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/acceptancetest/'],
  coveragePathIgnorePatterns: ['.routes.ts'],
  reporters: ['default', ['jest-junit', { outputDirectory: 'test-results', outputName: 'junit.xml' }]],
} satisfies Config;
