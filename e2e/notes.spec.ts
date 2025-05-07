import { test, expect } from '@playwright/test';

test.describe('Notes', () => {
  const addNote = async (page: any, text: string) => {
    await page.waitForSelector('textarea[placeholder="新しいメモを入力"]', { state: 'visible', timeout: 10000 });
    await page.getByPlaceholder('新しいメモを入力').fill(text);
    await page.getByRole('button', { name: '追加' }).click();
    await page.waitForTimeout(1000);
    await page.waitForSelector('.note', { state: 'attached' });
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // アプリケーションの読み込みを待機
    await page.waitForLoadState('networkidle');
    // Todoタブに移動
    await page.getByRole('button', { name: 'Todo' }).click();
  });

  test('should add a new note', async ({ page }) => {
    await addNote(page, 'テストメモ');
    await expect(page.locator('.note')).toContainText('テストメモ');
  });

  test('should delete a note', async ({ page }) => {
    await addNote(page, '削除するメモ');
    await page.waitForSelector('.note:has-text("削除するメモ")', { state: 'visible', timeout: 10000 });
    await page.locator('.note:has-text("削除するメモ") .delete-button').click();
    await expect(page.locator('.note:has-text("削除するメモ")')).not.toBeVisible();
  });

  test('should display multiple notes', async ({ page }) => {
    await addNote(page, 'メモ1');
    await addNote(page, 'メモ2');
    await addNote(page, 'メモ3');

    const notes = await page.locator('.note').all();
    expect(notes).toHaveLength(3);

    await expect(page.locator('.note').nth(0)).toContainText('メモ1');
    await expect(page.locator('.note').nth(1)).toContainText('メモ2');
    await expect(page.locator('.note').nth(2)).toContainText('メモ3');
  });

  test('should handle empty note input', async ({ page }) => {
    const notes = page.locator('.note');
    const initialNoteCount = await notes.count();
    await page.click('button:has-text("追加")');
    await expect(notes).toHaveCount(initialNoteCount, { timeout: 15000 });
  });
}); 