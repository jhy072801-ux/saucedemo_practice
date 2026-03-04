import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config(); // dotenv로 .env 파일에서 환경 변수 로드 config 파일에서만 해주면 됨

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    launchOptions: {
      slowMo: 100,
    },
  },
});