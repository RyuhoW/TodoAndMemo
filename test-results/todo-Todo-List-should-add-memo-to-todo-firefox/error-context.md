# Test info

- Name: Todo List >> should add memo to todo
- Location: C:\Users\ryuho\SynologyDrive\Projects\react-demo\e2e\todo.spec.ts:46:7

# Error details

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.todo-item:has-text("メモ付きタスク") .memo-button')

    at C:\Users\ryuho\SynologyDrive\Projects\react-demo\e2e\todo.spec.ts:52:16
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
  - text: メモ付きタスク
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
  12 |
  13 |     // タスクが追加されたことを確認
  14 |     await expect(page.locator('.todo-item')).toContainText('新しいタスク');
  15 |   });
  16 |
  17 |   test('should toggle todo completion', async ({ page }) => {
  18 |     // タスクを追加
  19 |     await page.fill('input[placeholder="新しいタスクを入力"]', '完了するタスク');
  20 |     await page.click('button:has-text("追加")');
  21 |
  22 |     // タスクを完了状態に変更
  23 |     await page.click('.todo-item:has-text("完了するタスク") .checkbox');
  24 |     await expect(page.locator('.todo-item:has-text("完了するタスク")')).toHaveClass(/completed/);
  25 |
  26 |     // タスクを未完了状態に戻す
  27 |     await page.click('.todo-item:has-text("完了するタスク") .checkbox');
  28 |     await expect(page.locator('.todo-item:has-text("完了するタスク")')).not.toHaveClass(/completed/);
  29 |   });
  30 |
  31 |   test('should delete a todo', async ({ page }) => {
  32 |     // タスクを追加
  33 |     await page.fill('input[placeholder="新しいタスクを入力"]', '削除するタスク');
  34 |     await page.click('button:has-text("追加")');
  35 |
  36 |     // タスクが存在することを確認
  37 |     await expect(page.locator('.todo-item:has-text("削除するタスク")')).toBeVisible();
  38 |
  39 |     // タスクを削除
  40 |     await page.click('.todo-item:has-text("削除するタスク") .delete-button');
  41 |
  42 |     // タスクが削除されたことを確認
  43 |     await expect(page.locator('.todo-item:has-text("削除するタスク")')).not.toBeVisible();
  44 |   });
  45 |
  46 |   test('should add memo to todo', async ({ page }) => {
  47 |     // タスクを追加
  48 |     await page.fill('input[placeholder="新しいタスクを入力"]', 'メモ付きタスク');
  49 |     await page.click('button:has-text("追加")');
  50 |
  51 |     // メモを追加
> 52 |     await page.click('.todo-item:has-text("メモ付きタスク") .memo-button');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  53 |     await page.fill('.memo-input', 'これはテストメモです');
  54 |     await page.click('.memo-save-button');
  55 |
  56 |     // メモが追加されたことを確認
  57 |     await expect(page.locator('.todo-item:has-text("メモ付きタスク") .memo')).toContainText('これはテストメモです');
  58 |   });
  59 | }); 
```