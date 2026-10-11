import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/browser",
  workers: 1,
  timeout: 60000,
  use: {
    baseURL: "http://127.0.0.1:8788",
    headless: true,
    launchOptions: { channel: "msedge" },
  },
  webServer: {
    command: "node scripts/dev.mjs",
    url: "http://127.0.0.1:8788/api/portfolio",
    reuseExistingServer: false,
    env: { CMS_TEST_FRESH: "1" },
    timeout: 60000,
  },
  reporter: "list",
});
