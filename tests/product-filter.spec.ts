// @reference: QA_GUIDELINES.md
// @section: [Section: Product Filter]
// 위 가이드라인의 셀렉터 규칙과 TC-07 ~ TC-10 로직을 준수하여 제품 필터링 Playwright 테스트 코드를 작성해줘. 
// 반복되는 로그인은 utils/auth.ts에 있는 코드를 활용해서 중복을 줄여주고 beforeEach에서 처리해줘.
// 각 ts마다 한글로 어떤 테스트 코드인지 주석도 달아줘야해

import { test, expect, Page } from '@playwright/test';
import { login } from './utils/auth';

// 필터 드롭다운 관련 테스트

test.describe('Product Filter Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 매 테스트마다 로그인 상태로 시작
    await page.goto('/');
    await login(page, 'standard_user', 'secret_sauce');
    // 인벤토리 페이지로 리디렉션될 때까지 대기
    await expect(page).toHaveURL(/\/inventory\.html$/);
    // 필터 드롭다운(콤보박스) 나타날 때까지 기다리기
    await page.getByRole('combobox').waitFor({ state: 'visible' });
  });

  test('TC-07 (Sort A-Z) - 이름 오름차순 정렬, 첫 항목 확인', async ({ page }) => {
    // 필터를 A-Z로 선택
    await page.getByRole('combobox').selectOption('az');
    // 첫 번째 제품 이름 검사
    const firstName = page.locator('.inventory_item_name').first();
    await expect(firstName).toHaveText('Sauce Labs Backpack');
  });

  test('TC-08 (Sort Z-A) - 이름 내림차순 정렬, 첫 항목 확인', async ({ page }) => {
    await page.getByRole('combobox').selectOption('za');
    const firstName = page.locator('.inventory_item_name').first();
    await expect(firstName).toHaveText('Test.allTheThings() T-Shirt (Red)');
  });

  test('TC-09 (Price Low-High) - 가격 낮은순 정렬, 첫 항목 가격 확인', async ({ page }) => {
    await page.getByRole('combobox').selectOption('lohi');
    const firstPrice = page.locator('.inventory_item_price').first();
    await expect(firstPrice).toHaveText('$7.99');
  });

  test('TC-10 (Price High-Low) - 가격 높은순 정렬, 첫 항목 가격 확인', async ({ page }) => {
    await page.getByRole('combobox').selectOption('hilo');
    const firstPrice = page.locator('.inventory_item_price').first();
    await expect(firstPrice).toHaveText('$49.99');
  });
});

