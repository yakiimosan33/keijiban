# チケット#28: Comments APIエンドポイント実装

## 概要
コメント関連のRESTful APIエンドポイントを実装する

## タスクタイプ
バックエンド開発

## 優先度
高

## ステータス
未着手

## 詳細説明
CommentsControllerにAPIエンドポイントを実装し、投稿に紐づくコメントの取得と作成を可能にする。

## 受け入れ条件
- [ ] GET /posts/:postId/comments（コメント一覧）が動作
- [ ] POST /posts/:postId/comments（コメント作成）が動作
- [ ] 投稿が存在しない場合404エラー
- [ ] Swaggerドキュメントが生成される
- [ ] 適切なバリデーションが動作

## 作業手順
1. CommentsControllerにエンドポイント実装：
```typescript
@Controller('posts/:postId/comments')
@ApiTags('comments')
export class CommentsController {
  @Get()
  @ApiOperation({ summary: 'コメント一覧取得' })
  findAll(@Param('postId') postId: string) {
    return this.commentsService.findByPostId(+postId)
  }

  @Post()
  @ApiOperation({ summary: 'コメント作成' })
  create(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto
  ) {
    return this.commentsService.create(+postId, createCommentDto)
  }
}
```
2. 投稿存在確認の実装
3. エラーレスポンス定義
4. Swagger例の追加
5. バリデーションテスト

## 依存関係
- チケット#27: CommentsModule実装

## 見積工数
30分

## 担当者
バックエンド開発者

## 備考
- RESTfulな階層構造（/posts/:id/comments）
- 投稿の存在確認を事前に実施