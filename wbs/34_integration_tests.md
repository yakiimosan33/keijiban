# チケット#34: 統合テスト作成

## 概要
APIエンドポイントとデータベース操作の統合テストを作成する

## タスクタイプ
テスト

## 優先度
中

## ステータス
未着手

## 詳細説明
実際のデータベースを使用した統合テストを作成し、APIの動作を検証する。

## 受け入れ条件
- [ ] API全エンドポイントのテスト
- [ ] データベース操作のテスト
- [ ] エラーケースのテスト
- [ ] レート制限のテスト
- [ ] テストデータベースの使用

## 作業手順
1. テスト環境設定：
```typescript
// test/setup.ts
beforeAll(async () => {
  // テストDBに接続
  await setupTestDatabase()
})

afterAll(async () => {
  // クリーンアップ
  await cleanupTestDatabase()
})
```
2. APIテスト作成：
```typescript
// posts.e2e-spec.ts
describe('Posts API', () => {
  it('POST /posts', async () => {
    const response = await request(app.getHttpServer())
      .post('/posts')
      .send({ title: 'テスト', body: '本文' })
      .expect(201)
    
    expect(response.body).toHaveProperty('id')
  })
})
```
3. データベーステスト
4. トランザクションテスト
5. 並行処理テスト

## 依存関係
- チケット#33: 単体テスト作成

## 見積工数
90分

## 担当者
QAエンジニア

## 備考
- テスト用Supabaseプロジェクト使用
- シードデータの準備