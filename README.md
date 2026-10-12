# Memo

React と Express、MongoDB で作ったメモアプリです。メモの作成・整理に加えて、公開メモの閲覧や「いいね」ができます。

## 主な機能

- アカウント登録、ログイン、ログアウト
- メモの作成、閲覧、編集、削除
- タグ検索とピン留め
- メモごとの公開・非公開設定（新規メモは非公開）
- 公開メモ一覧、検索、タグ絞り込み、いいね
- 使い方ページ（`/usage`）

## 必要なもの

- Node.js と npm
- MongoDB（ローカルまたは接続可能なMongoDBインスタンス）

## セットアップ

バックエンドの環境変数ファイルを用意します。

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

`backend/.env` の `MONGO_URI` を利用するMongoDBの接続先に合わせて設定してください。`JWT_SECRET` には推測されにくい秘密値を設定します。

`frontend/.env` の `VITE_API_BASE_URL` はローカル開発では `/api` のまま使います。

フロントエンドのAPI接続先は `VITE_API_BASE_URL` で指定できます。ローカル開発では `/api`（Viteのプロキシ）を使います。デプロイ時はフロントエンドのホスティング設定に、バックエンドURLと `/api` を含めた値（例: `https://api.example.com/api`）を登録して再ビルドしてください。この値はブラウザーに配信されるため、秘密情報を設定しないでください。バックエンドの `CORS_ORIGIN` にはフロントエンドの公開URLを設定します。

フロントエンドとバックエンドが別サイトで、ログイン後もAPIが401を返す場合は、バックエンドの `COOKIE_SAME_SITE` を `none` に設定してください。この場合CookieはHTTPSでのみ送信されます。`CORS_ORIGIN` には引き続きフロントエンドのURLを正確に設定してください。

依存パッケージをインストールします。

```powershell
cd backend
npm install
cd ../frontend
npm install
```

## 開発サーバーの起動

MongoDBを起動したうえで、プロジェクトルートからターミナルを2つ開きます。

バックエンド:

```powershell
cd backend
npm run dev
```

フロントエンド:

```powershell
cd frontend
npm run dev
```

ブラウザで Vite が表示するURL（通常は `http://localhost:5173`）を開きます。フロントエンドの `/api` リクエストは開発中に `http://localhost:3000` へ転送されます。

## 画面

| パス | 内容 | ログイン |
| --- | --- | --- |
| `/` | ホーム | 不要 |
| `/usage` | アプリの使い方 | 不要 |
| `/public-memos` | 公開メモ一覧 | 閲覧は不要、いいねには必要 |
| `/login` | ログイン | 不要 |
| `/register` | 新規登録 | 不要 |
| `/memos` | 自分のメモ一覧 | 必要 |
| `/memos/new` | メモ作成 | 必要 |
| `/memos/:memoId/edit` | メモ編集 | 必要 |

## チェックコマンド

```powershell
cd frontend
npm run lint
npm run build
```
