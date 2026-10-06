import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:3100";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: [
    {
      command: "node e2e/youtube-mock-server.mjs",
      url: "http://127.0.0.1:3101/health",
      name: "YouTube API fixture",
      reuseExistingServer: !process.env.CI,
      timeout: 10_000,
    },
    {
      command: "pnpm exec next dev --hostname 127.0.0.1 --port 3100",
      url: baseURL,
      name: "Next.js E2E",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        NEXT_TELEMETRY_DISABLED: "1",
        NEXT_DIST_DIR: ".next-e2e",
        NEXT_PUBLIC_WORDPRESS_API_URL: "",
        YOUTUBE_API_KEY: "playwright-test-key",
        YOUTUBE_API_BASE: "http://127.0.0.1:3101/youtube/v3",
        NEXT_PUBLIC_SITE_URL: baseURL,
      },
    },
  ],
});
