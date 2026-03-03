// // login.spec.ts 로 이름을 변경해서 사용하세요
// import {test,expect} from '@playwright/test';
// import { login } from './utils/auth';

// // 테스트 함수들
// // 각 테스트 전에 실행되는 코드
// test.beforeEach(async({page})=>{
//     // saucedemo 홈페이지로 이동
//     await page.goto('https://www.saucedemo.com/');
// });

// // 로그인 성공 테스트
// test('login success', async({page})=>{
//     await login(page,'standard_user','secret_sauce');
//     // 해당 URL이 포함 되어있는지 정규식을 사용해서 파악한다.
//     await expect(page).toHaveURL(/inventory.html/);
// });

// // 로그인 실패 테스트 - 값 전체 미입력
// test('login failure - empty fields', async({page})=>{
//     await login(page,'','');
//     await expect(page.locator('.error-message-container')).toHaveText(/Username is required/);
// });

// // 로그인 실패 테스트 - 아이디 미입력
// test('login failure - empty username', async({page})=>{
//     await login(page, '', 'secret_sauce');
//     await expect(page.locator('.error-message-container')).toHaveText(/Username is required/);
// })

// // 로그인 실패 테스트 - 비밀번호 미입력
// test('login failure - empty password', async({page})=>{
//     await login(page, 'standard_user', '');
//     await expect(page.locator('.error-message-container')).toHaveText(/Password is required/);
// });

// // 로그인 실패 테스트 - 아이디 틀림
// test('login failure - wrong username', async({page})=>{
//     await login(page, 'wrong_user','secret_sauce');
//     await expect(page.locator('.error-message-container')).toHaveText("Epic sadface: Username and password do not match any user in this service");
// });

// // 로그인 실패 테스트 - 비밀번호 틀림
// test('login failure - wrong password', async({page})=>{
//     await login(page, 'standard_user','secret_sauce1!!!');
//     await expect(page.locator('.error-message-container')).toHaveText("Epic sadface: Username and password do not match any user in this service");
// });