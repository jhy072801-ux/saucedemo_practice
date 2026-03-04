// @reference: QA_GUIDELINES.md
// @section: [Section: Product Filter]
// 위 가이드라인의 셀렉터 규칙과 TC-07 ~ TC-10 로직을 준수하여 제품 필터링 Playwright 테스트 코드를 작성해줘. 
// 반복되는 로그인은 beforeEach에서 처리해줘.
// 각 ts마다 한글로 어떤 테스트 코드인지 주석도 달아줘야해

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventroyPage';

test.describe('Product Filter Tests', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.loginStandardUser();
    // 필터 드롭다운이 보일 때까지 대기 (Page Object 내의 속성 활용)
    await inventoryPage.productDropdown.waitFor({ state: 'visible' });
  });

  test('TC-07 (Sort A-Z) - 이름 오름차순 정렬', async () => {
    await inventoryPage.selectSortOption('az');
    const firstName = await inventoryPage.getFirstProductName();
    await expect(firstName).toHaveText('Sauce Labs Backpack');
  });

  test('TC-08 (Sort Z-A) - 이름 내림차순 정렬', async () => {
    await inventoryPage.selectSortOption('za');
    const firstName = await inventoryPage.getFirstProductName();
    await expect(firstName).toHaveText('Test.allTheThings() T-Shirt (Red)');
  });

  test('TC-09 (Price Low-High) - 가격 낮은순 정렬', async () => {
    await inventoryPage.selectSortOption('lohi');
    const firstPrice = await inventoryPage.getFirstProductPrice();
    await expect(firstPrice).toHaveText('$7.99');
  });

  test('TC-10 (Price High-Low) - 가격 높은순 정렬', async () => {
    await inventoryPage.selectSortOption('hilo');
    const firstPrice = await inventoryPage.getFirstProductPrice();
    await expect(firstPrice).toHaveText('$49.99');
  });
});
