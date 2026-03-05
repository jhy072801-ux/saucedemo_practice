// @reference: QA_GUIDELINES.md
// @section: [Section: E2E Test]
// 위 가이드라인의 셀렉터 규칙과 TC-11, TC-16 ~ TC-18 로직을 준수하여 E2E 테스트 코드 작성
// 반복되는 로그인은 중복 제거
// 각 테스트마다 한글 주석으로 동작 설명

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventroyPage';
import { CheckoutPage } from '../pages/CheckoutPage';
// 페이지 객체(POM) 임포트
test.describe('E2E Checkout Tests (Full POM)', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    // 1. 모든 페이지 객체 초기화
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    checkoutPage = new CheckoutPage(page);
    // 2. 로그인 수행 (POM 내의 메서드 활용)
    loginPage.loginStandardUser();
  });

  /**
   * TC-15: 정상 주문 완료 케이스
   */
  test('TC-15 (Checkout Success) - 정상 정보 입력 후 주문 완료', async ({ page }) => {
    // 상품 추가 (InventoryPage)
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.addToCart('sauce-labs-bike-light');
    
    // 카트로 이동 (InventoryPage)
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/\/cart\.html$/);

    // 체크아웃 시작 (단순 클릭은 바로 수행)
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);

    // 정보 입력 및 완료 (CheckoutPage)
    await checkoutPage.fillInformation('John', 'Doe', '12345');
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);

    await checkoutPage.finishButton.click();

    // 결과 확인
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(page.locator('.complete-header')).toContainText('Thank you for your order!');
  });

  /**
   * TC-16a~d: 필수 정보 미입력 에러 검증 (통합형)
   */
  test('TC-16 (Validation) - 필수 정보 누락 시 에러 메시지 확인', async ({ page }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await page.locator('[data-test="checkout"]').click();

    // First Name 누락 케이스만 대표로 확인
    await checkoutPage.fillInformation('', 'Doe', '12345');
    
    await expect(checkoutPage.errorMsg).toBeVisible();
    await expect(checkoutPage.errorMsg).toContainText('First Name is required');
  });

  /**
   * TC-17: 주문 취소 프로세스
   */
  test('TC-17 (Cancel) - 정보 입력 후 취소 시 인벤토리 페이지로 복귀', async ({ page }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await page.locator('[data-test="checkout"]').click();

    await checkoutPage.fillInformation('John', 'Doe', '12345');
    
    // 취소 버튼 클릭 (CheckoutPage)
    await checkoutPage.cancelButton.click();

    // 메인 페이지 복귀 확인
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  /**
   * TC-18: 주문 완료 후 메인 복귀 및 카트 초기화 확인
   */
  test('TC-18 (Complete & Reset) - 주문 완료 후 홈으로 이동 시 카트 비워짐 확인', async ({ page }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await page.locator('[data-test="checkout"]').click();

    await checkoutPage.fillInformation('Jane', 'Smith', '54321');
    await checkoutPage.finishButton.click();
    
    // Back Home 버튼 클릭 (CheckoutPage)
    await checkoutPage.backHomeButton.click();

    // 메인 페이지 복귀 및 카트 아이콘 숫자(Badge)가 사라졌는지 확인
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });
});
