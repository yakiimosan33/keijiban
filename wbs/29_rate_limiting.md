# チケット#29: レート制限機能実装

## 概要
APIエンドポイントにレート制限を実装し、スパムを防止する

## タスクタイプ
バックエンド開発

## 優先度
高

## ステータス
未着手

## 詳細説明
@nestjs/throttlerを使用してレート制限を実装する。投稿は3回/分、コメントは10回/分の制限を設定する。

## 受け入れ条件
- [ ] ThrottlerModuleが設定されている
- [ ] 投稿APIに3回/分の制限
- [ ] コメントAPIに10回/分の制限
- [ ] 制限超過時に429エラー
- [ ] IP単位での制限が動作
- [ ] エラーメッセージが日本語

## 作業手順
1. パッケージインストール：
```bash
npm install @nestjs/throttler
```
2. app.module.tsに設定追加：
```typescript
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
})
```
3. PostsControllerに個別設定：
```typescript
@Post()
@Throttle(3, 60) // 3回/分
create(@Body() createPostDto: CreatePostDto) {
  // ...
}
```
4. CommentsControllerに個別設定：
```typescript
@Post()
@Throttle(10, 60) // 10回/分
create() {
  // ...
}
```
5. カスタムエラーメッセージ実装
6. テスト実施

## 依存関係
- チケット#26: Posts APIエンドポイント
- チケット#28: Comments APIエンドポイント

## 見積工数
30分

## 担当者
バックエンド開発者

## 備考
- IPアドレスベースの制限
- プロキシ環境での動作確認