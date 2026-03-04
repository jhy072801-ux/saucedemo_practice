// @reference: QA_GUIDELINES.md
// @section: [Section: Product Filter]
// 위 가이드라인의 셀렉터 규칙과 TC-01 ~ TC-04 로직을 준수하여 로그인 테스트 코드를 작성해줘
// Playwright 테스트 코드를 작성해줘. 
// 반복되는 로그인은 beforeEach에서 처리해줘.

import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LOGIN_ERRORS } from '../constants/messages';

// 로그인 헬퍼는 utils/auth.ts에서 가져와서 중복 제거

test.describe('Login Tests', () => {
  let loginPage : LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC-01 (Invalid Username) - 잘못된 사용자명 입력 시 오류 메시지 확인', async ({ page }) => {
    // 잘못된 사용자명으로 로그인 시도
    await loginPage.login('wrong_user', process.env.SAUCE_ACCESS_KEY ?? '');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(LOGIN_ERRORS.INVALID_MATCH);
  });

  test('TC-02 (Invalid Password) - 잘못된 비밀번호 입력 시 오류 메시지 확인', async ({ page }) => {
    // 잘못된 비밀번호로 로그인 시도
    await loginPage.login(process.env.SAUCE_USERNAME ?? '', 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(LOGIN_ERRORS.INVALID_MATCH);
  });

  test('TC-03 (Missing Inputs) - 입력값 없이 로그인 버튼 클릭 시 오류 메시지 확인', async ({ page }) => {
    // 사용자명과 비밀번호를 비운 상태에서 로그인 버튼 클릭
    await page.locator('[data-test="login-button"]').click();
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(LOGIN_ERRORS.USER_REQUIRED);
  });

  test('TC-04 (Login Success) - 정상적인 로그인 후 인벤토리 페이지로 이동 및 목록 확인', async ({ page }) => {
    // 올바른 자격 증명으로 로그인
    await loginPage.login(process.env.SAUCE_USERNAME ?? '', process.env.SAUCE_ACCESS_KEY ?? '');
    await expect(page).toHaveURL(/\/inventory\.html$/);
    const inventoryList = page.locator('.inventory_list');
    await expect(inventoryList).toBeVisible();
  });
});

