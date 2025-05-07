# Test info

- Name: Notes >> should delete a note
- Location: C:\Users\ryuho\SynologyDrive\Projects\react-demo\e2e\notes.spec.ts:17:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('.note:has-text("削除するメモ")')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('.note:has-text("削除するメモ")')

    at C:\Users\ryuho\SynologyDrive\Projects\react-demo\e2e\notes.spec.ts:23:60
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
  - textbox "新しいメモを入力": 削除するメモ
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
   9 |     // 新しいメモを入力
  10 |     await page.fill('textarea[placeholder="新しいメモを入力"]', '新しいメモ');
  11 |     await page.click('button:has-text("追加")');
  12 |
  13 |     // メモが追加されたことを確認
  14 |     await expect(page.locator('.note')).toContainText('新しいメモ');
  15 |   });
  16 |
  17 |   test('should delete a note', async ({ page }) => {
  18 |     // メモを追加
  19 |     await page.fill('textarea[placeholder="新しいメモを入力"]', '削除するメモ');
  20 |     await page.click('button:has-text("追加")');
  21 |
  22 |     // メモが存在することを確認
> 23 |     await expect(page.locator('.note:has-text("削除するメモ")')).toBeVisible();
     |                                                            ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  24 |
  25 |     // メモを削除
  26 |     await page.click('.note:has-text("削除するメモ") .delete-button');
  27 |
  28 |     // メモが削除されたことを確認
  29 |     await expect(page.locator('.note:has-text("削除するメモ")')).not.toBeVisible();
  30 |   });
  31 |
  32 |   test('should display multiple notes', async ({ page }) => {
  33 |     // 複数のメモを追加
  34 |     const notes = ['メモ1', 'メモ2', 'メモ3'];
  35 |     for (const note of notes) {
  36 |       await page.fill('textarea[placeholder="新しいメモを入力"]', note);
  37 |       await page.click('button:has-text("追加")');
  38 |     }
  39 |
  40 |     // すべてのメモが表示されていることを確認
  41 |     for (const note of notes) {
  42 |       await expect(page.locator('.note')).toContainText(note);
  43 |     }
  44 |   });
  45 |
  46 |   test('should handle empty note input', async ({ page }) => {
  47 |     // 空のメモを追加しようとする
  48 |     await page.fill('textarea[placeholder="新しいメモを入力"]', '');
  49 |     await page.click('button:has-text("追加")');
  50 |
  51 |     // メモが追加されていないことを確認
  52 |     await expect(page.locator('.note')).not.toBeVisible();
  53 |   });
  54 | }); 
```