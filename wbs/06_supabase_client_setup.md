# チケット#06: Supabaseクライアント設定

## 概要
フロントエンドでSupabaseクライアントを初期化し、TypeScript型定義を生成する

## タスクタイプ
開発

## 優先度
高

## ステータス
未着手

## 詳細説明
Supabaseクライアントライブラリをインストールし、接続設定を行う。データベーススキーマからTypeScript型定義を自動生成する。

## 受け入れ条件
- [ ] @supabase/supabase-jsがインストールされている
- [ ] lib/supabase.tsファイルが作成されている
- [ ] クライアントが正しく初期化されている
- [ ] TypeScript型定義が生成されている
- [ ] 型安全なクライアントが利用可能

## 作業手順
1. `npm install @supabase/supabase-js`を実行
2. lib/supabase.tsファイルを作成
3. Supabaseクライアントを初期化：
   ```typescript
   import { createClient } from '@supabase/supabase-js'
   
   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   
   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```
4. Supabase CLIをインストール
5. `npx supabase gen types typescript`で型定義生成
6. 生成された型をクライアントに適用

## 依存関係
- チケット#05: Supabase環境変数設定

## 見積工数
20分

## 担当者
フロントエンド開発者

## 備考
- シングルトンパターンでクライアントを管理
- リアルタイム機能の設定も含む