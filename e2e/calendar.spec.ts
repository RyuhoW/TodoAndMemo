import { test, expect } from '@playwright/test';

test.describe('Calendar Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // アプリケーションの読み込みを待機
    await page.waitForLoadState('networkidle');
    // カレンダータブに移動
    await page.getByRole('button', { name: 'カレンダー' }).click();
  });

  test('カレンダーの表示と操作', async ({ page }) => {
    // カレンダーのコントロールボタンが表示されていることを確認
    await page.waitForSelector('button:has-text("月表示")', { state: 'visible', timeout: 10000 });
    await expect(page.getByText('月表示')).toBeVisible();
    await expect(page.getByText('週表示')).toBeVisible();
    await expect(page.getByText('日表示')).toBeVisible();
    await expect(page.getByText('リスト表示')).toBeVisible();

    // 週表示に切り替え
    await page.getByText('週表示').click();
    await expect(page.getByText('週表示')).toHaveClass(/active/);

    // 日表示に切り替え
    await page.getByText('日表示').click();
    await expect(page.getByText('日表示')).toHaveClass(/active/);

    // リスト表示に切り替え
    await page.getByText('リスト表示').click();
    await expect(page.getByText('リスト表示')).toHaveClass(/active/);

    // 月表示に戻す
    await page.getByText('月表示').click();
    await expect(page.getByText('月表示')).toHaveClass(/active/);
  });

  test('イベントの表示', async ({ page }) => {
    // Todoタブに移動してTodoを追加
    await page.getByRole('button', { name: 'Todo' }).click();
    await page.waitForSelector('input[placeholder="新しいTodoを入力"]', { state: 'visible', timeout: 10000 });
    await page.getByPlaceholder('新しいTodoを入力').fill('テストTodo');
    await page.getByRole('button', { name: '追加' }).click();

    // メモを追加
    await page.waitForSelector('textarea[placeholder="新しいメモを入力"]', { state: 'visible', timeout: 10000 });
    await page.getByPlaceholder('新しいメモを入力').fill('テストメモ');
    await page.getByRole('button', { name: '追加' }).click();

    // カレンダータブに戻る
    await page.getByRole('button', { name: 'カレンダー' }).click();

    // カレンダーにイベントが表示されていることを確認
    await page.waitForTimeout(1000); // イベントの表示を待機
    await expect(page.getByText('テストTodo')).toBeVisible();
    await expect(page.getByText('テストメモ')).toBeVisible();

    // イベントの色を確認
    const todoEvent = page.getByText('テストTodo').locator('..');
    const noteEvent = page.getByText('テストメモ').locator('..');

    await expect(todoEvent).toHaveCSS('background-color', 'rgb(76, 175, 80)'); // #4CAF50
    await expect(noteEvent).toHaveCSS('background-color', 'rgb(33, 150, 243)'); // #2196F3
  });
}); 