import { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly backHomeButton: Locator;
  readonly errorMsg: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.errorMsg = page.locator('[data-test="error"]');
  }

  /**
   * 개인정보 입력 (미입력 케이스 대응을 위해 값이 있을 때만 fill)
   */
  async fillInformation(fName: string, lName: string, zip: string) {
    if (fName) await this.firstNameInput.fill(fName);
    if (lName) await this.lastNameInput.fill(lName);
    if (zip) await this.postalCodeInput.fill(zip);
    await this.continueButton.click();
  }
}