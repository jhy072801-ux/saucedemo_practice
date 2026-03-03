// @reference: QA_GUIDELINES.md
// @section: [Section: Product Filter]
// 위 가이드라인의 셀렉터 규칙과 TC-05 ~ TC-06 로직을 준수하여 사이드바 메뉴 Playwright 테스트 코드를 작성해줘. 
// 반복되는 로그인은 utils/auth.ts에 있는 코드를 활용해서 중복을 줄여주고 beforeEach에서 처리해줘.
// 각 ts마다 한글로 어떤 테스트 코드인지 주석도 달아줘야해

import { test, expect, Page } from '@playwright/test';
import { login } from './utils/auth';

// 사이드바 메뉴 관련 테스트

test.describe('Sidebar Menu Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 사이트에 접속 후 로그인
    await page.goto('/');
    await login(page, 'standard_user', 'secret_sauce');
  });

  // TC-05a: 'All Items' 메뉴 클릭 시 인벤토리 페이지로 유지되는지 확인
  test('TC-05a (All Items) - All Items 클릭 동작 확인', async ({ page }) => {
    await page.locator('.bm-burger-button').click();
    await page.getByText('All Items').click();
    // 현재 페이지가 인벤토리여야 한다.
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  // TC-05b: 'About' 메뉴 링크가 올바른 URL을 가리키는지 확인
  test('TC-05b (About) - About 링크 주소 확인', async ({ page }) => {
    await page.locator('.bm-burger-button').click();
    const aboutLink = page.locator('.bm-menu a').filter({ hasText: 'About' });
    await expect(aboutLink).toHaveAttribute('href', 'https://saucelabs.com/');
    // 선택적으로 클릭하여 리다이렉트 확인 (새 창이 안 뜰 수 있음)
    await aboutLink.click();
    await expect(page).toHaveURL('https://saucelabs.com/');
  });

  // TC-05c: 'Reset App State' 클릭 시 상태 초기화 (아이템 추가 후 장바구니 비어짐)
  test('TC-05c (Reset App State) - 앱 상태 초기화 확인', async ({ page }) => {
    // 먼저 한 개 아이템을 장바구니에 추가
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.locator('.bm-burger-button').click();
    await page.getByText('Reset App State').click();
    // 캔버스 초기화 후 카트 뱃지가 없어야 함
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('TC-06 (Logout) - 로그아웃 후 로그인 페이지로 돌아가는지 확인', async ({ page }) => {
    // 사이드바 열고 로그아웃 클릭
    await page.locator('.bm-burger-button').click();
    await page.getByText('Logout').click();

    // 로그인 페이지로 돌아와야 하고, 세션이 초기화된 상태여야 함
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});


