# チケット#27: CommentsModule実装

## 概要
コメント機能のためのNestJSモジュール、コントローラー、サービスを作成する

## タスクタイプ
バックエンド開発

## 優先度
高

## ステータス
未着手

## 詳細説明
コメントの取得と投稿を行うCommentsModuleを実装する。投稿に紐づくコメント管理を行う。

## 受け入れ条件
- [ ] CommentsModuleが作成されている
- [ ] CommentsControllerが作成されている
- [ ] CommentsServiceが作成されている
- [ ] CreateCommentDtoが定義されている
- [ ] 投稿との関連が正しく実装されている

## 作業手順
1. モジュール生成：
```bash
nest g module comments
nest g controller comments
nest g service comments
```
2. DTOクラス作成（dto/create-comment.dto.ts）：
```typescript
export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  body: string
}
```
3. CommentsServiceにビジネスロジック実装：
   - findByPostId（投稿別コメント取得）
   - create（コメント作成）
4. 投稿存在確認ロジック
5. エラーハンドリング実装
6. レスポンスDTO作成

## 依存関係
- チケット#24: NestJS基本設定
- チケット#25: PostsModule（投稿存在確認用）

## 見積工数
45分

## 担当者
バックエンド開発者

## 備考
- post_idの検証を含む
- 時系列順（古い順）のソート