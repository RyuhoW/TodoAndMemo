import { test, expect } from '@playwright/test';

test.describe('Dashboard Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // アプリケーションの読み込みを待機
    await page.waitForLoadState('networkidle');
    // ダッシュボードタブに移動
    await page.getByRole('button', { name: 'ダッシュボード' }).click();
  });

  test('ダッシュボードの基本表示', async ({ page }) => {
    // ダッシュボードのタイトルとセクションが表示されていることを確認
    await page.waitForSelector('h2:has-text("ダッシュボード")', { state: 'visible', timeout: 10000 });
    await expect(page.getByText('ダッシュボード')).toBeVisible();
    await expect(page.getByText('Todoの進捗状況')).toBeVisible();
    await expect(page.getByText('週間の活動')).toBeVisible();
  });

  test('Todoの進捗状況の表示', async ({ page }) => {
    // Todoタブに移動してTodoを追加
    await page.getByRole('button', { name: 'Todo' }).click();
    await page.waitForSelector('input[placeholder="新しいTodoを入力"]', { state: 'visible', timeout: 10000 });
    await page.getByPlaceholder('新しいTodoを入力').fill('テストTodo 1');
    await page.getByRole('button', { name: '追加' }).click();
    await page.getByPlaceholder('新しいTodoを入力').fill('テストTodo 2');
    await page.getByRole('button', { name: '追加' }).click();

    // 最初のTodoを完了状態にする
    await page.waitForSelector('.todo-item:has-text("テストTodo 1")', { state: 'visible', timeout: 10000 });
    await page.locator('.todo-item:has-text("テストTodo 1") .todo-checkbox').check();

    // ダッシュボードタブに戻る
    await page.getByRole('button', { name: 'ダッシュボード' }).click();

    // グラフコンテナが表示されていることを確認
    await page.waitForTimeout(1000); // グラフの描画を待機
    const chartContainers = await page.locator('.chart-container').all();
    expect(chartContainers).toHaveLength(2);

    // レスポンシブコンテナが表示されていることを確認
    const responsiveContainers = await page.locator('.recharts-responsive-container').all();
    expect(responsiveContainers).toHaveLength(2);
  });

  test('週間の活動の表示', async ({ page }) => {
    // Todoタブに移動してTodoとメモを追加
    await page.getByRole('button', { name: 'Todo' }).click();
    await page.waitForSelector('input[placeholder="新しいTodoを入力"]', { state: 'visible', timeout: 10000 });
    await page.getByPlaceholder('新しいTodoを入力').fill('テストTodo');
    await page.getByRole('button', { name: '追加' }).click();
    await page.waitForSelector('textarea[placeholder="新しいメモを入力"]', { state: 'visible', timeout: 10000 });
    await page.getByPlaceholder('新しいメモを入力').fill('テストメモ');
    await page.getByRole('button', { name: '追加' }).click();

    // ダッシュボードタブに戻る
    await page.getByRole('button', { name: 'ダッシュボード' }).click();

    // 週間の活動グラフが表示されていることを確認
    await page.waitForTimeout(1000); // グラフの描画を待機
    await expect(page.getByText('週間の活動')).toBeVisible();
    const weeklyChart = page.locator('.chart-container').nth(1);
    await expect(weeklyChart).toBeVisible();
  });
}); 