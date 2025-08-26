# チケット#24: NestJS基本設定

## 概要
NestJSプロジェクトの基本的な設定とモジュール構成を整える

## タスクタイプ
バックエンド開発

## 優先度
高

## ステータス
未着手

## 詳細説明
NestJSの基本設定、環境変数管理、共通モジュールの設定を行う。Swagger、CORS、バリデーションパイプを設定する。

## 受け入れ条件
- [ ] ConfigModuleが設定されている
- [ ] Swaggerドキュメントが有効
- [ ] CORSが適切に設定されている
- [ ] グローバルパイプが設定されている
- [ ] ポート3001で起動する
- [ ] 環境変数が管理されている

## 作業手順
1. 必要なパッケージインストール：
```bash
npm install @nestjs/config @nestjs/swagger swagger-ui-express
npm install class-validator class-transformer
npm install helmet
```
2. app.module.tsを更新：
```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
```
3. main.tsでSwagger設定：
```typescript
const config = new DocumentBuilder()
  .setTitle('Keijiban API')
  .setDescription('掲示板APIドキュメント')
  .setVersion('1.0')
  .build()
```
4. CORS設定追加
5. ValidationPipe設定
6. ポート設定（3001）

## 依存関係
- チケット#04: NestJSプロジェクト初期化

## 見積工数
30分

## 担当者
バックエンド開発者

## 備考
- Swagger UI: http://localhost:3001/api
- 本番環境ではSwaggerを無効化