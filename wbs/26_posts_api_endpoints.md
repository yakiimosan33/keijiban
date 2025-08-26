# チケット#26: Posts APIエンドポイント実装

## 概要
投稿関連のRESTful APIエンドポイントを実装する

## タスクタイプ
バックエンド開発

## 優先度
高

## ステータス
未着手

## 詳細説明
PostsControllerにAPIエンドポイントを実装し、Swagger対応を行う。

## 受け入れ条件
- [ ] GET /posts（一覧取得）が動作
- [ ] GET /posts/:id（詳細取得）が動作
- [ ] POST /posts（新規作成）が動作
- [ ] ページネーションが実装されている
- [ ] Swaggerドキュメントが生成される
- [ ] エラーレスポンスが統一されている

## 作業手順
1. PostsControllerにエンドポイント実装：
```typescript
@Controller('posts')
@ApiTags('posts')
export class PostsController {
  @Get()
  @ApiOperation({ summary: '投稿一覧取得' })
  findAll(@Query() query: GetPostsDto) {
    return this.postsService.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: '投稿詳細取得' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id)
  }

  @Post()
  @ApiOperation({ summary: '投稿作成' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto)
  }
}
```
2. クエリパラメータDTO作成
3. レスポンス例の追加
4. HTTPステータスコード設定
5. 例外処理の実装
6. Swagger確認

## 依存関係
- チケット#25: PostsModule実装

## 見積工数
45分

## 担当者
バックエンド開発者

## 備考
- RESTful設計原則に従う
- 適切なHTTPステータスコード使用