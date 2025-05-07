# Test info

- Name: Todo List >> should toggle todo completion
- Location: C:\Users\ryuho\SynologyDrive\Projects\react-demo\e2e\todo.spec.ts:15:7

# Error details

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('li:has-text("完了するタスク") input[type="checkbox"]')

    at C:\Users\ryuho\SynologyDrive\Projects\react-demo\e2e\todo.spec.ts:21:16
```

# Page snapshot

```yaml
- banner:
  - heading "Todo & Notes App" [level=1]
- main:
  - heading "Todo List" [level=2]
  - textbox "新しいタスクを入力"
  - button "追加"
  - checkbox
  - text: 完了するタスク
  - button "メモを編集":
    - img
  - button "タスクを削除":
    - img
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
   3 | test.describe('Todo List', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     await page.goto('/');
   6 |   });
   7 |
   8 |   test('should add a new todo', async ({ page }) => {
   9 |     // 新しいタスクを入力
  10 |     await page.fill('input[placeholder="新しいタスクを入力"]', '新しいタスク');
  11 |     await page.click('button:has-text("追加")');
  12 |     await expect(page.locator('li:has-text("新しいタスク")')).toBeVisible();
  13 |   });
  14 |
  15 |   test('should toggle todo completion', async ({ page }) => {
  16 |     // タスクを追加
  17 |     await page.fill('input[placeholder="新しいタスクを入力"]', '完了するタスク');
  18 |     await page.click('button:has-text("追加")');
  19 |
  20 |     // タスクを完了状態に変更
> 21 |     await page.click('li:has-text("完了するタスク") input[type="checkbox"]');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  22 |     await expect(page.locator('li:has-text("完了するタスク")')).toHaveClass(/completed/);
  23 |
  24 |     // タスクを未完了状態に戻す
  25 |     await page.click('li:has-text("完了するタスク") input[type="checkbox"]');
  26 |     await expect(page.locator('li:has-text("完了するタスク")')).not.toHaveClass(/completed/);
  27 |   });
  28 |
  29 |   test('should delete a todo', async ({ page }) => {
  30 |     // タスクを追加
  31 |     await page.fill('input[placeholder="新しいタスクを入力"]', '削除するタスク');
  32 |     await page.click('button:has-text("追加")');
  33 |
  34 |     // タスクが存在することを確認
  35 |     await expect(page.locator('li:has-text("削除するタスク")')).toBeVisible();
  36 |
  37 |     // タスクを削除
  38 |     await page.click('li:has-text("削除するタスク") button:has-text("削除")');
  39 |
  40 |     // タスクが削除されたことを確認
  41 |     await expect(page.locator('li:has-text("削除するタスク")')).not.toBeVisible();
  42 |   });
  43 |
  44 |   test('should add memo to todo', async ({ page }) => {
  45 |     // タスクを追加
  46 |     await page.fill('input[placeholder="新しいタスクを入力"]', 'メモ付きタスク');
  47 |     await page.click('button:has-text("追加")');
  48 |
  49 |     // メモを追加
  50 |     await page.fill('li:has-text("メモ付きタスク") input[placeholder="メモを入力"]', 'タスクのメモ');
  51 |     await page.click('li:has-text("メモ付きタスク") button:has-text("メモ追加")');
  52 |
  53 |     // メモが追加されたことを確認
  54 |     await expect(page.locator('li:has-text("メモ付きタスク")')).toContainText('タスクのメモ');
  55 |   });
  56 | }); 
```