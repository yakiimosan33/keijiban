# Task Completion Checklist

## Before Completing Any Task
1. **Code Quality**
   - [ ] Run `npm run lint` - fix all ESLint issues
   - [ ] Run `npm run format` - apply Prettier formatting
   - [ ] Run `npx tsc --noEmit` - check TypeScript compilation
   - [ ] Verify code follows project conventions

2. **Testing Requirements**  
   - [ ] Write unit tests for new services/business logic
   - [ ] Write integration tests for API endpoints
   - [ ] Ensure test coverage remains above 80%
   - [ ] Run `npm run test:cov` to verify coverage
   - [ ] All tests must pass: `npm run test` and `npm run test:e2e`

3. **API Development Specific**
   - [ ] Add Swagger documentation (@ApiProperty, @ApiOperation)
   - [ ] Implement proper validation with DTOs
   - [ ] Add error handling with custom exceptions
   - [ ] Test endpoints manually or with integration tests
   - [ ] Verify rate limiting is applied where needed

4. **Database Changes**
   - [ ] Create migration scripts
   - [ ] Test migration rollback
   - [ ] Verify RLS policies work correctly
   - [ ] Check index performance with EXPLAIN
   - [ ] Update TypeScript type definitions

## After Code Changes
1. **Build Verification**
   - [ ] `npm run build` - ensure production build works
   - [ ] No TypeScript compilation errors
   - [ ] No circular dependencies

2. **Security Checks**
   - [ ] Verify no sensitive data in commits
   - [ ] Check environment variables are properly configured
   - [ ] Validate input sanitization is working
   - [ ] Confirm authentication/authorization where needed

3. **Documentation Updates**
   - [ ] Update inline code comments
   - [ ] Update Swagger documentation
   - [ ] Update README if needed (API endpoints, setup instructions)
   - [ ] Update CLAUDE.md if architecture changes

## Deployment Checklist
1. **Pre-deployment**
   - [ ] All tests passing
   - [ ] Build succeeds
   - [ ] Environment variables configured
   - [ ] Database migrations applied

2. **Post-deployment**
   - [ ] Smoke test critical functionality
   - [ ] Verify real-time subscriptions working
   - [ ] Check API response times (<100ms target)
   - [ ] Monitor error logs

## Git Workflow
1. **Before Commit**
   - [ ] `git status` - review staged changes
   - [ ] `git diff` - review actual changes
   - [ ] Meaningful commit message following conventional commits

2. **Before Push**
   - [ ] `git log --oneline -5` - review recent commits
   - [ ] Pull latest changes: `git pull origin main`
   - [ ] Resolve any merge conflicts
   - [ ] Final test run after merge

## Performance Verification
- [ ] Database queries under 100ms (use EXPLAIN ANALYZE)
- [ ] Bundle size within acceptable limits
- [ ] Memory usage within normal ranges
- [ ] No memory leaks in long-running processes