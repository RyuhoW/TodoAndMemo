import { test, expect } from '@playwright/test';

test.describe('Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should perform basic calculations', async ({ page }) => {
    // 数字の入力
    await page.click('button:has-text("1")');
    await page.click('button:has-text("2")');
    await page.click('button:has-text("3")');
    await expect(page.locator('.result')).toHaveText('123');

    // 演算子の入力
    await page.click('button:has-text("+")');
    await page.click('button:has-text("4")');
    await page.click('button:has-text("5")');
    await page.click('button:has-text("6")');
    await expect(page.locator('.result')).toHaveText('456');

    // 計算の実行
    await page.click('button:has-text("=")');
    await expect(page.locator('.result')).toHaveText('579');
  });

  test('should clear display', async ({ page }) => {
    // 数字の入力
    await page.click('button:has-text("9")');
    await page.click('button:has-text("8")');
    await page.click('button:has-text("7")');
    await expect(page.locator('.result')).toHaveText('987');

    // クリアボタンのクリック
    await page.click('button:has-text("C")');
    await expect(page.locator('.result')).toHaveText('0');
  });

  test('should handle decimal numbers', async ({ page }) => {
    // 小数点の入力
    await page.click('button:has-text("1")');
    await page.click('button:has-text(".")');
    await page.click('button:has-text("5")');
    await expect(page.locator('.result')).toHaveText('1.5');

    // 計算の実行
    await page.click('button:has-text("+")');
    await page.click('button:has-text("2")');
    await page.click('button:has-text(".")');
    await page.click('button:has-text("5")');
    await page.click('button:has-text("=")');
    await expect(page.locator('.result')).toHaveText('4');
  });
}); 