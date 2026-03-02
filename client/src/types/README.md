# Generated API Types

**Single source of truth (backend):** `backend/src/domain/schemas/`. The DTOs that define request/response for every API endpoint are based on these schemas. Swagger is generated from those DTOs, and this folder is generated from the Swagger spec.

**Flow:** Backend schemas → DTOs (per endpoint) → Swagger doc → `openapi-typescript` → this folder. Do not edit `api.types.ts` by hand.

**In the frontend:** Prefer the `../domain/` types; they re-export and rename these for cleaner use in the app.

**Regenerate:** Backend running (e.g. port 3001), then from the frontend directory:

```bash
npm run generate:api-types
```

Run after any change to backend schemas or DTOs.



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
