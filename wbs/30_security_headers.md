# チケット#30: セキュリティヘッダー設定

## 概要
APIとフロントエンドにセキュリティヘッダーを設定し、一般的な攻撃を防ぐ

## タスクタイプ
セキュリティ

## 優先度
高

## ステータス
未着手

## 詳細説明
Helmetを使用してセキュリティヘッダーを設定する。XSS、クリックジャッキング等の攻撃を防ぐ。

## 受け入れ条件
- [ ] Helmetが設定されている
- [ ] CORSが適切に設定されている
- [ ] セキュリティヘッダーが送信される
- [ ] Next.jsにもセキュリティヘッダー設定
- [ ] CSPが適切に設定されている

## 作業手順
1. NestJS側の設定（main.ts）：
```typescript
import helmet from 'helmet'

app.use(helmet())
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
})
```
2. Next.js側の設定（next.config.js）：
```javascript
module.exports = {
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ],
    }]
  }
}
```
3. CSP設定の調整
4. 各ヘッダーの動作確認
5. セキュリティスキャン実施

## 依存関係
- チケット#24: NestJS基本設定
- チケット#02: Next.jsプロジェクト

## 見積工数
30分

## 担当者
セキュリティエンジニア

## 備考
- 本番環境用の設定を考慮
- Supabase URLをCSPに追加