// @reference: QA_GUIDELINES.md
// @section: [Section: Cart Management]
// 위 가이드라인의 셀렉터 규칙과 TC-12 ~ TC-15 로직을 준수하여 장바구니 관리 테스트 Playwright 테스트 코드를 작성해줘. 
// 반복되는 로그인은 beforeEach에서 처리해줘.
// 각 ts마다 한글로 어떤 테스트 코드인지 주석도 달아줘야해

import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { InventoryPage } from '../pages/InventroyPage';
import { LoginPage } from '../pages/LoginPage';

test.describe('Cart Management Tests', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    
    await loginPage.loginStandardUser();
  });

  test('TC-11 (Add to Cart) - 제품 추가 후 카트 배지 증가 확인', async () => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    
    await expect(inventoryPage.cartBadge).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('TC-12 (View Cart) - 카트 페이지 이동 및 상품 확인', async ({ page }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.addToCart('sauce-labs-bike-light');
    
    await inventoryPage.goToCart();
    
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cartPage.cartItems).toHaveCount(2);
    // 특정 상품 텍스트 포함 여부 확인
    await expect(page.locator('.cart_item_label')).toContainText(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
  });

  test('TC-13 (Continue Shopping) - 메인페이지로 복귀 확인', async ({ page }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    
    await cartPage.continueShopping();
    
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('TC-14 (Remove from Cart) - 제품 제거 및 배지 업데이트 확인', async ({ page }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.addToCart('sauce-labs-bike-light');
    await inventoryPage.goToCart();

    // 첫 번째 아이템 제거
    await cartPage.removeItem('sauce-labs-backpack');
    
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.cartItemLabels).toContainText('Sauce Labs Bike Light');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});