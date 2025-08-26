# チケット#37: README.md更新

## 概要
プロジェクトのREADME.mdを作成し、セットアップ手順と使用方法を記載する

## タスクタイプ
ドキュメント

## 優先度
低

## ステータス
未着手

## 詳細説明
開発者向けのREADMEを作成し、環境構築から実行までの手順を明確に記載する。

## 受け入れ条件
- [ ] プロジェクト概要が記載されている
- [ ] 技術スタックが明記されている
- [ ] セットアップ手順が詳細
- [ ] 環境変数の説明がある
- [ ] 実行コマンドが記載されている
- [ ] トラブルシューティングがある

## 作業手順
1. README.md構成：
```markdown
# バイブコーディング掲示板

## 概要
匿名投稿型の掲示板アプリケーション

## 技術スタック
- Frontend: Next.js 14 (App Router)
- Backend: NestJS
- Database: PostgreSQL (Supabase)
- Styling: Tailwind CSS
- Hosting: Vercel

## セットアップ

### 必要要件
- Node.js 18以上
- npm 9以上

### インストール
\`\`\`bash
git clone https://github.com/[username]/vibe-board.git
cd vibe-board
npm install
\`\`\`

### 環境変数
.env.localファイルを作成：
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
\`\`\`

### 実行
\`\`\`bash
# 開発サーバー
npm run dev

# ビルド
npm run build

# テスト
npm run test
\`\`\`
```
2. スクリーンショット追加
3. アーキテクチャ図作成
4. API仕様へのリンク

## 依存関係
- 全開発完了

## 見積工数
30分

## 担当者
開発者

## 備考
- 英語/日本語両方で記載
- バッジ追加（ビルド状況等）