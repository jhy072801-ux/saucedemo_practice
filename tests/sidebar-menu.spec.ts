// @reference: QA_GUIDELINES.md
// @section: [Section: Product Filter]
// 위 가이드라인의 셀렉터 규칙과 TC-05 ~ TC-06 로직을 준수하여 사이드바 메뉴 Playwright 테스트 코드를 작성해줘. 
// 반복되는 로그인은 beforeEach에서 처리해줘.
// 각 ts마다 한글로 어떤 테스트 코드인지 주석도 달아줘야해

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SidebarComponent } from '../pages/components/SidebarComponent';

test.describe('Sidebar Menu Tests', () => {
  let sidebar: SidebarComponent;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    sidebar = new SidebarComponent(page);
    
    await loginPage.loginStandardUser();
  });

  test('TC-05a (All Items) - 인벤토리 페이지 유지 확인', async ({ page }) => {
    await sidebar.goToAllItems();
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test('TC-05b (About) - 외부 링크 주소 확인', async ({ page }) => {
    // 1. 클릭 전 속성 검증 (Locator 노출 활용)
    await sidebar.open();
    // 앞에 오는 href 속성이 뒤에 오는 url이 맞는지 확인
    await expect(sidebar.aboutLink).toHaveAttribute('href', 'https://saucelabs.com/');
    
    // 2. 실제 이동 확인
    await sidebar.aboutLink.click(); 
    await expect(page).toHaveURL('https://saucelabs.com/');
  });

  test('TC-05c (Reset App State) - 카트 초기화 확인', async ({ page }) => {
    // 아이템 추가
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // 리셋 실행
    await sidebar.resetAppState();
    
    // 검증
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('TC-06 (Logout) - 로그아웃 후 리다이렉트 확인', async ({ page }) => {
    await sidebar.logout();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});


