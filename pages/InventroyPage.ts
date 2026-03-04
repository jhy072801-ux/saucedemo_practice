import { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly productDropdown: Locator;
  readonly inventoryItemNames: Locator;
  readonly inventoryItemPrices: Locator;

  constructor(page : Page){
    this.page = page;
    this.productDropdown = page.getByRole('combobox');
    this.inventoryItemNames = page.locator('.inventory_item_name');
    this.inventoryItemPrices = page.locator('.inventory_item_price');
  }

  // 필터 변경 메서드
  async selectSortOption(optionValue: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.productDropdown.selectOption(optionValue);
  }

  // 첫 번째 상품 이름 가져오기
  async getFirstProductName() {
    return this.inventoryItemNames.first();
  }

  // 첫 번째 상품 가격 가져오기
  async getFirstProductPrice() {
    return this.inventoryItemPrices.first();
  }
}