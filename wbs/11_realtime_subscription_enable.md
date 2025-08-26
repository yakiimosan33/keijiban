# チケット#11: リアルタイム機能有効化

## 概要
SupabaseのRealtime機能を有効化し、投稿とコメントのリアルタイム更新を可能にする

## タスクタイプ
データベース

## 優先度
高

## ステータス
未着手

## 詳細説明
postsとcommentsテーブルでSupabaseのRealtime Subscriptionを有効化する。これにより、新規投稿やコメントがリアルタイムでブラウザに反映される。

## 受け入れ条件
- [ ] postsテーブルでRealtimeが有効
- [ ] commentsテーブルでRealtimeが有効
- [ ] INSERT操作がブロードキャストされる
- [ ] Realtimeの動作確認が完了

## 作業手順
1. Supabaseダッシュボードを開く
2. Database → Replication設定に移動
3. postsテーブルを選択
4. 「Enable Replication」をONにする
5. 「INSERT」イベントを有効化
6. commentsテーブルでも同様の設定
7. SQL Editorで確認：
```sql
-- Realtimeが有効化されているか確認
SELECT * FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```
8. テストデータを挿入してRealtime動作確認

## 依存関係
- チケット#08: postsテーブル作成
- チケット#09: commentsテーブル作成

## 見積工数
15分

## 担当者
データベース管理者

## 備考
- UPDATE/DELETEイベントは不要（編集・削除機能なし）
- パフォーマンスへの影響を考慮