import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://www.saucedemo.com/',
    headless: false,
    launchOptions: {
      slowMo: 300,
    },
  },
});