# Real-time Implementation Guide

This document explains how the real-time functionality has been implemented in the Keijiban (bulletin board) application.

## Overview

The application now supports full real-time updates using Supabase real-time subscriptions for:

- **Posts**: New posts appear instantly on the main page
- **Comments**: New comments appear instantly on post detail pages
- **Error handling**: Automatic reconnection and user feedback
- **Rate limiting**: Client-side rate limiting to prevent spam

## Architecture

### Core Components

1. **Supabase Client Configuration** (`/lib/supabase.ts`)
   - Enhanced with real-time specific settings
   - Configured with proper event limits and headers

2. **Real-time Hooks** (`/lib/hooks/useRealtime.ts`)
   - `useRealtime()`: Generic hook for managing subscriptions
   - `usePostsRealtime()`: Specialized hook for posts updates
   - `useCommentsRealtime()`: Specialized hook for comments updates
   - Built-in error handling and reconnection logic

3. **Toast Notifications** (`/lib/hooks/useToast.ts`)
   - User feedback system for real-time events
   - Success/error/info notifications

4. **API Layer Updates** (`/lib/api.ts`)
   - Enhanced with proper error handling
   - Support for posts with comment counts
   - Removed legacy subscription methods

## Features

### Real-time Posts Updates

- **Location**: Main page (`/`)
- **Triggers**: New posts appear immediately when created by any user
- **Behavior**: 
  - Only shows on first page to avoid pagination conflicts
  - Maintains 20-post limit per page
  - Shows toast notification for new posts
  - Handles duplicate prevention

### Real-time Comments Updates

- **Location**: Post detail pages (`/post/[id]`)
- **Triggers**: New comments appear immediately when created
- **Behavior**:
  - Comments appear in chronological order
  - Shows toast notification (except for very recent comments to avoid self-notifications)
  - Handles duplicate prevention

### Error Handling & Reconnection

- **Automatic Reconnection**: Exponential backoff strategy (1s, 2s, 4s, 8s, 16s)
- **Max Attempts**: 5 reconnection attempts before giving up
- **User Feedback**: Toast notifications for connection issues
- **Graceful Degradation**: App continues to work without real-time if subscriptions fail

### Rate Limiting

- **Posts**: 3 per minute per IP (client-side check)
- **Comments**: 10 per minute per IP (client-side check)
- **Storage**: Uses localStorage for tracking
- **User Feedback**: Clear error messages when limits exceeded

## Usage Examples

### Basic Post List with Real-time

```tsx
import { usePostsRealtime } from '@/lib/hooks/useRealtime';

function PostList() {
  const [posts, setPosts] = useState([]);

  // Handle real-time updates
  usePostsRealtime(
    (newPost) => setPosts(prev => [newPost, ...prev]),
    (updatedPost) => setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p)),
    (deletedPost) => setPosts(prev => prev.filter(p => p.id !== deletedPost.id)),
    {
      onError: (error) => console.error('Real-time error:', error)
    }
  );

  return (
    <div>
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
}
```

### Basic Comment List with Real-time

```tsx
import { useCommentsRealtime } from '@/lib/hooks/useRealtime';

function CommentList({ postId }) {
  const [comments, setComments] = useState([]);

  useCommentsRealtime(
    postId,
    (newComment) => setComments(prev => [...prev, newComment]),
    (updatedComment) => setComments(prev => prev.map(c => c.id === updatedComment.id ? updatedComment : c)),
    (deletedComment) => setComments(prev => prev.filter(c => c.id !== deletedComment.id)),
    {
      onError: (error) => console.error('Comments real-time error:', error)
    }
  );

  return (
    <div>
      {comments.map(comment => <CommentItem key={comment.id} comment={comment} />)}
    </div>
  );
}
```

### Toast Notifications

```tsx
import { useToast } from '@/lib/hooks/useToast';

function MyComponent() {
  const { showSuccess, showError, showInfo } = useToast();

  const handleSuccess = () => showSuccess('Operation completed!');
  const handleError = () => showError('Something went wrong');
  const handleInfo = () => showInfo('New update available');

  return (
    <div>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
      <button onClick={handleInfo}>Info</button>
    </div>
  );
}
```

