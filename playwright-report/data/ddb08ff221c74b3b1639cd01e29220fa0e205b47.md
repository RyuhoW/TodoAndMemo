# Test info

- Name: Notes >> should add a new note
- Location: C:\Users\ryuho\SynologyDrive\Projects\react-demo\e2e\notes.spec.ts:8:7

# Error details

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[placeholder="新しいメモを入力"]')

    at C:\Users\ryuho\SynologyDrive\Projects\react-demo\e2e\notes.spec.ts:9:16
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
  - textbox "新しいメモを入力"
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
   6 |   });
   7 |
   8 |   test('should add a new note', async ({ page }) => {
>  9 |     await page.fill('input[placeholder="新しいメモを入力"]', '新しいメモ');
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  10 |     await page.click('button:has-text("追加")');
  11 |     await expect(page.locator('li:has-text("新しいメモ")')).toBeVisible();
  12 |   });
  13 |
  14 |   test('should delete a note', async ({ page }) => {
  15 |     await page.fill('input[placeholder="新しいメモを入力"]', '削除するメモ');
  16 |     await page.click('button:has-text("追加")');
  17 |     await page.click('li:has-text("削除するメモ") button:has-text("削除")');
  18 |     await expect(page.locator('li:has-text("削除するメモ")')).not.toBeVisible();
  19 |   });
  20 |
  21 |   test('should display multiple notes', async ({ page }) => {
  22 |     await page.fill('input[placeholder="新しいメモを入力"]', 'メモ1');
  23 |     await page.click('button:has-text("追加")');
  24 |     await page.fill('input[placeholder="新しいメモを入力"]', 'メモ2');
  25 |     await page.click('button:has-text("追加")');
  26 |     await page.fill('input[placeholder="新しいメモを入力"]', 'メモ3');
  27 |     await page.click('button:has-text("追加")');
  28 |
  29 |     await expect(page.locator('li:has-text("メモ1")')).toBeVisible();
  30 |     await expect(page.locator('li:has-text("メモ2")')).toBeVisible();
  31 |     await expect(page.locator('li:has-text("メモ3")')).toBeVisible();
  32 |   });
  33 |
  34 |   test('should handle empty note input', async ({ page }) => {
  35 |     const initialNoteCount = await page.locator('li').count();
  36 |     await page.click('button:has-text("追加")');
  37 |     const finalNoteCount = await page.locator('li').count();
  38 |     expect(finalNoteCount).toBe(initialNoteCount);
  39 |   });
  40 | }); 
```