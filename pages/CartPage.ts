import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly continueShoppingBtn: Locator;
  readonly cartItemLabels: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.continueShoppingBtn = page.locator('[data-test="continue-shopping"]');
    this.cartItemLabels = page.locator('.cart_item_label');
  }

  /**
   * 장바구니에서 특정 상품 제거
   */
  async removeItem(productName: string) {
    await this.page.locator(`[data-test="remove-${productName}"]`).click();
  }

  /**
   * 'Continue Shopping' 버튼 클릭
   */
  async continueShopping() {
    await this.continueShoppingBtn.click();
  }
}