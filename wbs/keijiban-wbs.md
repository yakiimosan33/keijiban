# バイブコーディング掲示板 WBS (Work Breakdown Structure)

## 1.0 プロジェクト初期設定
### 1.1 開発環境構築
- 1.1.1 リポジトリ作成
  - GitHub新規リポジトリ作成（vibe-board）
  - .gitignore設定
- 1.1.2 フロントエンド環境
  - Next.js (App Router) 初期化
  - Tailwind CSS設定
  - ESLint/Prettier設定
- 1.1.3 バックエンド環境  
  - NestJS プロジェクト初期化
  - TypeORM設定
  - Swagger設定

### 1.2 Supabase設定
- 1.2.1 プロジェクト作成
  - Supabaseプロジェクト作成（keijiban）
  - 匿名アクセス許可設定
- 1.2.2 環境変数設定
  - .env.local作成
  - Supabase URL/APIキー設定
- 1.2.3 クライアント設定
  - Supabaseクライアント作成（lib/supabase.ts）
  - TypeScript型定義生成

### 1.3 デプロイ環境
- 1.3.1 Vercelデプロイ
  - プロジェクト連携
  - 環境変数設定
  - 開発ブランチ連携確認

## 2.0 データベース設計・実装
### 2.1 テーブル作成
- 2.1.1 postsテーブル
  - スキーマ定義（id, title, body, created_at, is_hidden, ip_hash）
  - インデックス作成
  - CHECK制約実装
- 2.1.2 commentsテーブル
  - スキーマ定義（id, post_id, body, created_at, is_hidden, ip_hash）
  - 外部キー制約設定
  - インデックス作成

### 2.2 セキュリティ設定
- 2.2.1 RLS (Row Level Security)
  - posts用RLSポリシー作成
  - comments用RLSポリシー作成
  - アクセス権限テスト
- 2.2.2 リアルタイム設定
  - postsテーブルrealtime有効化
  - commentsテーブルrealtime有効化

### 2.3 マイグレーション
- 2.3.1 初期マイグレーション
  - マイグレーションファイル作成
  - ロールバックスクリプト準備

## 3.0 フロントエンド実装
### 3.1 基本レイアウト
- 3.1.1 共通コンポーネント
  - Header.tsx（ロゴ、タイトル、新規投稿ボタン）
  - Footer.tsx（利用規約、プライバシーポリシーリンク）
  - Layout.tsx（レイアウトラッパー）
- 3.1.2 ページ構造
  - app/layout.tsx（ルートレイアウト）
  - app/not-found.tsx（404ページ）

### 3.2 投稿機能
- 3.2.1 投稿一覧
  - app/page.tsx（メインページ）
  - PostList.tsx（投稿一覧コンテナ）
  - PostCard.tsx（投稿カードコンポーネント）
  - ページネーション実装（20件/ページ）
- 3.2.2 投稿作成
  - PostForm.tsx（投稿フォーム）
  - バリデーション（タイトル1-120文字、本文1-4000文字）
  - モーダル実装（PC）/インライン（モバイル）
- 3.2.3 投稿詳細
  - app/post/[id]/page.tsx
  - PostDetail.tsx（詳細表示コンポーネント）

### 3.3 コメント機能
- 3.3.1 コメント表示
  - CommentList.tsx（コメント一覧）
  - CommentItem.tsx（個別コメント）
  - 時系列順ソート（古い順）
- 3.3.2 コメント投稿
  - CommentForm.tsx（コメントフォーム）
  - バリデーション（1-4000文字）
  - 非遷移型フォーム実装

### 3.4 リアルタイム機能
- 3.4.1 投稿リアルタイム
  - 新規投稿のSubscription
  - 投稿一覧の自動更新
- 3.4.2 コメントリアルタイム
  - 新規コメントのSubscription  
  - コメント一覧の自動更新

### 3.5 共通UI部品
- 3.5.1 フィードバック
  - Toast.tsx（通知システム）
  - LoadingSpinner.tsx（ローディング表示）
  - ErrorMessage.tsx（エラー表示）
- 3.5.2 フォーム部品
  - TextInput.tsx（テキスト入力）
  - TextArea.tsx（複数行入力）
  - Button.tsx（ボタンコンポーネント）
- 3.5.3 その他
  - Modal.tsx（モーダルダイアログ）
  - Pagination.tsx（ページネーション）

