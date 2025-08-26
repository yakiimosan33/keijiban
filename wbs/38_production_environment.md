# チケット#38: 本番環境変数設定

## 概要
本番環境用の環境変数を設定し、セキュアな運用を準備する

## タスクタイプ
デプロイ

## 優先度
高

## ステータス
未着手

## 詳細説明
Vercel、NestJSデプロイ先で本番用の環境変数を設定し、開発環境との分離を行う。

## 受け入れ条件
- [ ] Vercel本番環境変数が設定されている
- [ ] バックエンド本番環境変数が設定されている
- [ ] シークレット情報が適切に管理されている
- [ ] 環境別設定が分離されている
- [ ] .env.productionが作成されている

## 作業手順
1. Vercel環境変数設定：
   - Dashboard → Settings → Environment Variables
   - NEXT_PUBLIC_SUPABASE_URL（Production）
   - NEXT_PUBLIC_SUPABASE_ANON_KEY（Production）
2. バックエンド環境変数：
```bash
# .env.production
NODE_ENV=production
DATABASE_URL=production_supabase_url
SUPABASE_SERVICE_KEY=production_service_key
FRONTEND_URL=https://your-domain.vercel.app
PORT=3001
```
3. セキュリティチェック：
   - Service Role Key使用確認
   - CORS設定確認
   - Rate Limit設定確認
4. 環境変数検証スクリプト作成
5. デプロイ前確認リスト作成

## 依存関係
- 全開発完了

## 見積工数
30分

## 担当者
DevOpsエンジニア

## 備考
- 本番用Supabaseプロジェクト使用検討
- 環境変数の暗号化