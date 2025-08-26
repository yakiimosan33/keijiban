# チケット#16: 投稿フォームコンポーネント作成

## 概要
新規投稿を作成するためのフォームコンポーネントを実装する

## タスクタイプ
フロントエンド開発

## 優先度
高

## ステータス
未着手

## 詳細説明
投稿作成フォームを実装する。PCではモーダル、モバイルではインライン表示とする。タイトルと本文の入力フィールドを含む。

## 受け入れ条件
- [ ] PostForm.tsxが作成されている
- [ ] タイトル入力フィールド（最大120文字）
- [ ] 本文入力フィールド（最大4000文字）
- [ ] 文字数カウンター表示
- [ ] 投稿ボタン
- [ ] キャンセルボタン（モーダル時）
- [ ] Supabaseへのデータ送信が動作

## 作業手順
1. components/posts/PostForm.tsx作成
2. フォーム状態管理（useState）：
```typescript
const [title, setTitle] = useState('')
const [body, setBody] = useState('')
const [isSubmitting, setIsSubmitting] = useState(false)
```
3. 入力フィールド実装：
   - タイトル（input type="text"）
   - 本文（textarea）
   - 文字数表示
4. 送信処理実装：
```typescript
const { data, error } = await supabase
  .from('posts')
  .insert([{ title, body }])
```
5. モーダル/インライン切り替え
6. スタイリング実装

## 依存関係
- チケット#06: Supabaseクライアント設定
- チケット#08: postsテーブル作成

## 見積工数
60分

## 担当者
フロントエンド開発者

## 備考
- リアルタイムバリデーション実装
- 送信中はボタンを無効化