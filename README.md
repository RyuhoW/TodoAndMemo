Reactで作ったTodoとMemo機能に電卓機能を加えたアプリケーションです。
テストツールはjestとReact Testing Libraryを使用し、E2Eテストにplaywrightを採用しています。

## 開発環境での実行

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run start
```

## アプリケーションのビルドと実行

```bash
# アプリケーションのビルド
npm run electron-pack

# ビルドされたアプリケーションの実行
cd dist/todo-and-memo-win32-x64
./todo-and-memo.exe
```

## テストの実行

```bash
# 単体テスト
npm run test:unit

# 結合テスト
npm run test:integration

# E2Eテスト（Playwright）
npm run test:e2e
```

