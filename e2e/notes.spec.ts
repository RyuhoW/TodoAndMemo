import { test, expect } from '@playwright/test';

test.describe('Notes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('textarea[placeholder="新しいメモを入力"]', { state: 'visible' });
  });

  const addNote = async (page, text) => {
    await page.fill('textarea[placeholder="新しいメモを入力"]', '');
    await page.fill('textarea[placeholder="新しいメモを入力"]', text);
    await page.click('button:has-text("追加")');
    await page.waitForTimeout(1000);
    await page.waitForSelector('.note', { state: 'attached' });
  };

  test('should add a new note', async ({ page }) => {
    await addNote(page, '新しいメモ');
    
    console.log('Current HTML:', await page.content());
    
    const noteLocator = page.locator('.note', {
      has: page.locator('.note-content p', { hasText: '新しいメモ' })
    });
    await expect(noteLocator).toBeVisible({ timeout: 15000 });
  });

  test('should delete a note', async ({ page }) => {
    await addNote(page, '削除するメモ');
    
    console.log('Current HTML:', await page.content());
    
    const noteLocator = page.locator('.note', {
      has: page.locator('.note-content p', { hasText: '削除するメモ' })
    });
    await expect(noteLocator).toBeVisible({ timeout: 15000 });
    
    await noteLocator.locator('.action-button.delete').click();
    await expect(noteLocator).not.toBeVisible({ timeout: 15000 });
  });

  test('should display multiple notes', async ({ page }) => {
    await addNote(page, 'メモ1');
    await addNote(page, 'メモ2');
    await addNote(page, 'メモ3');

    console.log('Current HTML:', await page.content());

    for (const text of ['メモ1', 'メモ2', 'メモ3']) {
      const noteLocator = page.locator('.note', {
        has: page.locator('.note-content p', { hasText: text })
      });
      await expect(noteLocator).toBeVisible({ timeout: 15000 });
    }

    await expect(page.locator('.note')).toHaveCount(3, { timeout: 15000 });
  });

  test('should handle empty note input', async ({ page }) => {
    const notes = page.locator('.note');
    const initialNoteCount = await notes.count();
    await page.click('button:has-text("追加")');
    await expect(notes).toHaveCount(initialNoteCount, { timeout: 15000 });
  });
}); 