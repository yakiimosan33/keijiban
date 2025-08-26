# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

バイブコーディング掲示板（Vibe Coding Bulletin Board） - MVP version
An anonymous text bulletin board system with real-time updates, Japanese UI only.

## Technology Stack

- **Frontend**: Next.js (App Router)
- **Backend**: NestJS
- **Database**: PostgreSQL via Supabase
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (Frontend), TBD (Backend)
- **Real-time**: Supabase Subscriptions

## Database Design

### Database Selection Rationale
PostgreSQL (Supabase) chosen for:
- Built-in real-time subscriptions
- Row Level Security (RLS) for anonymous access control
- Natural 1:N relationship between posts and comments
- Managed backups and Point-In-Time Recovery (PITR)

### Performance Requirements
- Expected load: 1k-10k posts/day, 100-500 concurrent viewers
- Target response time: <100ms with proper indexing
- Availability: Supabase SLA compliant

### Table Definitions

#### posts table
| Column      | Type                 | Constraints |
|-------------|---------------------|-------------|
| id          | bigint identity     | PRIMARY KEY |
| title       | varchar(120)        | NOT NULL, CHECK(length 1-120) |
| body        | text                | NOT NULL, CHECK(length 1-4000) |
| created_at  | timestamptz         | NOT NULL, DEFAULT now() |
| is_hidden   | boolean             | NOT NULL, DEFAULT false |
| ip_hash     | varchar(64)         | NULLABLE, CHECK(hex format) |

**Indexes:**
- `posts_pkey (id)`
- `idx_posts_created_at_desc (created_at DESC)`
- `idx_posts_is_hidden_created_at (is_hidden, created_at DESC)`

#### comments table
| Column      | Type                 | Constraints |
|-------------|---------------------|-------------|
| id          | bigint identity     | PRIMARY KEY |
| post_id     | bigint              | NOT NULL, REFERENCES posts(id) |
| body        | text                | NOT NULL, CHECK(length 1-4000) |
| created_at  | timestamptz         | NOT NULL, DEFAULT now() |
| is_hidden   | boolean             | NOT NULL, DEFAULT false |
| ip_hash     | varchar(64)         | NULLABLE, CHECK(hex format) |

**Indexes:**
- `comments_pkey (id)`
- `idx_comments_post_id_created_at (post_id, created_at DESC)`

### Row Level Security (RLS) Policies

```sql
-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY posts_select_public ON posts
  FOR SELECT USING (is_hidden = false);

CREATE POLICY posts_insert_public ON posts
  FOR INSERT WITH CHECK (
    is_hidden = false 
    AND length(title) BETWEEN 1 AND 120 
    AND length(body) BETWEEN 1 AND 4000
  );

-- Comments policies  
CREATE POLICY comments_select_public ON comments
  FOR SELECT USING (is_hidden = false);

CREATE POLICY comments_insert_public ON comments
  FOR INSERT WITH CHECK (
    is_hidden = false 
    AND length(body) BETWEEN 1 AND 4000
  );
```

### Database Implementation SQL

```sql
-- Posts table
CREATE TABLE posts (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title       varchar(120) NOT NULL CHECK(length(title) BETWEEN 1 AND 120),
  body        text NOT NULL CHECK(length(body) BETWEEN 1 AND 4000),
  created_at  timestamptz NOT NULL DEFAULT now(),
  is_hidden   boolean NOT NULL DEFAULT false,
  ip_hash     varchar(64) CHECK (ip_hash ~ '^[0-9a-f]{64}$')
);

CREATE INDEX idx_posts_created_at_desc ON posts (created_at DESC);
CREATE INDEX idx_posts_is_hidden_created_at ON posts (is_hidden, created_at DESC);

-- Comments table
CREATE TABLE comments (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id     bigint NOT NULL REFERENCES posts(id),
  body        text NOT NULL CHECK(length(body) BETWEEN 1 AND 4000),
  created_at  timestamptz NOT NULL DEFAULT now(),
  is_hidden   boolean NOT NULL DEFAULT false,
  ip_hash     varchar(64) CHECK (ip_hash ~ '^[0-9a-f]{64}$')
);

CREATE INDEX idx_comments_post_id_created_at ON comments (post_id, created_at DESC);
```

