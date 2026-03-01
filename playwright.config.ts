import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;
const baseURL =
  process.env.BASE_URL ||
  (isCI ? 'https://fansbookrebuild.byredstone.com' : 'http://localhost:5173');

export default defineConfig({
  testDir: './e2e',
  timeout: 45000,
  retries: 1,
  use: {
    baseURL,
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  ...(!process.env.BASE_URL && !isCI
    ? {
        webServer: {
          command: 'npm run dev --prefix apps/web',
          port: 5173,
          reuseExistingServer: true,
          timeout: 30000,
        },
      }
    : {}),
});
