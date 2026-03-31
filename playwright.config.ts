import { defineConfig, devices } from "@playwright/test";
import { API_BASE_URL, APP_BASE_URL } from "./playwright/support/config";

const configuredWorkers = Number(process.env.PLAYWRIGHT_WORKERS ?? "1");
const includeMobileProject = process.env.PLAYWRIGHT_INCLUDE_MOBILE === "true";

export default defineConfig({
  testDir: "./playwright/tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Tests share a single JSON-backed database, so serial execution is the safe default.
  workers: Number.isNaN(configuredWorkers) ? 1 : configuredWorkers,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [["list"], ["html", { open: "never" }]],
  outputDir: "./test-results/playwright",
  use: {
    baseURL: APP_BASE_URL,
    testIdAttribute: "data-test",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    ...(includeMobileProject
      ? [
        {
          name: "mobile-chromium",
          use: { ...devices["Pixel 5"] },
        },
      ]
      : []),
  ],
  webServer: [
    {
      command: "cross-env NODE_ENV=development yarn start:api",
      url: API_BASE_URL,
      reuseExistingServer: !process.env.CI,
      stdout: "pipe",
      stderr: "pipe",
      timeout: 120_000,
    },
    {
      command: "cross-env NODE_ENV=development yarn start:react",
      url: APP_BASE_URL,
      reuseExistingServer: !process.env.CI,
      stdout: "pipe",
      stderr: "pipe",
      timeout: 120_000,
    },
  ],
});
