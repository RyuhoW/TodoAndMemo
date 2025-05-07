import { test, expect } from '@playwright/test';

test.describe('Notes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should add a new note', async ({ page }) => {
    await page.fill('input[placeholder="新しいメモを入力"]', '新しいメモ');
    await page.click('button:has-text("追加")');
    await expect(page.locator('li:has-text("新しいメモ")')).toBeVisible();
  });

  test('should delete a note', async ({ page }) => {
    await page.fill('input[placeholder="新しいメモを入力"]', '削除するメモ');
    await page.click('button:has-text("追加")');
    await page.click('li:has-text("削除するメモ") button:has-text("削除")');
    await expect(page.locator('li:has-text("削除するメモ")')).not.toBeVisible();
  });

  test('should display multiple notes', async ({ page }) => {
    await page.fill('input[placeholder="新しいメモを入力"]', 'メモ1');
    await page.click('button:has-text("追加")');
    await page.fill('input[placeholder="新しいメモを入力"]', 'メモ2');
    await page.click('button:has-text("追加")');
    await page.fill('input[placeholder="新しいメモを入力"]', 'メモ3');
    await page.click('button:has-text("追加")');

    await expect(page.locator('li:has-text("メモ1")')).toBeVisible();
    await expect(page.locator('li:has-text("メモ2")')).toBeVisible();
    await expect(page.locator('li:has-text("メモ3")')).toBeVisible();
  });

  test('should handle empty note input', async ({ page }) => {
    const initialNoteCount = await page.locator('li').count();
    await page.click('button:has-text("追加")');
    const finalNoteCount = await page.locator('li').count();
    expect(finalNoteCount).toBe(initialNoteCount);
  });
}); 