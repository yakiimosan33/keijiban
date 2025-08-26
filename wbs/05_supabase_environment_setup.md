# チケット#05: Supabase環境変数設定

## 概要
SupabaseプロジェクトのURL、APIキーを取得し、環境変数ファイルに設定する

## タスクタイプ
環境構築

## 優先度
高

## ステータス
未着手

## 詳細説明
既存のSupabaseプロジェクト（keijiban）から接続情報を取得し、フロントエンドとバックエンドの環境変数ファイルに設定する。

## 受け入れ条件
- [ ] Supabase URLが取得されている
- [ ] Supabase Anon Keyが取得されている
- [ ] .env.localファイルが作成されている
- [ ] 環境変数が正しく設定されている
- [ ] .env.exampleファイルが作成されている
- [ ] .gitignoreに.env.localが追加されている

## 作業手順
1. Supabaseダッシュボードにログイン
2. プロジェクト「keijiban」の設定画面を開く
3. API設定からURLとAnon Keyを取得
4. フロントエンドに.env.localファイルを作成
5. 以下の環境変数を設定：
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
6. .env.exampleファイルを作成（値なしのテンプレート）
7. .gitignoreに.env.localが含まれていることを確認

## 依存関係
- Supabaseプロジェクト（keijiban）が作成済み

## 見積工数
15分

## 担当者
開発者

## 備考
- Service Role Keyは使用しない（セキュリティ上の理由）
- 環境変数名はNEXT_PUBLIC_プレフィックスを使用