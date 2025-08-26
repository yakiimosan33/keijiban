# チケット#35: E2Eテスト作成

## 概要
ユーザーシナリオに基づいたEnd-to-Endテストを作成する

## タスクタイプ
テスト

## 優先度
中

## ステータス
未着手

## 詳細説明
Playwright/Cypressを使用して、実際のユーザー操作をシミュレートするE2Eテストを作成する。

## 受け入れ条件
- [ ] 投稿作成フローのテスト
- [ ] コメント投稿フローのテスト
- [ ] ページネーションのテスト
- [ ] リアルタイム更新のテスト
- [ ] エラー処理のテスト
- [ ] クロスブラウザテスト

## 作業手順
1. Playwrightセットアップ：
```bash
npm init playwright@latest
```
2. 基本シナリオテスト：
```typescript
// post-creation.spec.ts
test('新規投稿を作成できる', async ({ page }) => {
  await page.goto('/')
  await page.click('button[aria-label="新規投稿"]')
  await page.fill('input[name="title"]', 'テスト投稿')
  await page.fill('textarea[name="body"]', 'テスト本文')
  await page.click('button[type="submit"]')
  
  await expect(page.locator('text=投稿を受け付けました')).toBeVisible()
  await expect(page.locator('text=テスト投稿')).toBeVisible()
})
```
3. コメントフローテスト
4. リアルタイムテスト（複数ブラウザ）
5. モバイル表示テスト
6. CI統合

## 依存関係
- 全機能の実装完了

## 見積工数
90分

## 担当者
QAエンジニア

## 備考
- ヘッドレスモードでCI実行
- スクリーンショット保存