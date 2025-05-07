import { test, expect } from '@playwright/test';

test.describe('Todo List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should add a new todo', async ({ page }) => {
    // 新しいタスクを入力
    await page.fill('input[placeholder="新しいタスクを入力"]', '新しいタスク');
    await page.click('button:has-text("追加")');

    // タスクが追加されたことを確認
    await expect(page.locator('.todo-item')).toContainText('新しいタスク');
  });

  test('should toggle todo completion', async ({ page }) => {
    // タスクを追加
    await page.fill('input[placeholder="新しいタスクを入力"]', '完了するタスク');
    await page.click('button:has-text("追加")');

    // タスクを完了状態に変更
    await page.click('.todo-item:has-text("完了するタスク") .checkbox');
    await expect(page.locator('.todo-item:has-text("完了するタスク")')).toHaveClass(/completed/);

    // タスクを未完了状態に戻す
    await page.click('.todo-item:has-text("完了するタスク") .checkbox');
    await expect(page.locator('.todo-item:has-text("完了するタスク")')).not.toHaveClass(/completed/);
  });

  test('should delete a todo', async ({ page }) => {
    // タスクを追加
    await page.fill('input[placeholder="新しいタスクを入力"]', '削除するタスク');
    await page.click('button:has-text("追加")');

    // タスクが存在することを確認
    await expect(page.locator('.todo-item:has-text("削除するタスク")')).toBeVisible();

    // タスクを削除
    await page.click('.todo-item:has-text("削除するタスク") .delete-button');

    // タスクが削除されたことを確認
    await expect(page.locator('.todo-item:has-text("削除するタスク")')).not.toBeVisible();
  });

  test('should add memo to todo', async ({ page }) => {
    // タスクを追加
    await page.fill('input[placeholder="新しいタスクを入力"]', 'メモ付きタスク');
    await page.click('button:has-text("追加")');

    // メモを追加
    await page.click('.todo-item:has-text("メモ付きタスク") .memo-button');
    await page.fill('.memo-input', 'これはテストメモです');
    await page.click('.memo-save-button');

    // メモが追加されたことを確認
    await expect(page.locator('.todo-item:has-text("メモ付きタスク") .memo')).toContainText('これはテストメモです');
  });
}); 