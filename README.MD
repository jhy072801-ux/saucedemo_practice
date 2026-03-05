# Playwright Test Project

Sauce Demo(https://www.saucedemo.com/) 사이트를 대상으로 작성한 **Playwright + TypeScript 기반 E2E 테스트 자동화 프로젝트**입니다. 자동화에 AI툴 활용 연습을 하기 위해 기존에 작성한 프로젝트를 프롬프트화 시켜서 그대로 AI툴에게 작성을 시키고 TC나 코드에 오류가 있는 부분들을 직접 찾아 개선하는 방식으로 사용하여 프로젝트를 수행했습니다.

로그인, 상품 정렬, 사이드바 메뉴, 장바구니, 체크아웃 플로우를 Page Object Model(POM) 구조로 검증합니다.

## 1) 프로젝트 개요
- 테스트 대상: `https://www.saucedemo.com`
- 목적: 핵심 사용자 시나리오(로그인부터 주문 완료까지) 자동 회귀 테스트
- 테스트 프레임워크: `@playwright/test`
- 환경 설정: `.env` 기반(`BASE_URL`, 계정 정보)

## 2) 루트 디렉터리 구조
```text
playwright-test/
├─ constants/
│  └─ messages.ts                     # 로그인 에러 메시지 상수
├─ pages/
│  ├─ components/
│  │  └─ SidebarComponent.ts          # 사이드바 메뉴 컴포넌트 POM
│  ├─ CartPage.ts                     # 장바구니 페이지 POM
│  ├─ CheckoutPage.ts                 # 체크아웃 페이지 POM
│  ├─ InventroyPage.ts                # 인벤토리(상품 목록) 페이지 POM
│  └─ LoginPage.ts                    # 로그인 페이지 POM
├─ tests/
│  ├─ utils/
│  │  └─ auth.ts                      # 공통 로그인 유틸 함수
│  ├─ cart-management.spec.ts         # TC-12 ~ TC-15 장바구니 테스트
│  ├─ E2E-test.spec.ts                # TC-11, TC-16 ~ TC-18 체크아웃 E2E
│  ├─ login.spec.ts                   # TC-01 ~ TC-04 로그인 테스트
│  ├─ product-filter.spec.ts          # TC-07 ~ TC-10 정렬 필터 테스트
│  └─ sidebar-menu.spec.ts            # TC-05 ~ TC-06 사이드바/로그아웃 테스트
├─ test-results/                      # Playwright 실행 결과물
├─ .env                               # 테스트 계정 및 BASE_URL
├─ playwright.config.ts               # Playwright 전역 설정
├─ QA_GUIDELINES.md                   # 테스트 작성 가이드/TC 매핑 문서
├─ package.json
└─ README.MD
```

## 3) 테스트 설계 방식
- **POM(Page Object Model)** 중심 구조
  - `pages/`에서 로케이터와 동작 메서드를 캡슐화
  - `tests/`는 시나리오와 검증(assertion)에 집중
- **테스트 분리 기준**
  - 기능 영역별 스펙 파일 분리: 로그인/필터/사이드바/카트/체크아웃
- **데이터/메시지 관리**
  - 로그인 에러 메시지는 `constants/messages.ts`에서 상수로 관리

## 4) 현재 커버 중인 시나리오
- 인증: 로그인 성공/실패/미입력
- 내비게이션: 사이드바 메뉴 동작, 로그아웃
- 상품: 정렬 필터(A-Z, Z-A, 가격 오름/내림)
- 장바구니: 추가/조회/계속 쇼핑/삭제
- 주문: 체크아웃 성공, 필수값 검증, 취소, 완료 후 복귀

## 5) 실행 방법
```bash
npx playwright test
npx playwright test --ui
```

## 6) 환경 변수(.env)
```env
SAUCE_USERNAME=standard_user
SAUCE_ACCESS_KEY=secret_sauce
BASE_URL=https://www.saucedemo.com
```

## 7) 참고 문서
- `QA_GUIDELINES.md`: 테스트 전략, 셀렉터 우선순위, TC 매핑 기준을 프롬프트로 작성함
