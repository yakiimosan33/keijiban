# チケット#10: RLSポリシー設定

## 概要
Row Level Security (RLS) ポリシーを設定し、データベースレベルでのアクセス制御を実装する

## タスクタイプ
セキュリティ

## 優先度
高

## ステータス
未着手

## 詳細説明
postsとcommentsテーブルにRLSを有効化し、適切なアクセス制御ポリシーを設定する。匿名ユーザーの読み書き権限を適切に制御する。

## 受け入れ条件
- [ ] RLSが両テーブルで有効化されている
- [ ] posts用のSELECTポリシーが作成されている
- [ ] posts用のINSERTポリシーが作成されている
- [ ] comments用のSELECTポリシーが作成されている
- [ ] comments用のINSERTポリシーが作成されている
- [ ] is_hidden=trueのデータがアクセスできないことを確認

## 作業手順
1. Supabase SQL Editorを開く
2. 以下のSQLを実行：
```sql
-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY posts_select_public ON posts
  FOR SELECT USING (is_hidden = false);

CREATE POLICY posts_insert_public ON posts
  FOR INSERT WITH CHECK (
    is_hidden = false 
    AND length(title) BETWEEN 1 AND 120 
    AND length(body) BETWEEN 1 AND 4000
  );

-- Comments policies  
CREATE POLICY comments_select_public ON comments
  FOR SELECT USING (is_hidden = false);

CREATE POLICY comments_insert_public ON comments
  FOR INSERT WITH CHECK (
    is_hidden = false 
    AND length(body) BETWEEN 1 AND 4000
  );
```
3. ポリシーの動作確認
4. 匿名ユーザーでのアクセステスト

## 依存関係
- チケット#08: postsテーブル作成
- チケット#09: commentsテーブル作成

## 見積工数
20分

## 担当者
セキュリティエンジニア

## 備考
- UPDATE/DELETEは許可しない（投稿後の編集・削除不可）
- is_hiddenフラグで将来的なモデレーション機能に対応