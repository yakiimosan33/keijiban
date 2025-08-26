# チケット#04: NestJSプロジェクト初期化

## 概要
バックエンドAPIサーバーとしてNestJSプロジェクトを新規作成し、基本設定を行う

## タスクタイプ
環境構築

## 優先度
高

## ステータス
未着手

## 詳細説明
NestJS CLIを使用してバックエンドプロジェクトを初期化する。TypeScript、Swagger、バリデーション機能を含む基本的なセットアップを行う。

## 受け入れ条件
- [ ] NestJSプロジェクトが作成されている
- [ ] TypeScriptが設定されている
- [ ] 基本的なディレクトリ構造が整備されている
- [ ] ESLintとPrettierが設定されている
- [ ] 開発サーバーが正常に起動する
- [ ] Swaggerが有効化されている

## 作業手順
1. `npm i -g @nestjs/cli`でCLIをインストール
2. `nest new keijiban-backend`でプロジェクト作成
3. パッケージマネージャーはnpmを選択
4. 必要な依存関係をインストール：
   - @nestjs/config
   - @nestjs/swagger
   - class-validator
   - class-transformer
5. `npm run start:dev`で動作確認
6. .prettierrcとeslintrcの調整

## 依存関係
- チケット#01: GitHubリポジトリ作成

## 見積工数
30分

## 担当者
バックエンド開発者

## 備考
- Node.js 18以上が必要
- ポート3001で起動するように設定（フロントエンド3000番と重複回避）