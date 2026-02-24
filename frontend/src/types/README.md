# Frontend Types Documentation

## Type Structure (Best Practice)

This project follows industry best practices for managing TypeScript types in a frontend-backend setup with OpenAPI/Swagger.

### Folder Structure

```
frontend/src/types/
├── generated/           # Auto-generated from OpenAPI spec
│   ├── api.types.ts    # Generated types (DO NOT EDIT MANUALLY)
│   └── index.ts        # Re-exports
├── domain/             # API contract types (re-exports from generated)
│   ├── session.types.ts
│   ├── block.types.ts
│   ├── learning-goals.types.ts
│   ├── enums.ts
│   └── index.ts
└── ui/                 # Frontend-only types
    ├── page-data.types.ts
    └── index.ts
```

## Type Categories

### 1. Generated Types (`generated/`)

**Source:** Auto-generated from OpenAPI specification via `openapi-typescript`

**Purpose:** Single source of truth for API contracts

**Usage:** Import from `domain/` instead of directly from here

**Regenerate:** `npm run generate:api-types` (in frontend directory)

**When to regenerate:**
- After any backend DTO changes
- After adding/modifying Swagger decorators
- Before creating a pull request that changes API contracts

### 2. Domain Types (`domain/`)

**Source:** Re-exports from generated types with cleaner names

**Purpose:** Provide convenient, readable imports for API types throughout the app

**Usage:**
```typescript
import { Block, Session, LearningGoal } from '@/types/domain';
import { BlockType } from '@/types/domain';
```

**Examples:**
- `Block` → `components['schemas']['GetBlockResponseDto_Output']['data']` (get-block returns `{ data: Block }`)
- `Session` → `components['schemas']['GetSessionResponseDto_Output']`
- `LearningGoal` → `components['schemas']['LearningGoalDto']`

### 3. UI Types (`ui/`)

**Source:** Manually defined for frontend-specific needs

**Purpose:** Types that are NOT part of the API contract

**Usage:**
```typescript
import { LearningGoalPageData } from '@/types/ui';
```

**Examples:**
- `LearningGoalPageData` - Data passed between pages in the frontend
- Component prop types (if needed)
- Frontend state types (if not covered by Redux)

## Best Practices

### ✅ Do's

1. **Use domain types in components:**
   ```typescript
   import type { Block } from '@/types/domain';
   ```

2. **Regenerate types after backend changes:**
   ```bash
   npm run generate:api-types
   ```

3. **Add UI-specific types to `ui/` folder:**
   ```typescript
   // ui/page-data.types.ts
   export interface MyCustomPageData {
     // Frontend-only fields
   }
   ```

4. **Use BlockType constants:**
   ```typescript
   if (block.type === BlockType.INFORM) { ... }
   ```

### ❌ Don'ts

1. **Don't edit generated types manually:**
   - Never edit `generated/api.types.ts` directly
   - Changes will be overwritten on next generation

2. **Don't duplicate API types:**
   - Don't manually create types that exist in the API
   - Always use domain re-exports

3. **Don't import from generated directly in components:**
   ```typescript
   // Bad
   import type { components } from '@/types/generated';
   type Block = components['schemas']['GetBlockResponseDto_Output']['data'];

   // Good
   import type { Block } from '@/types/domain';
   ```

## Migration Guide

If you see old import patterns, update them:

```typescript
// Old (deprecated)
import { Block } from '@/types/session.types';
import { LearningGoal } from '@/types/learning-goals.types';
import { BlockType } from '@/types/enums';

// New (current)
import { Block, LearningGoal, BlockType } from '@/types/domain';
```

## Type Safety Benefits

1. **Single Source of Truth:** Backend DTOs → OpenAPI → Frontend types
2. **No Manual Sync:** Types automatically match backend changes
3. **Compile-Time Safety:** TypeScript catches API contract mismatches
4. **IntelliSense:** Full autocomplete for API types
5. **Refactoring Safety:** Rename detection across frontend/backend

## Workflow

1. **Backend developer changes DTO:**
   ```typescript
   // backend/src/modules/sessions/dto/...
   export class SessionDto {
     @ApiProperty()
     newField: string; // Added new field
   }
   ```

2. **Frontend developer regenerates types:**
   ```bash
   cd frontend
   npm run generate:api-types
   ```

3. **TypeScript shows errors where updates needed:**
   ```typescript
   // TypeScript error: Property 'newField' is missing
   const session: Session = { ... };
   ```

4. **Fix errors and commit both changes:**
   - Backend DTO changes
   - Generated types (if committed)
   - Frontend code using new field
