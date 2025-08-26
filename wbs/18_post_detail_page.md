# チケット#18: 投稿詳細ページ実装

## 概要
個別の投稿とそのコメント一覧を表示する詳細ページを実装する

## タスクタイプ
フロントエンド開発

## 優先度
高

## ステータス
未着手

## 詳細説明
app/post/[id]/page.tsxに投稿詳細ページを実装する。投稿の全文とコメント一覧を表示する。

## 受け入れ条件
- [ ] 動的ルーティング（/post/[id]）が設定されている
- [ ] 投稿の全情報が表示される
- [ ] コメント一覧が表示される
- [ ] 404処理（投稿が存在しない場合）
- [ ] PostDetailコンポーネントが作成されている
- [ ] メタデータ（title等）が設定されている

## 作業手順
1. app/post/[id]/page.tsx作成
2. components/posts/PostDetail.tsx作成
3. パラメータからIDを取得：
```typescript
export default async function PostPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const postId = params.id
}
```
4. 投稿データ取得：
```typescript
const { data: post } = await supabase
  .from('posts')
  .select('*')
  .eq('id', postId)
  .single()
```
5. 404処理実装
6. レイアウト実装：
   - タイトル表示
   - 本文表示（改行対応）
   - 投稿日時表示
7. コメントセクション配置

## 依存関係
- チケット#06: Supabaseクライアント設定
- チケット#08: postsテーブル作成

## 見積工数
45分

## 担当者
フロントエンド開発者

## 備考
- SEO対策（メタタグ設定）
- OGP対応は次フェーズ