### Data Flow
- **Post Creation**: Client → Supabase Insert (anon) → posts table → Realtime broadcast
- **Comment Creation**: Client → Supabase Insert → comments table → Realtime broadcast
- **List Display**: Query posts ORDER BY created_at DESC LIMIT 20
- **Comments Display**: Query comments WHERE post_id = ? ORDER BY created_at ASC

### Backup & Monitoring
- Automatic Supabase backups enabled
- PITR (Point-In-Time Recovery) recommended
- Monitor table size and row counts
- Track index bloat especially on comments table
- Application-level rate limiting enforcement

## Key Features

1. **Anonymous Posting**: No authentication required - anyone can post and comment
2. **Real-time Updates**: Uses Supabase Subscriptions for live updates
3. **Pagination**: 20 posts per page, latest first (URL: `/?page=2`)
4. **No Edit/Delete**: Posts and comments are permanent once submitted
5. **Mobile-First**: Responsive design optimized for mobile devices
6. **Hidden Content**: is_hidden flag for future moderation (not deletable)
7. **IP Hashing**: Optional salted SHA-256 hashing for rate limiting

## UI/UX Design Specifications

### Pages & Routes

1. **Post List** (`/`)
   - New post form (modal on PC, inline on mobile)
   - Post cards with title, body excerpt, relative time, comment count
   - Pagination controls
   
2. **Post Detail** (`/post/[id]`)
   - Full post with title, body, timestamp
   - Comment list (oldest to newest)
   - Comment input form (non-transitioning)
   
3. **Legal Pages** (`/terms`, `/privacy`) - Placeholder pages
4. **404 Page** (`/not-found`)

### Design Tokens

- **Colors**: Zinc base + indigo-500 accent
- **Border Radius**: 12px for cards
- **Buttons**: `bg-indigo-600 hover:bg-indigo-700 text-white`
- **Typography**: System UI font, body text 14-16px

### Interaction Specifications

#### Form Validation (Frontend Display)
- **Title**: Required, 1-120 characters
- **Body**: Required, 1-4000 characters  
- **Comment**: Required, 1-4000 characters
- Error messages displayed directly below fields in red

#### Rate Limiting (Application Layer)
- **Posts**: 3 per minute per IP
- **Comments**: 10 per minute per IP

#### Loading States
- Spinner during submission
- Success toast: "投稿を受け付けました"
- Failure toast with retry guidance

### Responsive Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- Mobile: Single column, tap targets minimum 44px

### Accessibility
- WCAG AA compliance
- Clear focus rings
- Modal dialogs with proper ARIA attributes
- Sufficient color contrast

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run type checking
npm run typecheck
```

## Implementation Guidelines

### UI Components Structure

```
components/
├── layout/
│   ├── Header.tsx        # Logo, title, new post button (PC)
│   └── Footer.tsx        # Terms, privacy links
├── posts/
│   ├── PostCard.tsx      # List item with excerpt
│   ├── PostDetail.tsx    # Full post view
│   ├── PostForm.tsx      # New post form (modal/inline)
│   └── PostList.tsx      # Paginated list container
├── comments/
│   ├── CommentList.tsx   # Comments container
│   ├── CommentItem.tsx   # Single comment
│   └── CommentForm.tsx   # Add comment form
├── common/
│   ├── Pagination.tsx    # Page navigation
│   ├── Toast.tsx         # Notification system
│   ├── Modal.tsx         # Dialog wrapper
│   └── Captcha.tsx       # Simple math CAPTCHA
└── report/
    └── ReportButton.tsx  # Report functionality
