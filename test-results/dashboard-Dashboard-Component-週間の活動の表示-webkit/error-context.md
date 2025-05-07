# Test info

- Name: Dashboard Component >> 週間の活動の表示
- Location: C:\Users\ryuho\SynologyDrive\Projects\TodoAndMemo\e2e\dashboard.spec.ts:46:7

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('input[placeholder="新しいTodoを入力"]') to be visible

    at C:\Users\ryuho\SynologyDrive\Projects\TodoAndMemo\e2e\dashboard.spec.ts:49:16
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
   3 | test.describe('Dashboard Component', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     await page.goto('/');
   6 |     // アプリケーションの読み込みを待機
   7 |     await page.waitForLoadState('networkidle');
   8 |     // ダッシュボードタブに移動
   9 |     await page.getByRole('button', { name: 'ダッシュボード' }).click();
  10 |   });
  11 |
  12 |   test('ダッシュボードの基本表示', async ({ page }) => {
  13 |     // ダッシュボードのタイトルとセクションが表示されていることを確認
  14 |     await page.waitForSelector('h2:has-text("ダッシュボード")', { state: 'visible', timeout: 10000 });
  15 |     await expect(page.getByText('ダッシュボード')).toBeVisible();
  16 |     await expect(page.getByText('Todoの進捗状況')).toBeVisible();
  17 |     await expect(page.getByText('週間の活動')).toBeVisible();
  18 |   });
  19 |
  20 |   test('Todoの進捗状況の表示', async ({ page }) => {
  21 |     // Todoタブに移動してTodoを追加
  22 |     await page.getByRole('button', { name: 'Todo' }).click();
  23 |     await page.waitForSelector('input[placeholder="新しいTodoを入力"]', { state: 'visible', timeout: 10000 });
  24 |     await page.getByPlaceholder('新しいTodoを入力').fill('テストTodo 1');
  25 |     await page.getByRole('button', { name: '追加' }).click();
  26 |     await page.getByPlaceholder('新しいTodoを入力').fill('テストTodo 2');
  27 |     await page.getByRole('button', { name: '追加' }).click();
  28 |
  29 |     // 最初のTodoを完了状態にする
  30 |     await page.waitForSelector('.todo-item:has-text("テストTodo 1")', { state: 'visible', timeout: 10000 });
  31 |     await page.locator('.todo-item:has-text("テストTodo 1") .todo-checkbox').check();
  32 |
  33 |     // ダッシュボードタブに戻る
  34 |     await page.getByRole('button', { name: 'ダッシュボード' }).click();
  35 |
  36 |     // グラフコンテナが表示されていることを確認
  37 |     await page.waitForTimeout(1000); // グラフの描画を待機
  38 |     const chartContainers = await page.locator('.chart-container').all();
  39 |     expect(chartContainers).toHaveLength(2);
  40 |
  41 |     // レスポンシブコンテナが表示されていることを確認
  42 |     const responsiveContainers = await page.locator('.recharts-responsive-container').all();
  43 |     expect(responsiveContainers).toHaveLength(2);
  44 |   });
  45 |
  46 |   test('週間の活動の表示', async ({ page }) => {
  47 |     // Todoタブに移動してTodoとメモを追加
  48 |     await page.getByRole('button', { name: 'Todo' }).click();
> 49 |     await page.waitForSelector('input[placeholder="新しいTodoを入力"]', { state: 'visible', timeout: 10000 });
     |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  50 |     await page.getByPlaceholder('新しいTodoを入力').fill('テストTodo');
  51 |     await page.getByRole('button', { name: '追加' }).click();
  52 |     await page.waitForSelector('textarea[placeholder="新しいメモを入力"]', { state: 'visible', timeout: 10000 });
  53 |     await page.getByPlaceholder('新しいメモを入力').fill('テストメモ');
  54 |     await page.getByRole('button', { name: '追加' }).click();
  55 |
  56 |     // ダッシュボードタブに戻る
  57 |     await page.getByRole('button', { name: 'ダッシュボード' }).click();
  58 |
  59 |     // 週間の活動グラフが表示されていることを確認
  60 |     await page.waitForTimeout(1000); // グラフの描画を待機
  61 |     await expect(page.getByText('週間の活動')).toBeVisible();
  62 |     const weeklyChart = page.locator('.chart-container').nth(1);
  63 |     await expect(weeklyChart).toBeVisible();
  64 |   });
  65 | }); 
```