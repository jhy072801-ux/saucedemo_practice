// 공통으로 사용하는 로그인 함수
import { Page } from '@playwright/test';

export async function login(page: Page, username: string, password: string) {
  await page.fill('#user-name', username);
  await page.fill('#password', password);
  await page.click('#login-button');
}