```

### State Management
- Client-side state for forms and UI
- Supabase real-time subscriptions for live updates
- URL state for pagination (`?page=n`)
- Toast notifications for user feedback

### Performance Requirements
- CSR-focused for smooth interactions
- No page reloads during navigation
- Optimistic UI updates where appropriate
- Scroll position preservation on navigation
- Response time target: <100ms for database queries

## Project Structure

```
/
├── app/                  # Next.js App Router pages
│   ├── page.tsx         # Post list (/)
│   ├── post/
│   │   └── [id]/
│   │       └── page.tsx # Post detail
│   ├── terms/
│   │   └── page.tsx     # Terms of service
│   ├── privacy/
│   │   └── page.tsx     # Privacy policy
│   └── not-found.tsx    # 404 page
├── components/          # React components (see above)
├── lib/                # Utilities and Supabase client
│   ├── supabase.ts     # Client configuration
│   ├── api.ts          # Database queries
│   └── utils.ts        # Helper functions
├── public/
│   └── robots.txt      # noindex directive
├── .env.local          # Environment variables
└── package.json        # Dependencies and scripts
```

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Best Practices

### Database Design & Architecture

#### Schema Design Principles
- **Use PostgreSQL features**: Leverage PostgreSQL's advanced features (JSONB, arrays, full-text search)
- **Row Level Security (RLS)**: Always enable RLS on tables exposed to client
- **Naming conventions**: Use snake_case for tables and columns
- **Primary keys**: Use UUID or bigint with identity for primary keys
- **Timestamps**: Always include created_at and updated_at columns
- **Soft deletes**: Use deleted_at or is_deleted flags instead of hard deletes

```sql
-- Example table with best practices
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Add update trigger for updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### Row Level Security (RLS) Best Practices
- **Principle of least privilege**: Grant minimum necessary permissions
- **Policy composition**: Use multiple specific policies instead of one complex policy
- **Performance optimization**: Keep policies simple for better query performance
- **Security functions**: Create security definer functions for complex logic
- **Testing**: Always test policies with different user roles

```sql
-- Example RLS policies
-- Public read for non-deleted posts
CREATE POLICY "Public posts are viewable by everyone"
  ON posts FOR SELECT
  USING (deleted_at IS NULL);

-- Authenticated users can create
CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own posts
CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);
```

#### Indexes and Performance
- **Strategic indexing**: Index foreign keys, frequently queried columns, and columns in WHERE clauses
- **Partial indexes**: Use partial indexes for filtered queries
- **Composite indexes**: Order columns by selectivity (most selective first)
- **Monitor performance**: Use pg_stat_user_indexes to identify unused indexes
- **EXPLAIN ANALYZE**: Always check query plans for complex queries

```sql
-- Performance-optimized indexes
CREATE INDEX idx_posts_author_created ON posts(author_id, created_at DESC) 
  WHERE deleted_at IS NULL;

CREATE INDEX idx_posts_search ON posts 
  USING gin(to_tsvector('english', title || ' ' || content));
```

### Client-Side Integration

#### Supabase Client Configuration
- **Environment variables**: Never expose service keys in client code
- **Singleton pattern**: Create single client instance and reuse
- **Type safety**: Generate TypeScript types from database schema
- **Connection pooling**: Configure appropriate connection limits

```typescript
// Proper client initialization
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: { 'x-application-name': 'keijiban' },
    },
  }
)
```

#### Query Optimization
- **Select specific columns**: Avoid SELECT * queries
- **Pagination**: Always paginate large datasets
- **Eager loading**: Use .select() with foreign tables to reduce queries
- **Query builders**: Chain query methods for complex queries
- **Abort signals**: Implement request cancellation for better UX

