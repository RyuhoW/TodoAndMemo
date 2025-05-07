import { test, expect } from '@playwright/test';

test.describe('Notes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should add a new note', async ({ page }) => {
    // 新しいメモを入力
    await page.fill('textarea[placeholder="新しいメモを入力"]', '新しいメモ');
    await page.click('button:has-text("追加")');

    // メモが追加されたことを確認
    await expect(page.locator('.note')).toContainText('新しいメモ');
  });

  test('should delete a note', async ({ page }) => {
    // メモを追加
    await page.fill('textarea[placeholder="新しいメモを入力"]', '削除するメモ');
    await page.click('button:has-text("追加")');

    // メモが存在することを確認
    await expect(page.locator('.note:has-text("削除するメモ")')).toBeVisible();

    // メモを削除
    await page.click('.note:has-text("削除するメモ") .delete-button');

    // メモが削除されたことを確認
    await expect(page.locator('.note:has-text("削除するメモ")')).not.toBeVisible();
  });

  test('should display multiple notes', async ({ page }) => {
    // 複数のメモを追加
    const notes = ['メモ1', 'メモ2', 'メモ3'];
    for (const note of notes) {
      await page.fill('textarea[placeholder="新しいメモを入力"]', note);
      await page.click('button:has-text("追加")');
    }

    // すべてのメモが表示されていることを確認
    for (const note of notes) {
      await expect(page.locator('.note')).toContainText(note);
    }
  });

  test('should handle empty note input', async ({ page }) => {
    // 空のメモを追加しようとする
    await page.fill('textarea[placeholder="新しいメモを入力"]', '');
    await page.click('button:has-text("追加")');

    // メモが追加されていないことを確認
    await expect(page.locator('.note')).not.toBeVisible();
  });
}); 