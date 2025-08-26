# チケット#19: コメント一覧表示実装

## 概要
投稿詳細ページでコメント一覧を表示するコンポーネントを作成する

## タスクタイプ
フロントエンド開発

## 優先度
高

## ステータス
未着手

## 詳細説明
投稿に紐づくコメントを時系列順（古い順）に表示する。コメントがない場合は「コメントはまだありません」と表示する。

## 受け入れ条件
- [ ] CommentList.tsxが作成されている
- [ ] CommentItem.tsxが作成されている
- [ ] コメントが古い順に表示される
- [ ] 投稿時刻が表示される
- [ ] 空状態の表示がある
- [ ] コメント数が表示される

## 作業手順
1. components/comments/CommentList.tsx作成
2. components/comments/CommentItem.tsx作成
3. コメントデータ取得：
```typescript
const { data: comments } = await supabase
  .from('comments')
  .select('*')
  .eq('post_id', postId)
  .order('created_at', { ascending: true })
```
4. CommentItemコンポーネント実装：
   - コメント本文表示
   - 投稿時刻表示（相対時刻）
   - 連番表示（#1, #2...）
5. CommentListコンポーネント実装：
   - コメント一覧レンダリング
   - コメント数ヘッダー
   - 空状態処理
6. スタイリング調整

## 依存関係
- チケット#09: commentsテーブル作成
- チケット#18: 投稿詳細ページ実装

## 見積工数
40分

## 担当者
フロントエンド開発者

## 備考
- 改行文字を適切に処理（\n → <br>）
- 長文コメントの表示対応