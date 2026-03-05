# 제미나이로 작성한 프롬프트 가이드라인
# 📄 QA_GUIDELINES.md

## 1. Project Context
- **Target Site:** [Sauce Demo (Swag Labs)](https://www.saucedemo.com/)
- **Framework:** Playwright (TypeScript)
- **Base URL:** `https://www.saucedemo.com/`
- **Navigation Rule:** - `playwright.config.ts`에 정의된 `baseURL` 설정을 반드시 활용할 것.
    - 테스트 코드 내 `page.goto()` 호출 시에는 절대 경로 대신 상대 경로(`/`)를 사용할 것. (예: `await page.goto('/');`)
- **Browser:** Chrome (Default)

## 2. Selector Strategy (Priority)
1. **Primary:** `page.locator('[data-test="..."]')` — Use if element has `data-test` attribute
2. **Secondary:** `page.getByRole()`, `page.getByText()`, `page.getByPlaceholder()` — Use when `data-test` is unavailable
3. **Fallback:** CSS classes (e.g., `.inventory_item_name`) as last resort
4. **Avoid:** Deep CSS selectors (e.g., `div > div > button`) or XPath unless absolutely necessary.

## 3. Coding Standards & Structure
- **File Naming:** Function-based separation (e.g., `auth.spec.ts`, `filter.spec.ts`).
- **Isolation:** Use `beforeEach` for common actions (like `page.goto('/')` or login).
- **Assertions:** Use web-first assertions: `expect(locator).toBeVisible()`, `expect(page).toHaveURL()`.
- **Traceability:** Every test must start with a comment header including the `@TestCase` ID.

---

## 4. Test Case Mapping (Reference for Copilot)

### [Section: Auth & Login]
- **TC-01 (Invalid Username):** - Steps: Input `invalid_user` / `secret_sauce` -> Click Login
  - Assert: Error message text contains `Username and password do not match`
- **TC-02 (Invalid Password):** - Steps: Input `standard_user` / `wrong_password` -> Click Login
  - Assert: Error message text contains `Username and password do not match`
- **TC-03 (Missing Inputs):** - Steps: Keep Username/Password empty -> Click Login
  - Assert: Error message text contains `Username is required`
- **TC-04 (Login Success):** - Steps: Input `standard_user` / `secret_sauce` -> Click Login
  - Assert: Redirected to `/inventory.html` and products list is visible.
- **TC-06 (Logout):** - Steps: Burger Menu -> Click Logout
  - Assert: Redirected to login page (`/`) and session cleared.

### [Section: Global Navigation]
- **TC-05 (Sidebar Menu Check):** - Steps: Click `.bm-burger-button`
  - Assert: 'All Items', 'About', 'Logout', 'Reset App State' are all visible.
  - Assert: 'About' menu link equals `https://saucelabs.com/`.

### [Section: Product Filter]
- **TC-07 (Sort A-Z):** Select `az` -> Assert first item is `Sauce Labs Backpack`.
  - Selector: `page.getByRole('combobox')` (filter dropdown)
- **TC-08 (Sort Z-A):** Select `za` -> Assert first item is `Test.allTheThings() T-Shirt (Red)`.
  - Selector: `page.getByRole('combobox')`
- **TC-09 (Price Low-High):** Select `lohi` -> Assert first item price is `$7.99`.
  - Selector: `page.getByRole('combobox')`
- **TC-10 (Price High-Low):** Select `hilo` -> Assert first item price is `$49.99`.
  - Selector: `page.getByRole('combobox')`

### [Section: Cart Management]
- **TC-11 (Add to Cart):** - Steps: Click "Add to cart" button on a product -> Check cart badge updates
  - Assert: Cart badge shows correct item count
  - Selector: `[data-test="add-to-cart-..."]` for add buttons
- **TC-12 (View Cart):** - Steps: Add item to cart -> Click cart icon -> Verify cart page loads
  - Assert: Cart page displays, added product is visible with correct name and price
  - Selector: `.shopping_cart_link` for cart button, `.cart_item_label` for product names
- **TC-13 (Continue Shopping):** - Steps: On cart page -> Click "Continue Shopping" button -> Verify inventory page
  - Assert: Redirected to `/inventory.html` and product list is visible
  - Selector: `[data-test="continue-shopping"]` for continue button
- **TC-14 (Remove from Cart):** - Steps: On cart page with items -> Click "Remove" button -> Verify item removed
  - Assert: Item removed from cart and cart badge decreases
  - Selector: `[data-test="remove-..."]` for remove buttons
---

### [Section: E2E Checkout]
- **TC-15 (Checkout with Valid Info):** - Steps: Add 2 items -> Click Cart -> Checkout -> Enter valid personal info (First Name, Last Name, Postal Code) -> Click Finish.
  - Assert: Final page displays with "Thank you for your order!" header
  - Selector: `[data-test="first-name"]`, `[data-test="last-name"]`, `[data-test="postal-code"]` for input fields
- **TC-16 (Checkout with Invalid/Missing Info):** - Steps: Go to checkout -> Try to submit with missing or invalid personal info (empty fields or incorrect format) -> Verify error
  - Assert: Error message displays for missing/invalid fields
  - Test cases: empty first name only, empty last name only, empty postal code only, all fields empty
  - Selector: `[data-test="error"]` for error messages
- **TC-17 (Cancel Checkout):** - Steps: Add items -> Go to checkout -> Enter info -> Click "Cancel" button
  - Assert: Redirected back to inventory page (`/inventory.html`)
  - Selector: `[data-test="cancel"]` for cancel button
- **TC-18 (Complete Checkout & Back Home):** - Steps: Complete checkout flow with valid info -> Click "Finish" -> Verify success page -> Click "Back Home" button
  - Assert: Redirected to inventory page (`/inventory.html`) and cart is empty
  - Selector: `[data-test="back-to-products"]` or `.back-button` for back home button

## 5. Instructions for Copilot
> "Please refer to this file when generating Playwright test scripts. Ensure all locators use [data-test] attributes if available. Group tests by Section into separate files."