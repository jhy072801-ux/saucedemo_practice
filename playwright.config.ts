import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://www.saucedemo.com/',
    headless: true,
    launchOptions: {
      slowMo: 100,
    },
  },
});