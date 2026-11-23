import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    // WebKit on an emulated tablet exercises touch layouts, Web Audio and deep links.
    // The long viewport matrix already runs in the Chromium desktop profile.
    { name: 'ipad-webkit', testMatch: /(?:band-render|bandroom|learning-paths|listen|pro-notebook|home-studio)\.spec\.js$/, use: { ...devices['iPad (gen 7)'], browserName: 'webkit' } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: { command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort', url: 'http://127.0.0.1:4173', reuseExistingServer: false },
});