```typescript
// Optimized query example
const { data, error } = await supabase
  .from('posts')
  .select(`
    id,
    title,
    created_at,
    author:author_id (
      id,
      username,
      avatar_url
    ),
    comments_count:comments(count)
  `)
  .eq('deleted_at', null)
  .order('created_at', { ascending: false })
  .range(0, 19) // Pagination
  .abortSignal(abortController.signal)
```

#### Real-time Subscriptions
- **Channel management**: Properly subscribe and unsubscribe from channels
- **Filter subscriptions**: Use filters to reduce unnecessary updates
- **Error handling**: Implement reconnection logic
- **Memory leaks**: Always clean up subscriptions in cleanup functions
- **Presence**: Use presence for user activity tracking

```typescript
// Real-time subscription with cleanup
useEffect(() => {
  const channel = supabase
    .channel('posts-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'posts',
        filter: 'deleted_at=eq.null',
      },
      (payload) => {
        handleRealtimeUpdate(payload)
      }
    )
    .on('error', (error) => {
      console.error('Realtime error:', error)
      // Implement reconnection logic
    })
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])
```

### Authentication & Authorization

#### Auth Best Practices
- **Session management**: Use Supabase Auth hooks for session handling
- **Protected routes**: Implement middleware for route protection
- **Token refresh**: Handle token expiration gracefully
- **Social auth**: Configure OAuth providers properly
- **Email templates**: Customize email templates for better UX

```typescript
// Auth state management
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
```

### Storage Best Practices

#### File Upload Management
- **File validation**: Validate file types and sizes on both client and server
- **Bucket policies**: Configure appropriate RLS policies for buckets
- **CDN integration**: Use Supabase CDN URLs for public files
- **Image optimization**: Implement image transformation for different sizes
- **Cleanup strategy**: Implement orphaned file cleanup

```typescript
// Secure file upload
async function uploadFile(file: File, bucket: string, path: string) {
  // Validate file
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
  
  if (file.size > MAX_SIZE) {
    throw new Error('File size exceeds 5MB')
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type')
  }

  // Upload with progress tracking
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
    
  return publicUrl
}
```

### Edge Functions Best Practices

#### Function Development
- **TypeScript**: Always use TypeScript for type safety
- **Error handling**: Implement comprehensive error handling
- **Environment variables**: Use Deno.env for secrets
- **CORS configuration**: Configure CORS headers properly
- **Rate limiting**: Implement function-level rate limiting

```typescript
// Edge function example
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Function logic here
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
```

### Database Functions & Triggers

#### Function Best Practices
- **Immutable functions**: Mark functions as IMMUTABLE when possible
- **Security definer**: Use SECURITY DEFINER carefully
- **Error handling**: Use RAISE statements for clear error messages
- **Performance**: Use STABLE or VOLATILE appropriately
- **Testing**: Test functions with different scenarios

```sql
-- Example database function
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE posts 
  SET view_count = view_count + 1,
      updated_at = NOW()
  WHERE id = post_id
    AND deleted_at IS NULL;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Post not found or deleted';
  END IF;
END;
$$;

-- Trigger for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Monitoring & Debugging

#### Observability
- **Query logging**: Enable statement logging for debugging
- **Performance monitoring**: Use pg_stat_statements extension
- **Error tracking**: Implement error logging with context
- **Metrics collection**: Track key metrics (response time, error rate)
- **Dashboard creation**: Create monitoring dashboards in Supabase

```typescript
// Error tracking wrapper
async function supabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  const startTime = Date.now()
  
  try {
    const { data, error } = await queryFn()
    
    if (error) {
      console.error('Supabase error:', {
        error,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      })
      throw error
    }
    
    // Log slow queries
    const duration = Date.now() - startTime
    if (duration > 1000) {
      console.warn(`Slow query detected: ${duration}ms`)
    }
    
    return data!
  } catch (error) {
    // Send to error tracking service
    throw error
  }
}
```

### Migration & Deployment

#### Migration Strategy
- **Version control**: Store all migrations in version control
- **Rollback plans**: Always have rollback scripts ready
- **Testing**: Test migrations on staging environment first
- **Zero-downtime**: Design migrations for zero-downtime deployment
- **Seed data**: Maintain seed data scripts for development

```sql
-- Migration example with rollback
-- Up migration
BEGIN;
  ALTER TABLE posts ADD COLUMN slug TEXT;
  CREATE UNIQUE INDEX idx_posts_slug ON posts(slug) WHERE deleted_at IS NULL;
  UPDATE posts SET slug = id::text WHERE slug IS NULL;
  ALTER TABLE posts ALTER COLUMN slug SET NOT NULL;
