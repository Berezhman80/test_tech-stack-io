import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.env'),
});

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'https://traineeautomation.azurewebsites.net',
    testIdAttribute: 'data-testid',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      testDir: './automation/test',
      testIgnore: '**/api/**',
      use: { ...devices['Desktop Chrome'], headless: false },
    },
    {
      name: 'api',
      testDir: './automation/test/api',
    },
    {
      name: 'mobile',
      testDir: './automation/test',
      testIgnore: '**/api/**',
      use: { ...devices['iPhone 13'], headless: false },
    },
    // {
    //   name: 'chrome',
    //   use: { channel: 'chrome', headless: false },
    // },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],
});
