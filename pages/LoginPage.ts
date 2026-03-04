import { Locator, Page } from "playwright/test";

export class LoginPage {
  readonly page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto(){
    await this.page.goto('/');
  }

  async login(username: string, password: string){
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // 이동부터 로그인 완료까지 한 번에 하는 기능
  async loginStandardUser(){
    await this.goto();
    await this.login(process.env.SAUCE_USERNAME ?? '', process.env.SAUCE_ACCESS_KEY ?? '');
    await this.page.waitForURL(/\/inventory\.html$/);
  }
}