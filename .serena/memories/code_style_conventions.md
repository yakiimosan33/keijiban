# Code Style and Conventions

## TypeScript Configuration
- **Strict mode**: Enabled with strict type checking
- **Target**: Modern ES modules
- **Module resolution**: Node.js style
- **Source map**: Enabled for debugging
- **Decorators**: Experimental decorators enabled for NestJS

## ESLint Configuration
- **Base**: @eslint/js recommended + typescript-eslint recommended
- **Type checking**: Full TypeScript type-aware linting enabled
- **Custom rules**:
  - `@typescript-eslint/no-explicit-any`: OFF (allows any type when needed)
  - `@typescript-eslint/no-floating-promises`: WARN
  - `@typescript-eslint/no-unsafe-argument`: WARN
- **Environment**: Node.js and Jest globals configured

## Prettier Configuration
```json
{
  "singleQuote": true,
  "trailingComma": "all"
}
```

## NestJS Conventions (from CLAUDE.md)
### File Naming
- Controllers: `*.controller.ts`
- Services: `*.service.ts` 
- Modules: `*.module.ts`
- DTOs: `*.dto.ts`
- Entities: `*.entity.ts`
- Tests: `*.spec.ts` (unit), `*.e2e-spec.ts` (E2E)

### Module Organization
- Feature-based modules (posts/, comments/, etc.)
- Barrel exports with index.ts
- Shared module for common functionality
- Constructor injection for dependencies

### API Conventions
- RESTful endpoints (GET /posts, POST /posts, etc.)
- Use DTOs for validation and documentation
- Swagger decorators (@ApiProperty, @ApiOperation)
- Consistent error handling with custom exceptions

### Code Structure
```
src/
├── common/          # Shared utilities, decorators, guards
├── config/          # Configuration modules
├── modules/         # Feature modules
│   ├── posts/
│   ├── comments/
│   └── shared/
├── app.module.ts
└── main.ts
```

## Documentation Requirements
- API documentation via Swagger
- JSDoc comments for complex business logic
- README updates for setup and deployment
- Type definitions for all public interfaces

## Testing Conventions
- Unit tests: Test services and business logic in isolation
- Integration tests: Test module interactions
- E2E tests: Test complete API workflows
- Minimum 80% code coverage requirement
- Mock providers for external dependencies