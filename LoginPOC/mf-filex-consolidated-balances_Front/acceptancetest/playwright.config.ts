import { PlaywrightTestConfig } from '@playwright/test';

const playwrightConfig: PlaywrightTestConfig = {
  testMatch: 'acceptancetest/**/*.spec.ts',
  reporter: [
    ['list'],
    ['junit', { outputFile: 'reports/results.xml' }],
    ['json', { outputFile: 'reports/jsonReport/results.json' }],
    ["html", { outputFolder: "reports/htmlReport", open: "never" }],
  ],
  timeout: 150000,
  retries: 1,
  projects: [
    {
      name: 'Chrome',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        viewport: null,
        launchOptions: {
          args: ['--window-size=1920,1080','--start-maximized'],
        },
      },
    },
  ],
  use: {
    baseURL: '#{svnUrlAccep}#',
    screenshot: 'only-on-failure',
    video: 'retry-with-video',
  },
};

export default playwrightConfig;
