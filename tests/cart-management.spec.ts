// @reference: QA_GUIDELINES.md
// @section: [Section: Cart Management]
// 위 가이드라인의 셀렉터 규칙과 TC-12 ~ TC-15 로직을 준수하여 장바구니 관리 테스트 Playwright 테스트 코드를 작성해줘. 
// 반복되는 로그인은 utils/auth.ts에 있는 코드를 활용해서 중복을 줄여주고 beforeEach에서 처리해줘.
// 각 ts마다 한글로 어떤 테스트 코드인지 주석도 달아줘야해

import { test, expect, Page } from '@playwright/test';
import { login } from './utils/auth';

// 장바구니 관리 관련 테스트

test.describe('Cart Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 매 테스트마다 로그인 상태로 시작
    await page.goto('/');
    await login(page, 'standard_user', 'secret_sauce');
    // 인벤토리 페이지로 리디렉션될 때까지 대기
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test('TC-12 (Add to Cart) - 제품 추가 후 카트 배지 증가 확인', async ({ page }) => {
    // 첫 번째 제품 카트 추가
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    // 카트 배지 확인 - 1로 표시되어야 함
    const badge = page.locator('.shopping_cart_badge');
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText('1');
  });

  test('TC-13 (View Cart) - 카트 페이지 이동 및 상품 확인', async ({ page }) => {
    // 두 개의 제품 카트에 추가
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    // 장바구니 아이콘 클릭하여 카트 페이지로 이동
    await page.locator('.shopping_cart_link').click();
    // 카트 페이지 확인
    await expect(page).toHaveURL(/\/cart\.html$/);
    // 카트에 2개 아이템이 있는지 확인
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);
    // 추가한 상품이 제대로 들어왔는지 확인 (filter를 사용해 특정 상품 검색)
    await expect(page.locator('.cart_item_label').filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
  });

  test('TC-14 (Continue Shopping) - 메인페이지로 복귀 확인', async ({ page }) => {
    // 제품 추가
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    // 카트로 이동
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    // Continue Shopping 버튼 클릭하여 메인페이지로 돌아가기
    await page.locator('[data-test="continue-shopping"]').click();
    // 메인 인벤토리 페이지로 돌아온 것 확인
    await expect(page).toHaveURL(/\/inventory\.html$/);
    // 제품 목록이 보여야 함
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('TC-15 (Remove from Cart) - 제품 제거 및 배지 업데이트 확인', async ({ page }) => {
    // 두 개의 제품 추가
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    // 배지가 2를 표시하는지 확인
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    // 카트로 이동
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    // 첫 번째 아이템 제거 버튼 클릭
    await page.locator('[data-test=\"remove-sauce-labs-backpack\"]').click();
    // 제거 후 아이템이 1개만 남았는지 확인
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(1);
    // 제거된 제품이 보이지 않는지 확인
    await expect(page.locator('.cart_item_label')).not.toContainText('Sauce Labs Backpack');
    // 남은 제품만 보이는지 확인
    await expect(page.locator('.cart_item_label')).toContainText('Sauce Labs Bike Light');
    // 배지가 1로 업데이트되었는지 확인
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });
});