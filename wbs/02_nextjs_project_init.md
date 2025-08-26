# チケット#02: Next.js プロジェクト初期化

## 概要
Next.js (App Router) を使用したフロントエンドプロジェクトの初期セットアップを行う

## タスクタイプ
環境構築

## 優先度
高

## ステータス
未着手

## 詳細説明
最新版のNext.jsを使用してプロジェクトを初期化する。App Routerを採用し、TypeScriptとTailwind CSSを有効化する。

## 受け入れ条件
- [ ] Next.js 14以上がインストールされている
- [ ] App Routerが有効になっている
- [ ] TypeScriptが設定されている
- [ ] Tailwind CSSが設定されている
- [ ] ESLintが設定されている
- [ ] 開発サーバーが正常に起動する

## 作業手順
1. `npx create-next-app@latest keijiban-frontend`を実行
2. 以下のオプションを選択：
   - TypeScript: Yes
   - ESLint: Yes
   - Tailwind CSS: Yes
   - src/ directory: No
   - App Router: Yes
   - Import alias: @/*
3. プロジェクトディレクトリに移動
4. `npm run dev`で開発サーバーを起動し動作確認
5. 初期ファイルのクリーンアップ

## 依存関係
- チケット#01: GitHubリポジトリ作成

## 見積工数
30分

## 担当者
フロントエンド開発者

## 備考
- Node.js 18以上が必要
- package.jsonにスクリプトを追加（lint, typecheck等）