# Suggested Commands for Development

## Development Server Commands
```bash
# Start development server with hot reload
npm run start:dev

# Start in debug mode
npm run start:debug

# Build for production
npm run build

# Start production server
npm run start:prod
```

## Code Quality Commands
```bash
# Run linter with auto-fix
npm run lint

# Format code with Prettier
npm run format

# Type checking
npx tsc --noEmit
```

## Testing Commands
```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Generate test coverage report
npm run test:cov

# Debug tests
npm run test:debug
```

## NestJS CLI Commands (Development)
```bash
# Generate new module
nest generate module posts

# Generate controller
nest generate controller posts

# Generate service  
nest generate service posts

# Generate full CRUD resource
nest generate resource posts
```

## Database Commands (via Supabase MCP)
```bash
# These will be available through Claude's MCP tools:
# - Create tables
# - Apply migrations
# - Execute SQL queries
# - Generate TypeScript types
```

## Git Commands (Standard)
```bash
# Check status
git status

# Add and commit changes
git add .
git commit -m "message"

# Push to remote
git push origin main
```

## System Commands (macOS Darwin)
```bash
# List files
ls -la

# Find files
find . -name "*.ts"

# Search in files  
grep -r "searchterm" src/

# Check running processes
ps aux | grep node
```

## Package Management
```bash
# Install dependencies
npm install

# Add new dependency
npm install package-name

# Add dev dependency
npm install -D package-name

# Update dependencies
npm update

# Check outdated packages
npm outdated
```

## Project Setup Commands (Still Needed)
```bash
# Next.js setup (not done yet)
npx create-next-app@latest frontend --typescript --tailwind --app

# Install missing NestJS dependencies
npm install @nestjs/config @nestjs/typeorm typeorm @supabase/supabase-js
npm install class-validator class-transformer @nestjs/swagger
```