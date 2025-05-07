# Test info

- Name: Notes >> should display multiple notes
- Location: C:\Users\ryuho\SynologyDrive\Projects\react-demo\e2e\notes.spec.ts:43:7

# Error details

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.note')

    at addNote (C:\Users\ryuho\SynologyDrive\Projects\react-demo\e2e\notes.spec.ts:15:16)
    at C:\Users\ryuho\SynologyDrive\Projects\react-demo\e2e\notes.spec.ts:44:5
```

# Page snapshot

```yaml
- banner:
  - heading "Todo & Notes App" [level=1]
- main:
  - heading "Todo List" [level=2]
  - textbox "新しいタスクを入力"
  - button "追加"
  - heading "Notes" [level=2]
  - textbox "新しいメモを入力": メモ1
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
   4 |   test.beforeEach(async ({ page }) => {
   5 |     await page.goto('/');
   6 |     await page.waitForLoadState('networkidle');
   7 |     await page.waitForSelector('textarea[placeholder="新しいメモを入力"]', { state: 'visible' });
   8 |   });
   9 |
  10 |   const addNote = async (page, text) => {
  11 |     await page.fill('textarea[placeholder="新しいメモを入力"]', '');
  12 |     await page.fill('textarea[placeholder="新しいメモを入力"]', text);
  13 |     await page.click('button:has-text("追加")');
  14 |     await page.waitForTimeout(1000);
> 15 |     await page.waitForSelector('.note', { state: 'attached' });
     |                ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  16 |   };
  17 |
  18 |   test('should add a new note', async ({ page }) => {
  19 |     await addNote(page, '新しいメモ');
  20 |     
  21 |     console.log('Current HTML:', await page.content());
  22 |     
  23 |     const noteLocator = page.locator('.note', {
  24 |       has: page.locator('.note-content p', { hasText: '新しいメモ' })
  25 |     });
  26 |     await expect(noteLocator).toBeVisible({ timeout: 15000 });
  27 |   });
  28 |
  29 |   test('should delete a note', async ({ page }) => {
  30 |     await addNote(page, '削除するメモ');
  31 |     
  32 |     console.log('Current HTML:', await page.content());
  33 |     
  34 |     const noteLocator = page.locator('.note', {
  35 |       has: page.locator('.note-content p', { hasText: '削除するメモ' })
  36 |     });
  37 |     await expect(noteLocator).toBeVisible({ timeout: 15000 });
  38 |     
  39 |     await noteLocator.locator('.action-button.delete').click();
  40 |     await expect(noteLocator).not.toBeVisible({ timeout: 15000 });
  41 |   });
  42 |
  43 |   test('should display multiple notes', async ({ page }) => {
  44 |     await addNote(page, 'メモ1');
  45 |     await addNote(page, 'メモ2');
  46 |     await addNote(page, 'メモ3');
  47 |
  48 |     console.log('Current HTML:', await page.content());
  49 |
  50 |     for (const text of ['メモ1', 'メモ2', 'メモ3']) {
  51 |       const noteLocator = page.locator('.note', {
  52 |         has: page.locator('.note-content p', { hasText: text })
  53 |       });
  54 |       await expect(noteLocator).toBeVisible({ timeout: 15000 });
  55 |     }
  56 |
  57 |     await expect(page.locator('.note')).toHaveCount(3, { timeout: 15000 });
  58 |   });
  59 |
  60 |   test('should handle empty note input', async ({ page }) => {
  61 |     const notes = page.locator('.note');
  62 |     const initialNoteCount = await notes.count();
  63 |     await page.click('button:has-text("追加")');
  64 |     await expect(notes).toHaveCount(initialNoteCount, { timeout: 15000 });
  65 |   });
  66 | }); 
```