# Test info

- Name: Calendar Component >> イベントの表示
- Location: C:\Users\ryuho\SynologyDrive\Projects\TodoAndMemo\e2e\calendar.spec.ts:37:7

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('input[placeholder="新しいTodoを入力"]') to be visible

    at C:\Users\ryuho\SynologyDrive\Projects\TodoAndMemo\e2e\calendar.spec.ts:40:16
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
   3 | test.describe('Calendar Component', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     await page.goto('/');
   6 |     // アプリケーションの読み込みを待機
   7 |     await page.waitForLoadState('networkidle');
   8 |     // カレンダータブに移動
   9 |     await page.getByRole('button', { name: 'カレンダー' }).click();
  10 |   });
  11 |
  12 |   test('カレンダーの表示と操作', async ({ page }) => {
  13 |     // カレンダーのコントロールボタンが表示されていることを確認
  14 |     await page.waitForSelector('button:has-text("月表示")', { state: 'visible', timeout: 10000 });
  15 |     await expect(page.getByText('月表示')).toBeVisible();
  16 |     await expect(page.getByText('週表示')).toBeVisible();
  17 |     await expect(page.getByText('日表示')).toBeVisible();
  18 |     await expect(page.getByText('リスト表示')).toBeVisible();
  19 |
  20 |     // 週表示に切り替え
  21 |     await page.getByText('週表示').click();
  22 |     await expect(page.getByText('週表示')).toHaveClass(/active/);
  23 |
  24 |     // 日表示に切り替え
  25 |     await page.getByText('日表示').click();
  26 |     await expect(page.getByText('日表示')).toHaveClass(/active/);
  27 |
  28 |     // リスト表示に切り替え
  29 |     await page.getByText('リスト表示').click();
  30 |     await expect(page.getByText('リスト表示')).toHaveClass(/active/);
  31 |
  32 |     // 月表示に戻す
  33 |     await page.getByText('月表示').click();
  34 |     await expect(page.getByText('月表示')).toHaveClass(/active/);
  35 |   });
  36 |
  37 |   test('イベントの表示', async ({ page }) => {
  38 |     // Todoタブに移動してTodoを追加
  39 |     await page.getByRole('button', { name: 'Todo' }).click();
> 40 |     await page.waitForSelector('input[placeholder="新しいTodoを入力"]', { state: 'visible', timeout: 10000 });
     |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  41 |     await page.getByPlaceholder('新しいTodoを入力').fill('テストTodo');
  42 |     await page.getByRole('button', { name: '追加' }).click();
  43 |
  44 |     // メモを追加
  45 |     await page.waitForSelector('textarea[placeholder="新しいメモを入力"]', { state: 'visible', timeout: 10000 });
  46 |     await page.getByPlaceholder('新しいメモを入力').fill('テストメモ');
  47 |     await page.getByRole('button', { name: '追加' }).click();
  48 |
  49 |     // カレンダータブに戻る
  50 |     await page.getByRole('button', { name: 'カレンダー' }).click();
  51 |
  52 |     // カレンダーにイベントが表示されていることを確認
  53 |     await page.waitForTimeout(1000); // イベントの表示を待機
  54 |     await expect(page.getByText('テストTodo')).toBeVisible();
  55 |     await expect(page.getByText('テストメモ')).toBeVisible();
  56 |
  57 |     // イベントの色を確認
  58 |     const todoEvent = page.getByText('テストTodo').locator('..');
  59 |     const noteEvent = page.getByText('テストメモ').locator('..');
  60 |
  61 |     await expect(todoEvent).toHaveCSS('background-color', 'rgb(76, 175, 80)'); // #4CAF50
  62 |     await expect(noteEvent).toHaveCSS('background-color', 'rgb(33, 150, 243)'); // #2196F3
  63 |   });
  64 | }); 
```