# チケット#36: API仕様書（Swagger）生成

## 概要
Swagger UIを使用したAPI仕様書の自動生成と公開を設定する

## タスクタイプ
ドキュメント

## 優先度
低

## ステータス
未着手

## 詳細説明
NestJSのSwaggerモジュールを使用して、APIドキュメントを自動生成し、開発者が参照できるようにする。

## 受け入れ条件
- [ ] Swagger UIが表示される
- [ ] 全エンドポイントが記載されている
- [ ] リクエスト/レスポンス例がある
- [ ] DTOの詳細が表示される
- [ ] Try it out機能が動作する
- [ ] 日本語説明が含まれる

## 作業手順
1. Swaggerデコレータ追加：
```typescript
// posts.controller.ts
@ApiTags('投稿')
export class PostsController {
  @Post()
  @ApiOperation({ summary: '新規投稿作成' })
  @ApiResponse({ 
    status: 201, 
    description: '投稿が作成されました',
    type: PostResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'バリデーションエラー' 
  })
  create(@Body() dto: CreatePostDto) {}
}
```
2. DTOにSwaggerプロパティ追加：
```typescript
export class CreatePostDto {
  @ApiProperty({
    description: '投稿タイトル',
    example: '今日の出来事',
    minLength: 1,
    maxLength: 120
  })
  title: string
}
```
3. 設定の最適化
4. カスタムCSS適用
5. 環境別の表示制御

## 依存関係
- チケット#26: Posts APIエンドポイント
- チケット#28: Comments APIエンドポイント

## 見積工数
30分

## 担当者
バックエンド開発者

## 備考
- 本番環境では非表示
- URL: http://localhost:3001/api