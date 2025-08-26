# チケット#33: 単体テスト作成

## 概要
フロントエンドとバックエンドの主要機能に対する単体テストを作成する

## タスクタイプ
テスト

## 優先度
中

## ステータス
未着手

## 詳細説明
Jest/React Testing Library/NestJS Testingを使用して単体テストを作成する。80%以上のカバレッジを目標とする。

## 受け入れ条件
- [ ] フロントエンドコンポーネントのテスト
- [ ] バックエンドサービスのテスト
- [ ] バリデーションのテスト
- [ ] エラーハンドリングのテスト
- [ ] カバレッジ80%以上
- [ ] CIで自動実行される

## 作業手順
1. フロントエンドテスト作成：
```typescript
// PostCard.test.tsx
describe('PostCard', () => {
  it('タイトルが表示される', () => {
    render(<PostCard {...mockPost} />)
    expect(screen.getByText(mockPost.title)).toBeInTheDocument()
  })
  
  it('本文が省略表示される', () => {
    // 100文字以上の場合...で省略
  })
})
```
2. バックエンドテスト作成：
```typescript
// posts.service.spec.ts
describe('PostsService', () => {
  it('投稿一覧を取得できる', async () => {
    const posts = await service.findAll()
    expect(posts).toHaveLength(20)
  })
})
```
3. バリデーションテスト
4. モックの作成
5. カバレッジ確認
6. GitHub Actionsに追加

## 依存関係
- 主要機能の実装完了

## 見積工数
120分

## 担当者
QAエンジニア

## 備考
- TDD/BDDアプローチ
- スナップショットテストも検討