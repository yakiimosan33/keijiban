# チケット#25: PostsModule実装

## 概要
投稿機能のためのNestJSモジュール、コントローラー、サービスを作成する

## タスクタイプ
バックエンド開発

## 優先度
高

## ステータス
未着手

## 詳細説明
投稿のCRUD操作を行うPostsModuleを実装する。Supabaseとの連携を含む。

## 受け入れ条件
- [ ] PostsModuleが作成されている
- [ ] PostsControllerが作成されている
- [ ] PostsServiceが作成されている
- [ ] DTOクラスが定義されている
- [ ] Supabaseとの連携が動作する

## 作業手順
1. モジュール生成：
```bash
nest g module posts
nest g controller posts
nest g service posts
```
2. DTOクラス作成（dto/create-post.dto.ts）：
```typescript
export class CreatePostDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title: string

  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  body: string
}
```
3. PostsServiceにビジネスロジック実装：
   - findAll（一覧取得）
   - findOne（詳細取得）
   - create（新規作成）
4. Supabaseクライアント統合
5. エラーハンドリング実装
6. レスポンスDTO作成

## 依存関係
- チケット#24: NestJS基本設定
- チケット#06: Supabaseクライアント

## 見積工数
60分

## 担当者
バックエンド開発者

## 備考
- ページネーション対応
- ソート順（最新順）実装