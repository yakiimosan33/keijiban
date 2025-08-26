# チケット#23: ローディング/エラー表示実装

## 概要
データ取得中のローディング表示とエラー発生時の表示を統一的に実装する

## タスクタイプ
フロントエンド開発

## 優先度
中

## ステータス
未着手

## 詳細説明
ローディングスピナーとエラーメッセージコンポーネントを作成し、UXを向上させる。

## 受け入れ条件
- [ ] LoadingSpinner.tsxが作成されている
- [ ] ErrorMessage.tsxが作成されている
- [ ] 全画面で統一的なローディング表示
- [ ] エラー時の再試行ボタン
- [ ] 日本語のエラーメッセージ

## 作業手順
1. components/common/LoadingSpinner.tsx作成：
```typescript
export function LoadingSpinner({ size = 'md' }) {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full border-b-2 border-indigo-600" />
    </div>
  )
}
```
2. components/common/ErrorMessage.tsx作成：
```typescript
interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}
```
3. エラーメッセージのパターン定義：
   - ネットワークエラー
   - データ取得エラー
   - 権限エラー
4. 各ページに統合：
   - 投稿一覧
   - 投稿詳細
   - コメント一覧
5. ローディング状態の管理
6. スケルトンローディングの実装（オプション）

## 依存関係
- チケット#13: 投稿一覧ページ
- チケット#18: 投稿詳細ページ

## 見積工数
30分

## 担当者
フロントエンド開発者

## 備考
- パフォーマンスを考慮（不要な再レンダリング防止）
- アクセシビリティ（aria-live）