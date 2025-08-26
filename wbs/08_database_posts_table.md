# チケット#08: postsテーブル作成

## 概要
Supabaseデータベースに投稿情報を格納するpostsテーブルを作成する

## タスクタイプ
データベース

## 優先度
高

## ステータス
未着手

## 詳細説明
投稿機能の基盤となるpostsテーブルをSupabaseで作成する。適切な制約とインデックスを設定する。

## 受け入れ条件
- [ ] postsテーブルが作成されている
- [ ] 全カラムが仕様通りに設定されている
- [ ] CHECK制約が設定されている
- [ ] インデックスが作成されている
- [ ] テーブルが正常に動作する

## 作業手順
1. Supabaseダッシュボードを開く
2. SQL Editorで以下を実行：
```sql
CREATE TABLE posts (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title       varchar(120) NOT NULL CHECK(length(title) BETWEEN 1 AND 120),
  body        text NOT NULL CHECK(length(body) BETWEEN 1 AND 4000),
  created_at  timestamptz NOT NULL DEFAULT now(),
  is_hidden   boolean NOT NULL DEFAULT false,
  ip_hash     varchar(64) CHECK (ip_hash ~ '^[0-9a-f]{64}$')
);

CREATE INDEX idx_posts_created_at_desc ON posts (created_at DESC);
CREATE INDEX idx_posts_is_hidden_created_at ON posts (is_hidden, created_at DESC);
```
3. テーブル作成を確認
4. サンプルデータを挿入してテスト

## 依存関係
- Supabaseプロジェクト（keijiban）

## 見積工数
15分

## 担当者
データベース管理者

## 備考
- GENERATED ALWAYS AS IDENTITYでIDを自動生成
- ip_hashは将来のレート制限用（初期はNULL）