# チケット#21: リアルタイムSubscription実装

## 概要
SupabaseのRealtime機能を使用して、新規投稿とコメントをリアルタイムで画面に反映する

## タスクタイプ
フロントエンド開発

## 優先度
高

## ステータス
未着手

## 詳細説明
WebSocket接続を確立し、データベースの変更をリアルタイムで検知して画面を更新する機能を実装する。

## 受け入れ条件
- [ ] 新規投稿がリアルタイムで一覧に追加される
- [ ] 新規コメントがリアルタイムで表示される
- [ ] 接続エラー時の再接続処理
- [ ] コンポーネントアンマウント時のクリーンアップ
- [ ] メモリリークがない

## 作業手順
1. カスタムフックを作成（hooks/useRealtimeSubscription.ts）
2. 投稿一覧用のSubscription実装：
```typescript
useEffect(() => {
  const channel = supabase
    .channel('posts-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'posts',
      },
      (payload) => {
        // 新規投稿を一覧に追加
        setPosts(prev => [payload.new, ...prev])
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])
```
3. コメント用のSubscription実装
4. エラーハンドリング追加
5. 再接続ロジック実装
6. PostListとCommentListに統合

## 依存関係
- チケット#11: リアルタイム機能有効化
- チケット#13: 投稿一覧ページ
- チケット#19: コメント一覧表示

## 見積工数
60分

## 担当者
フロントエンド開発者

## 備考
- パフォーマンスに注意（不要な再レンダリング防止）
- 複数タブでの動作確認