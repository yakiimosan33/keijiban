# チケット#22: Toast通知システム実装

## 概要
ユーザーアクションのフィードバックを表示するToast通知コンポーネントを実装する

## タスクタイプ
フロントエンド開発

## 優先度
中

## ステータス
未着手

## 詳細説明
投稿やコメントの成功/エラー時にToast通知を表示する。画面上部に一時的に表示され、自動的に消える。

## 受け入れ条件
- [ ] Toast.tsxコンポーネントが作成されている
- [ ] 成功/エラー/情報の3種類の表示
- [ ] 自動非表示（3秒後）
- [ ] 手動クローズボタン
- [ ] 複数通知のスタック表示
- [ ] アニメーション効果

## 作業手順
1. components/common/Toast.tsx作成
2. ToastContextの実装：
```typescript
interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

const ToastContext = createContext<{
  showToast: (message: string, type: ToastType) => void
}>()
```
3. ToastProviderコンポーネント作成
4. Toast表示ロジック：
   - 追加/削除管理
   - 自動削除タイマー（3秒）
5. UIコンポーネント実装：
   - 色分け（success=緑、error=赤、info=青）
   - スライドインアニメーション
6. 各フォームに統合：
   - 投稿成功時：「投稿を受け付けました」
   - エラー時：エラーメッセージ表示

## 依存関係
- チケット#16: 投稿フォーム
- チケット#20: コメントフォーム

## 見積工数
45分

## 担当者
フロントエンド開発者

## 備考
- react-hot-toastライブラリも検討可能
- アクセシビリティ（role="alert"）