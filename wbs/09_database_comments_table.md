# チケット#09: commentsテーブル作成

## 概要
コメント情報を格納するcommentsテーブルを作成し、postsテーブルとの関連を設定する

## タスクタイプ
データベース

## 優先度
高

## ステータス
未着手

## 詳細説明
コメント機能のためのcommentsテーブルを作成する。postsテーブルとの外部キー制約を設定し、適切なインデックスを追加する。
**仕様変更**: コメント者名（username）フィールドを追加し、任意で名前を入力できるようにする。

## 受け入れ条件
- [ ] commentsテーブルが作成されている
- [ ] 外部キー制約が設定されている
- [ ] usernameカラムが追加されている
- [ ] CHECK制約が設定されている
- [ ] インデックスが作成されている
- [ ] postsとの関連が正しく機能する

## 作業手順
1. Supabaseダッシュボードを開く
2. SQL Editorで以下を実行：
```sql
CREATE TABLE comments (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id     bigint NOT NULL REFERENCES posts(id),
  username    varchar(50) CHECK(username IS NULL OR length(username) BETWEEN 1 AND 50),
  body        text NOT NULL CHECK(length(body) BETWEEN 1 AND 4000),
  created_at  timestamptz NOT NULL DEFAULT now(),
  is_hidden   boolean NOT NULL DEFAULT false,
  ip_hash     varchar(64) CHECK (ip_hash ~ '^[0-9a-f]{64}$')
);

CREATE INDEX idx_comments_post_id_created_at ON comments (post_id, created_at DESC);
```
3. テーブル作成を確認
4. 外部キー制約の動作確認
5. サンプルコメントを挿入してテスト

## 依存関係
- チケット#08: postsテーブル作成

## 見積工数
15分

## 担当者
データベース管理者

## 備考
- post_idで投稿と紐付け
- コメントは時系列順（古い順）で表示予定
- usernameは任意入力（NULL許可）、最大50文字まで
- 名前未入力の場合は「名無しさん」などのデフォルト表示をフロントエンドで処理