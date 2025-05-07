# Test info

- Name: Todo List >> should add a new todo
- Location: C:\Users\ryuho\SynologyDrive\Projects\TodoAndMemo\e2e\todo.spec.ts:12:7

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('input[placeholder="新しいTodoを入力"]') to be visible

    at C:\Users\ryuho\SynologyDrive\Projects\TodoAndMemo\e2e\todo.spec.ts:14:16
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
   6 |     // アプリケーションの読み込みを待機
   7 |     await page.waitForLoadState('networkidle');
   8 |     // Todoタブに移動
   9 |     await page.getByRole('button', { name: 'Todo' }).click();
  10 |   });
  11 |
  12 |   test('should add a new todo', async ({ page }) => {
  13 |     // 新しいタスクを入力
> 14 |     await page.waitForSelector('input[placeholder="新しいTodoを入力"]', { state: 'visible', timeout: 10000 });
     |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  15 |     await page.getByPlaceholder('新しいTodoを入力').fill('新しいタスク');
  16 |     await page.getByRole('button', { name: '追加' }).click();
  17 |     await expect(page.locator('.todo-item:has-text("新しいタスク")')).toBeVisible();
  18 |   });
  19 |
  20 |   test('should toggle todo completion', async ({ page }) => {
  21 |     // タスクを追加
  22 |     await page.waitForSelector('input[placeholder="新しいTodoを入力"]', { state: 'visible', timeout: 10000 });
  23 |     await page.getByPlaceholder('新しいTodoを入力').fill('完了するタスク');
  24 |     await page.getByRole('button', { name: '追加' }).click();
  25 |
  26 |     // タスクを完了状態に変更
  27 |     await page.waitForSelector('.todo-item:has-text("完了するタスク")', { state: 'visible', timeout: 10000 });
  28 |     await page.locator('.todo-item:has-text("完了するタスク") .todo-checkbox').check();
  29 |     await expect(page.locator('.todo-item:has-text("完了するタスク") .todo-text')).toHaveClass(/completed/);
  30 |
  31 |     // タスクを未完了状態に戻す
  32 |     await page.locator('.todo-item:has-text("完了するタスク") .todo-checkbox').uncheck();
  33 |     await expect(page.locator('.todo-item:has-text("完了するタスク") .todo-text')).not.toHaveClass(/completed/);
  34 |   });
  35 |
  36 |   test('should delete a todo', async ({ page }) => {
  37 |     // タスクを追加
  38 |     await page.waitForSelector('input[placeholder="新しいTodoを入力"]', { state: 'visible', timeout: 10000 });
  39 |     await page.getByPlaceholder('新しいTodoを入力').fill('削除するタスク');
  40 |     await page.getByRole('button', { name: '追加' }).click();
  41 |
  42 |     // タスクが存在することを確認
  43 |     await expect(page.locator('.todo-item:has-text("削除するタスク")')).toBeVisible();
  44 |
  45 |     // タスクを削除
  46 |     await page.waitForSelector('.todo-item:has-text("削除するタスク") .action-button.delete', { state: 'visible', timeout: 10000 });
  47 |     await page.locator('.todo-item:has-text("削除するタスク") .action-button.delete').click();
  48 |
  49 |     // タスクが削除されたことを確認
  50 |     await expect(page.locator('.todo-item:has-text("削除するタスク")')).not.toBeVisible();
  51 |   });
  52 |
  53 |   test('should add memo to todo', async ({ page }) => {
  54 |     // タスクを追加
  55 |     await page.waitForSelector('input[placeholder="新しいTodoを入力"]', { state: 'visible', timeout: 10000 });
  56 |     await page.getByPlaceholder('新しいTodoを入力').fill('メモ付きタスク');
  57 |     await page.getByRole('button', { name: '追加' }).click();
  58 |
  59 |     // メモを追加
  60 |     await page.waitForSelector('.todo-item:has-text("メモ付きタスク")', { state: 'visible', timeout: 10000 });
  61 |     await page.locator('.todo-item:has-text("メモ付きタスク") .action-button.edit').click();
  62 |     await page.locator('.todo-item:has-text("メモ付きタスク") .memo-textarea').fill('タスクのメモ');
  63 |     await page.locator('.todo-item:has-text("メモ付きタスク") .button.save').click();
  64 |
  65 |     // メモが表示されていることを確認
  66 |     await expect(page.locator('.todo-item:has-text("メモ付きタスク") .memo-text')).toHaveText('タスクのメモ');
  67 |   });
  68 | }); 
```