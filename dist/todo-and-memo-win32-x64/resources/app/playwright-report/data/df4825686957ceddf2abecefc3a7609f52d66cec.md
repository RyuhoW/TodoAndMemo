# Test info

- Name: Notes >> should add a new note
- Location: C:\Users\ryuho\SynologyDrive\Projects\TodoAndMemo\e2e\notes.spec.ts:20:7

# Error details

```
Error: locator.click: Error: strict mode violation: getByRole('button', { name: '追加' }) resolved to 2 elements:
    1) <button class="button">追加</button> aka locator('section').filter({ hasText: 'Todo List追加' }).getByRole('button')
    2) <button class="button">追加</button> aka locator('section').filter({ hasText: 'Notesテストメモ追加' }).getByRole('button')

Call log:
  - waiting for getByRole('button', { name: '追加' })

    at addNote (C:\Users\ryuho\SynologyDrive\Projects\TodoAndMemo\e2e\notes.spec.ts:7:52)
    at C:\Users\ryuho\SynologyDrive\Projects\TodoAndMemo\e2e\notes.spec.ts:21:5
```

# Page snapshot

```yaml
- banner:
  - heading "Todo & Notes App" [level=1]
  - navigation:
    - button "Todo"
    - button "カレンダー"
    - button "ダッシュボード"
- main:
  - heading "Todo List" [level=2]
  - textbox "新しいタスクを入力"
  - button "追加"
  - heading "Notes" [level=2]
  - textbox "新しいメモを入力": テストメモ
  - button "追加"
  - heading "Calculator" [level=2]
  - text: "0"
  - button "7"
  - button "8"
  - button "9"
  - button "4"
  - button "5"
  - button "6"
  - button "1"
  - button "2"
  - button "3"
  - button "0"
  - button "."
  - button "C"
  - button "÷"
  - button "×"
  - button "-"
  - button "+"
  - button "="
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Notes', () => {
   4 |   const addNote = async (page: any, text: string) => {
   5 |     await page.waitForSelector('textarea[placeholder="新しいメモを入力"]', { state: 'visible', timeout: 10000 });
   6 |     await page.getByPlaceholder('新しいメモを入力').fill(text);
>  7 |     await page.getByRole('button', { name: '追加' }).click();
     |                                                    ^ Error: locator.click: Error: strict mode violation: getByRole('button', { name: '追加' }) resolved to 2 elements:
   8 |     await page.waitForTimeout(1000);
   9 |     await page.waitForSelector('.note', { state: 'attached' });
  10 |   };
  11 |
  12 |   test.beforeEach(async ({ page }) => {
  13 |     await page.goto('/');
  14 |     // アプリケーションの読み込みを待機
  15 |     await page.waitForLoadState('networkidle');
  16 |     // Todoタブに移動
  17 |     await page.getByRole('button', { name: 'Todo' }).click();
  18 |   });
  19 |
  20 |   test('should add a new note', async ({ page }) => {
  21 |     await addNote(page, 'テストメモ');
  22 |     await expect(page.locator('.note')).toContainText('テストメモ');
  23 |   });
  24 |
  25 |   test('should delete a note', async ({ page }) => {
  26 |     await addNote(page, '削除するメモ');
  27 |     await page.waitForSelector('.note:has-text("削除するメモ")', { state: 'visible', timeout: 10000 });
  28 |     await page.locator('.note:has-text("削除するメモ") .delete-button').click();
  29 |     await expect(page.locator('.note:has-text("削除するメモ")')).not.toBeVisible();
  30 |   });
  31 |
  32 |   test('should display multiple notes', async ({ page }) => {
  33 |     await addNote(page, 'メモ1');
  34 |     await addNote(page, 'メモ2');
  35 |     await addNote(page, 'メモ3');
  36 |
  37 |     const notes = await page.locator('.note').all();
  38 |     expect(notes).toHaveLength(3);
  39 |
  40 |     await expect(page.locator('.note').nth(0)).toContainText('メモ1');
  41 |     await expect(page.locator('.note').nth(1)).toContainText('メモ2');
  42 |     await expect(page.locator('.note').nth(2)).toContainText('メモ3');
  43 |   });
  44 |
  45 |   test('should handle empty note input', async ({ page }) => {
  46 |     const notes = page.locator('.note');
  47 |     const initialNoteCount = await notes.count();
  48 |     await page.click('button:has-text("追加")');
  49 |     await expect(notes).toHaveCount(initialNoteCount, { timeout: 15000 });
  50 |   });
  51 | }); 
```