## 4.0 バックエンド実装（NestJS）
### 4.1 基本設定
- 4.1.1 モジュール構成
  - AppModule設定
  - DatabaseModule（TypeORM）
  - ConfigModule（環境変数）
- 4.1.2 共通機能
  - ExceptionFilter（エラーハンドリング）
  - LoggingInterceptor（ログ記録）
  - ValidationPipe（入力検証）

### 4.2 Posts API
- 4.2.1 PostsModule
  - PostsController
  - PostsService
  - PostsRepository
- 4.2.2 エンドポイント
  - GET /posts（一覧取得）
  - GET /posts/:id（詳細取得）
  - POST /posts（新規作成）
- 4.2.3 DTO/Entity
  - Post Entity
  - CreatePostDto
  - PostResponseDto

### 4.3 Comments API
- 4.3.1 CommentsModule
  - CommentsController
  - CommentsService
  - CommentsRepository
- 4.3.2 エンドポイント
  - GET /posts/:postId/comments（コメント一覧）
  - POST /posts/:postId/comments（コメント投稿）
- 4.3.3 DTO/Entity
  - Comment Entity
  - CreateCommentDto
  - CommentResponseDto

### 4.4 セキュリティ機能
- 4.4.1 レート制限
  - ThrottlerModule設定
  - 投稿：3回/分/IP
  - コメント：10回/分/IP
- 4.4.2 セキュリティヘッダー
  - Helmet設定
  - CORS設定
- 4.4.3 IPハッシュ化
  - SHA-256ハッシュ実装
  - ソルト管理

## 5.0 統合・品質保証
### 5.1 スタイリング・UI/UX
- 5.1.1 デザイントークン
  - カラーパレット（Zinc + Indigo-500）
  - タイポグラフィ設定
  - スペーシング規則
- 5.1.2 レスポンシブ対応
  - モバイルファースト設計
  - ブレークポイント設定（sm/md/lg）
  - タッチターゲット最適化（44px以上）
- 5.1.3 アクセシビリティ
  - WCAG AA準拠
  - フォーカスリング実装
  - ARIA属性設定

### 5.2 パフォーマンス最適化
- 5.2.1 フロントエンド
  - コード分割
  - 画像最適化
  - バンドルサイズ削減
- 5.2.2 バックエンド
  - クエリ最適化（100ms以内）
  - キャッシュ戦略
  - コネクションプーリング
- 5.2.3 データベース
  - インデックス最適化
  - N+1問題対策

### 5.3 テスト
- 5.3.1 単体テスト
  - サービス層テスト
  - コンポーネントテスト
  - 80%以上カバレッジ
- 5.3.2 統合テスト
  - API統合テスト
  - データベース統合テスト
- 5.3.3 E2Eテスト
  - 主要ユーザーフロー
  - クロスブラウザテスト

### 5.4 ドキュメント
- 5.4.1 API仕様書
  - Swagger自動生成
  - エンドポイント説明
- 5.4.2 開発ガイド
  - README.md更新
  - 環境構築手順
  - デプロイ手順

## 6.0 デプロイ・運用準備
### 6.1 本番環境設定
- 6.1.1 環境変数
  - 本番用環境変数設定
  - シークレット管理
- 6.1.2 ビルド設定
  - 本番ビルド最適化
  - ソースマップ設定

### 6.2 監視・ログ
- 6.2.1 エラー監視
  - エラートラッキング設定
  - アラート設定
- 6.2.2 パフォーマンス監視
  - APMツール設定
  - メトリクス収集

### 6.3 バックアップ・復旧
- 6.3.1 データバックアップ
  - 自動バックアップ設定
  - PITR（Point-In-Time Recovery）
- 6.3.2 災害復旧計画
  - リストア手順書
  - RTO/RPO定義

## 7.0 リリース・検証
### 7.1 最終確認
- 7.1.1 機能確認
  - 全機能動作確認
  - クロスブラウザ確認
  - モバイル動作確認
- 7.1.2 セキュリティ確認
  - 脆弱性スキャン
  - RLS動作確認

### 7.2 本番リリース
- 7.2.1 デプロイ実行
  - Vercelデプロイ
  - バックエンドデプロイ
  - DNS設定
- 7.2.2 動作確認
  - スモークテスト
  - 負荷テスト

### 7.3 リリース後対応
- 7.3.1 ユーザー受け入れ
  - ベータユーザーテスト
  - フィードバック収集
- 7.3.2 改善対応
  - バグ修正
  - パフォーマンスチューニング