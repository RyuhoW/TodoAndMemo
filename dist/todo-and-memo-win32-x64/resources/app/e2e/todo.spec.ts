import { test, expect } from '@playwright/test';

test.describe('Todo List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // アプリケーションの読み込みを待機
    await page.waitForLoadState('networkidle');
    // Todoタブに移動
    await page.getByRole('button', { name: 'Todo' }).click();
  });

  test('should add a new todo', async ({ page }) => {
    // 新しいタスクを入力
    await page.waitForSelector('input[placeholder="新しいTodoを入力"]', { state: 'visible', timeout: 10000 });
    await page.getByPlaceholder('新しいTodoを入力').fill('新しいタスク');
    await page.getByRole('button', { name: '追加' }).click();
    await expect(page.locator('.todo-item:has-text("新しいタスク")')).toBeVisible();
  });

  test('should toggle todo completion', async ({ page }) => {
    // タスクを追加
    await page.waitForSelector('input[placeholder="新しいTodoを入力"]', { state: 'visible', timeout: 10000 });
    await page.getByPlaceholder('新しいTodoを入力').fill('完了するタスク');
    await page.getByRole('button', { name: '追加' }).click();

    // タスクを完了状態に変更
    await page.waitForSelector('.todo-item:has-text("完了するタスク")', { state: 'visible', timeout: 10000 });
    await page.locator('.todo-item:has-text("完了するタスク") .todo-checkbox').check();
    await expect(page.locator('.todo-item:has-text("完了するタスク") .todo-text')).toHaveClass(/completed/);

    // タスクを未完了状態に戻す
    await page.locator('.todo-item:has-text("完了するタスク") .todo-checkbox').uncheck();
    await expect(page.locator('.todo-item:has-text("完了するタスク") .todo-text')).not.toHaveClass(/completed/);
  });

  test('should delete a todo', async ({ page }) => {
    // タスクを追加
    await page.waitForSelector('input[placeholder="新しいTodoを入力"]', { state: 'visible', timeout: 10000 });
    await page.getByPlaceholder('新しいTodoを入力').fill('削除するタスク');
    await page.getByRole('button', { name: '追加' }).click();

    // タスクが存在することを確認
    await expect(page.locator('.todo-item:has-text("削除するタスク")')).toBeVisible();

    // タスクを削除
    await page.waitForSelector('.todo-item:has-text("削除するタスク") .action-button.delete', { state: 'visible', timeout: 10000 });
    await page.locator('.todo-item:has-text("削除するタスク") .action-button.delete').click();

    // タスクが削除されたことを確認
    await expect(page.locator('.todo-item:has-text("削除するタスク")')).not.toBeVisible();
  });

  test('should add memo to todo', async ({ page }) => {
    // タスクを追加
    await page.waitForSelector('input[placeholder="新しいTodoを入力"]', { state: 'visible', timeout: 10000 });
    await page.getByPlaceholder('新しいTodoを入力').fill('メモ付きタスク');
    await page.getByRole('button', { name: '追加' }).click();

    // メモを追加
    await page.waitForSelector('.todo-item:has-text("メモ付きタスク")', { state: 'visible', timeout: 10000 });
    await page.locator('.todo-item:has-text("メモ付きタスク") .action-button.edit').click();
    await page.locator('.todo-item:has-text("メモ付きタスク") .memo-textarea').fill('タスクのメモ');
    await page.locator('.todo-item:has-text("メモ付きタスク") .button.save').click();

    // メモが表示されていることを確認
    await expect(page.locator('.todo-item:has-text("メモ付きタスク") .memo-text')).toHaveText('タスクのメモ');
  });
}); 