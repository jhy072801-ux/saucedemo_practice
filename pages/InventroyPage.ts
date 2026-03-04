import { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly productDropdown: Locator;
  readonly inventoryItemNames: Locator;
  readonly inventoryItemPrices: Locator;
  // 추가된 요소
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productDropdown = page.getByRole('combobox');
    this.inventoryItemNames = page.locator('.inventory_item_name');
    this.inventoryItemPrices = page.locator('.inventory_item_price');
    // 장바구니 관련 로케이터
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  /**
   * 정렬 필터 변경
   */
  async selectSortOption(optionValue: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.productDropdown.selectOption(optionValue);
  }

  /**
   * 특정 상품을 장바구니에 추가
   * @param productName - 'sauce-labs-backpack' 같은 data-test ID의 뒷부분
   */
  async addToCart(productName: string) {
    await this.page.locator(`[data-test="add-to-cart-${productName}"]`).click();
  }

  /**
   * 장바구니 아이콘 클릭하여 카트 페이지로 이동
   */
  async goToCart() {
    await this.cartLink.click();
  }

  async getFirstProductName() {
    return this.inventoryItemNames.first();
  }

  async getFirstProductPrice() {
    return this.inventoryItemPrices.first();
  }
}