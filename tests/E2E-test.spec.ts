// @reference: QA_GUIDELINES.md
// @section: [Section: E2E Test]
// 위 가이드라인의 셀렉터 규칙과 TC-11, TC-16 ~ TC-18 로직을 준수하여 E2E 테스트 코드 작성
// 반복되는 로그인은 beforeEach에서 처리하여 중복 제거
// 각 테스트마다 한글 주석으로 동작 설명

import { test, expect } from '@playwright/test';
import { login } from './utils/auth';

test.describe('E2E Checkout Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 매 테스트마다 로그인 상태로 시작
    await page.goto('/');
    await login(page, 'standard_user', 'secret_sauce');
    // 인벤토리 페이지로 리디렉션될 때까지 대기
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test('TC-11 (Checkout with Valid Info) - 정상 정보 입력 후 주문 완료', async ({ page }) => {
    // 제품 2개 추가
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // 카트로 이동
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    
    // Checkout 버튼 클릭
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    
    // 개인정보 입력 (정상 데이터)
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Continue 버튼 클릭
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    
    // Finish 버튼 클릭하여 주문 완료
    await page.locator('[data-test="finish"]').click();
    
    // 주문 완료 페이지 확인
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(page.locator('.complete-header')).toContainText('Thank you for your order!');
  });

  test('TC-16a (Checkout with Invalid/Missing Info) - First Name 미입력 시 에러', async ({ page }) => {
    // 제품 추가
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // 카트로 이동
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    
    // First Name만 공란으로 두고 다른 필드 입력
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Continue 클릭
    await page.locator('[data-test="continue"]').click();
    
    // 에러 메시지 확인
    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('First Name is required');
  });

  test('TC-16b (Checkout with Invalid/Missing Info) - Last Name 미입력 시 에러', async ({ page }) => {
    // 제품 추가
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // 체크아웃 페이지 이동
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    
    // First Name, Postal Code만 입력 (Last Name 공란)
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Continue 클릭
    await page.locator('[data-test="continue"]').click();
    
    // 에러 메시지 확인
    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Last Name is required');
  });

  test('TC-16c (Checkout with Invalid/Missing Info) - Postal Code 미입력 시 에러', async ({ page }) => {
    // 제품 추가
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // 체크아웃 페이지 이동
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    
    // First Name, Last Name만 입력 (Postal Code 공란)
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    
    // Continue 클릭
    await page.locator('[data-test="continue"]').click();
    
    // 에러 메시지 확인
    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Postal Code is required');
  });

  test('TC-16d (Checkout with Invalid/Missing Info) - 모든 필드 미입력 시 에러', async ({ page }) => {
    // 제품 추가
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // 체크아웃 페이지 이동
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    
    // 모든 필드 공란으로 두고 Continue 클릭
    await page.locator('[data-test="continue"]').click();
    
    // 에러 메시지 확인 (First Name 에러가 먼저 뜰 것으로 예상)
    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('First Name is required');
  });

  test('TC-17 (Cancel Checkout) - Cancel 버튼 클릭 후 메인페이지 복귀', async ({ page }) => {
    // 제품 추가
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // 카트로 이동
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    
    // Checkout 클릭
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    
    // 개인정보 입력
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Continue 클릭하여 step-two로 이동
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    
    // Cancel 버튼 클릭
    await page.locator('[data-test="cancel"]').click();
    
    // 메인 인벤토리 페이지로 복귀 확인
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('TC-18 (Complete Checkout & Back Home) - 주문 완료 후 Back Home 클릭으로 메인페이지 복귀', async ({ page }) => {
    // 제품 2개 추가
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // 카트로 이동
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    
    // 체크아웃 시작
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    
    // 개인정보 입력
    await page.locator('[data-test="firstName"]').fill('Jane');
    await page.locator('[data-test="lastName"]').fill('Smith');
    await page.locator('[data-test="postalCode"]').fill('54321');
    
    // Continue
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    
    // Finish로 주문 완료
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    
    // Back Home 버튼 클릭
    await page.locator('[data-test="back-to-products"]').click();
    
    // 메인 인벤토리 페이지로 복귀 확인
    await expect(page).toHaveURL(/\/inventory\.html$/);
    // 카트 배지가 없어야 함 (주문 완료로 카트 비어짐)
    const badge = page.locator('.shopping_cart_badge');
    await expect(badge).toHaveCount(0);
  });
});
