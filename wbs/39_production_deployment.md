# チケット#39: 本番デプロイ実行

## 概要
フロントエンドとバックエンドを本番環境にデプロイし、サービスを公開する

## タスクタイプ
デプロイ

## 優先度
高

## ステータス
未着手

## 詳細説明
Vercel（フロントエンド）と選定したホスティングサービス（バックエンド）にアプリケーションをデプロイする。

## 受け入れ条件
- [ ] フロントエンドがVercelにデプロイされている
- [ ] バックエンドが本番環境にデプロイされている
- [ ] 本番URLでアクセス可能
- [ ] API連携が正常動作
- [ ] HTTPSが有効
- [ ] DNS設定が完了

## 作業手順
1. フロントエンドデプロイ：
   - Vercel Dashboard
   - Productionブランチからデプロイ
   - 環境変数確認
   - ビルドエラー確認
2. バックエンドデプロイ（例：Railway）：
```bash
# Dockerfileを使用
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```
3. データベース接続確認
4. API疎通確認
5. ドメイン設定
6. SSL証明書確認
7. 監視設定

## 依存関係
- チケット#38: 本番環境変数設定
- 全開発・テスト完了

## 見積工数
60分

## 担当者
DevOpsエンジニア

## 備考
- バックエンドホスティング先要検討（Railway, Heroku, AWS等）
- CDN設定（CloudFlare等）