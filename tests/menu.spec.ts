import {test,expect} from '@playwright/test';
import { login } from './utils/auth';

//테스트 함수들
//각 테스트 전에 실행되는 코드
test.beforeEach(async({page})=>{
    //saucedemo 홈페이지로 이동
    await page.goto('https://www.saucedemo.com/');
    //로그인
    await login(page,'standard_user','secret_sauce');
    //메뉴 버튼 클릭
    await page.click('#react-burger-menu-btn');
});

// 메뉴 버튼 클릭 및 닫기 테스트
test('menu open and clese',async({page})=>{
    //메뉴 버튼 닫기
    await page.click('#react-burger-cross-btn');
    await expect(page.locator('.bm-menu-wrap')).toBeHidden();
});

// 메뉴의 'All Items' 버튼 클릭 테스트

// 메뉴의 'About' 버튼 클릭 테스트

// 메뉴의 'Logout' 버튼 클릭 테스트

// 메늉의 'Reset App State' 버튼 클릭 테스트