# Playwright Test Project

Sauce Demo(https://www.saucedemo.com/) 사이트를 대상으로 작성한 **Playwright + TypeScript 기반 E2E 테스트 자동화 프로젝트**입니다. 자동화에 AI툴(GitHub Copilot Chat) 활용 연습을 하기 위해 기존에 작성한 프로젝트를 프롬프트화 시켜서 그대로 AI툴에게 작성을 시키고 TC나 코드에 오류가 있는 부분들을 직접 찾아 개선하는 방식으로 사용하여 프로젝트를 수행했습니다.

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
## 6) 참고 문서
- `QA_GUIDELINES.md`: 테스트 전략, 셀렉터 우선순위, TC 매핑 기준을 프롬프트로 작성함
- TC: https://docs.google.com/spreadsheets/d/1T6SS4gyjt-b5zjlLFv7mbLCb-FLWSrWN/edit?usp=sharing&ouid=101449263364091012451&rtpof=true&sd=true

## 7) 발생한 문제점과 해결과정

1. **TC 세분화 부족**
프롬프트에서 TC를 세분화하여 요청하지 않으면, 세분화된 테스트 케이스가 생성되지 않았습니다.  
초기에는 로그인/결제 테스트의 실패 케이스가 하나로 묶여 있어 충분한 검증이 어려웠습니다.  
이에 실패 케이스를 직접 분리해 프롬프트에 반영했고, 이후 더 정확한 자동화 코드를 얻을 수 있었습니다.

2. **코딩 패턴/요구사항 명시 부족**
코딩 패턴과 요구사항을 명확히 작성하지 않으면, 하드코딩 중심의 유지보수 어려운 코드가 생성되었습니다.  
초기 코드에는 에러 메시지 하드코딩과 중복 로직이 많아, 변경 시 전체 수정이 필요한 구조였습니다.  
이를 개선하기 위해 POM(Page Object Model)을 도입해 페이지 단위로 기능을 분리하고, 메시지를 상수로 관리하여 재사용성과 유지보수성을 높였습니다.

## 8) 프로젝트 후기
직접 코딩했을 때는 약 1주일이 걸린 프로젝트였지만, AI를 도입하면서 코드 작성은 약 2시간, 리팩터링은 약 4시간 만에 진행할 수 있었습니다.  
AI 활용으로 개발 속도는 분명히 빨라졌지만, 프롬프트에서 요구사항을 구체적으로 전달하지 않으면 기대한 품질의 코드가 나오지 않는다는 점도 확인했습니다.  
결과적으로 사용자(개발자)의 도메인 지식과 개발 지식이 오히려 더 중요해졌다는 점을 체감했습니다.