## Database Requirements

Ensure your Supabase database has:

### Row Level Security (RLS) Policies

```sql
-- Posts policies
CREATE POLICY posts_select_public ON posts
  FOR SELECT USING (is_hidden = false);

CREATE POLICY posts_insert_public ON posts
  FOR INSERT WITH CHECK (is_hidden = false);

-- Comments policies  
CREATE POLICY comments_select_public ON comments
  FOR SELECT USING (is_hidden = false);

CREATE POLICY comments_insert_public ON comments
  FOR INSERT WITH CHECK (is_hidden = false);
```

### Real-time Enabled Tables

Make sure real-time is enabled for both tables:

```sql
-- Enable real-time for posts
ALTER PUBLICATION supabase_realtime ADD TABLE posts;

-- Enable real-time for comments
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
```

## Environment Variables

Required environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing Real-time Functionality

### Manual Testing

1. **Posts Real-time**:
   - Open the main page in two browser windows
   - Create a new post in one window
   - Verify it appears immediately in the other window

2. **Comments Real-time**:
   - Open the same post detail page in two browser windows
   - Add a comment in one window
   - Verify it appears immediately in the other window

3. **Error Handling**:
   - Disable network connection temporarily
   - Verify error notifications appear
   - Re-enable network and verify reconnection

4. **Rate Limiting**:
   - Try creating more than 3 posts within a minute
   - Verify rate limit error message appears

### Automated Testing Considerations

```tsx
// Example test structure
describe('Real-time subscriptions', () => {
  test('should connect to posts channel', () => {
    // Mock Supabase subscription
    // Verify channel creation and subscription
  });

  test('should handle new post insertion', () => {
    // Mock real-time payload
    // Verify component state update
  });

  test('should cleanup on unmount', () => {
    // Verify subscription cleanup
  });
});
```

## Performance Considerations

### Channel Management
- Subscriptions are automatically cleaned up on component unmount
- Duplicate subscriptions are prevented
- Channel names include unique identifiers for post-specific subscriptions

### Memory Management
- Toast notifications auto-expire after 5 seconds
- Real-time event handlers use `useCallback` to prevent unnecessary re-renders
- Subscription reconnection uses exponential backoff to prevent spam

### Network Efficiency
- Real-time events are filtered at the database level using RLS
- Only non-hidden posts and comments are broadcast
- Rate limiting prevents excessive API calls

## Troubleshooting

### Common Issues

1. **Real-time not working**:
   - Check Supabase real-time is enabled for tables
   - Verify RLS policies allow SELECT access
   - Check browser console for WebSocket errors

2. **Duplicate notifications**:
   - Verify component keys are stable
   - Check for multiple subscription setups

3. **Connection drops**:
   - Check network stability
   - Verify Supabase project status
   - Check reconnection attempts in console

### Debug Mode

Enable debug logging by adding to your component:

```tsx
usePostsRealtime(
  handleNewPost,
  handlePostUpdate,
  handlePostDelete,
  {
    onError: (error) => {
      console.error('Posts real-time error:', error);
      // Add more detailed logging here
    }
  }
);
```

## Best Practices

1. **Always clean up subscriptions** - The hooks handle this automatically
2. **Use stable keys** - Ensure React keys are stable to prevent unnecessary re-subscriptions
3. **Handle errors gracefully** - Always provide error handlers
4. **Test with slow connections** - Verify behavior under poor network conditions
5. **Monitor performance** - Watch for memory leaks and excessive re-renders

## Security Notes

- Real-time subscriptions respect RLS policies
- Client-side rate limiting is supplementary - server-side limits should be implemented
- IP hashing is mentioned but not implemented client-side for security
- Anonymous access is controlled via database policies, not authentication

This implementation provides a robust, scalable real-time experience that follows Supabase best practices and handles edge cases gracefully.