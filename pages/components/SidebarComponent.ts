import { Page, Locator } from '@playwright/test';

export class SidebarComponent {
  readonly page: Page;
  readonly burgerMenuButton: Locator;
  readonly closeButton: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.burgerMenuButton = page.locator('.bm-burger-button');
    this.closeButton = page.locator('#react-burger-cross-btn');
    this.allItemsLink = page.getByText('All Items');
    this.aboutLink = page.locator('.bm-menu a').filter({ hasText: 'About' });
    this.logoutLink = page.getByText('Logout');
    this.resetAppStateLink = page.getByText('Reset App State');
  }

  /**
   * 사이드바 열기
   */
  async open() {
    await this.burgerMenuButton.click();
    // 메뉴가 보일 때까지 대기 (애니메이션 등 고려)
    await this.allItemsLink.waitFor({ state: 'visible' });
  }

  /**
   * 사이드바 닫기
   */
  async close() {
    await this.closeButton.click();
  }

  /**
   * All Items 메뉴 클릭
   */
  async goToAllItems() {
    await this.open();
    await this.allItemsLink.click();
  }

  /**
   * About 메뉴 클릭
   */
  async goToAbout() {
    await this.open();
    await this.aboutLink.click();
  }

  /**
   * 로그아웃 실행
   */
  async logout() {
    await this.open();
    await this.logoutLink.click();
  }

  /**
   * 앱 상태 초기화 (장바구니 비우기 등)
   */
  async resetAppState() {
    await this.open();
    await this.resetAppStateLink.click();
  }
}