COMMIT;

-- Down migration (rollback)
BEGIN;
  DROP INDEX IF EXISTS idx_posts_slug;
  ALTER TABLE posts DROP COLUMN slug;
COMMIT;
```

### Security Best Practices

#### Security Checklist
- **API key rotation**: Regularly rotate API keys
- **Service role key**: Never expose service role key to clients
- **SQL injection**: Use parameterized queries
- **Rate limiting**: Implement at multiple levels (API, database, function)
- **Audit logging**: Enable audit logs for sensitive operations
- **Backup encryption**: Ensure backups are encrypted
- **Network security**: Use SSL/TLS for all connections

```typescript
// Security headers middleware
export function securityHeaders() {
  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self' *.supabase.co",
  }
}
```

## NestJS Best Practices

### Architecture Guidelines

#### Module Organization
- **Feature-based modules**: Organize code by feature (posts, comments, users) rather than by technical layer
- **Module encapsulation**: Keep modules focused and loosely coupled
- **Barrel exports**: Use index.ts files to control public APIs of modules
- **Shared module**: Create a SharedModule for commonly used providers and imports

#### Dependency Injection
- **Constructor injection**: Always use constructor injection for dependencies
- **Interface segregation**: Define interfaces for services to improve testability
- **Custom providers**: Use factory providers for complex initialization logic
- **Scope management**: Use REQUEST scope sparingly due to performance implications

#### DTOs and Validation
- **Class-validator**: Always validate incoming data with class-validator decorators
- **Class-transformer**: Use for data transformation and serialization
- **Separate DTOs**: Create separate DTOs for requests, responses, and internal operations
- **Swagger documentation**: Use @ApiProperty() decorators for API documentation

```typescript
// Example DTO
export class CreatePostDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  @ApiProperty({ description: 'Post title', maxLength: 120 })
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  @ApiProperty({ description: 'Post body', maxLength: 4000 })
  body: string;
}
```

#### Error Handling
- **Custom exceptions**: Create domain-specific exceptions extending HttpException
- **Exception filters**: Use global and local exception filters for consistent error responses
- **Logging**: Log errors with appropriate context and stack traces
- **Error codes**: Use standardized error codes for client-side handling

```typescript
// Example custom exception
export class PostNotFoundException extends NotFoundException {
  constructor(postId: number) {
    super(`Post with ID ${postId} not found`);
  }
}
```

#### Service Layer Patterns
- **Single responsibility**: Each service should have one clear purpose
- **Business logic**: Keep business logic in services, not controllers
- **Repository pattern**: Abstract database operations behind repository interfaces
- **Transaction management**: Use TypeORM transactions for data consistency

#### Controller Best Practices
- **Thin controllers**: Controllers should only handle HTTP concerns
- **Consistent naming**: Use RESTful conventions (GET /posts, POST /posts, etc.)
- **Response serialization**: Use interceptors for consistent response formatting
- **API versioning**: Implement versioning strategy (URL or header-based)

```typescript
@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  async findAll(@Query() query: GetPostsDto): Promise<PostResponseDto[]> {
    return this.postsService.findAll(query);
  }
}
```

#### Security Best Practices
- **Helmet**: Use helmet middleware for security headers
- **CORS**: Configure CORS appropriately for your frontend
- **Rate limiting**: Implement rate limiting with @nestjs/throttler
- **Authentication guards**: Use guards for route protection
- **Input sanitization**: Sanitize user input to prevent XSS and SQL injection

```typescript
// Example rate limiting
@UseGuards(ThrottlerGuard)
@Throttle(3, 60) // 3 requests per minute
@Post()
async create(@Body() createPostDto: CreatePostDto) {
  return this.postsService.create(createPostDto);
}
```

#### Testing Strategy
- **Unit tests**: Test services and business logic in isolation
- **Integration tests**: Test module interactions and database operations
- **E2E tests**: Test complete API workflows
- **Test coverage**: Maintain minimum 80% code coverage
- **Mock providers**: Use custom providers for testing

```typescript
// Example test
describe('PostsService', () => {
  let service: PostsService;
  let repository: MockType<Repository<Post>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repository = module.get(getRepositoryToken(Post));
  });
});
```

#### Configuration Management
- **Config module**: Use @nestjs/config for environment variables
- **Configuration validation**: Validate config with Joi schemas
- **Environment-specific**: Separate configs for dev, staging, production
- **Secrets management**: Never commit secrets, use environment variables

```typescript
// Example configuration
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number().default(3000),
      }),
    }),
  ],
})
```

#### Performance Optimization
- **Caching**: Implement caching with @nestjs/cache-manager
- **Database queries**: Optimize queries with proper indexing and eager/lazy loading
- **Pagination**: Always paginate large datasets
- **Compression**: Enable response compression
- **Connection pooling**: Configure appropriate database connection pools

#### Logging and Monitoring
- **Structured logging**: Use Winston or Pino for structured logs
- **Request IDs**: Add correlation IDs to track requests
- **Performance monitoring**: Integrate APM tools (New Relic, DataDog)
- **Health checks**: Implement health check endpoints
- **Metrics**: Export metrics for monitoring (Prometheus format)

```typescript
// Example logging
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    this.logger.log(`${method} ${url} - Request started`);

    return next.handle().pipe(
      tap(() => this.logger.log(`${method} ${url} - Request completed`)),
    );
  }
}
```

### File Structure for NestJS Backend

```
src/
├── common/
│   ├── decorators/       # Custom decorators
│   ├── filters/          # Exception filters
│   ├── guards/           # Authentication/authorization guards
│   ├── interceptors/     # Request/response interceptors
│   ├── pipes/            # Validation pipes
│   └── middleware/       # Custom middleware
├── config/
│   ├── database.config.ts
│   └── app.config.ts
├── modules/
│   ├── posts/
│   │   ├── dto/
│   │   │   ├── create-post.dto.ts
│   │   │   └── update-post.dto.ts
│   │   ├── entities/
│   │   │   └── post.entity.ts
│   │   ├── posts.controller.ts
│   │   ├── posts.service.ts
│   │   ├── posts.repository.ts
│   │   ├── posts.module.ts
│   │   └── posts.service.spec.ts
│   ├── comments/
│   │   └── ... (similar structure)
│   └── shared/
│       └── shared.module.ts
├── app.module.ts
└── main.ts
```

### Development Workflow

```bash
# NestJS CLI commands
npm run start:dev      # Development with watch mode
npm run build         # Build for production
npm run start:prod    # Production mode
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Test coverage
npm run lint          # ESLint
npm run format        # Prettier formatting
```

## Success Criteria

- Posts and comments function correctly with real-time updates
- Modern, simple UI design following the design tokens
- Pagination works smoothly without page reloads
- Mobile-responsive with appropriate touch targets
- Database response times under 100ms
- RLS policies properly restricting access to hidden content
- Application-level rate limiting prevents spam
- NestJS backend follows all best practices outlined above
- API documentation available via Swagger
- Minimum 80% test coverage on backend
- Deployed and accessible to third-party users