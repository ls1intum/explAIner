# Generated API Types

**Single source of truth (server):** `server/src/domain/schemas/`. The DTOs that define request/response for every API endpoint are based on these schemas. Swagger is generated from those DTOs, and this folder is generated from the Swagger spec.

**Flow:** Server schemas → DTOs (per endpoint) → Swagger doc → `openapi-typescript` → this folder. Do not edit `api.types.ts` by hand.

**In the client:** Prefer the `../domain/` types; they re-export and rename these for cleaner use in the app.

**Regenerate:** Server running (e.g. port 3001), then from the client directory:

```bash
npm run generate:api-types
```

Run after any change to server schemas or DTOs.



## Workflow

1. **Server developer changes DTO:**
   ```typescript
   // server/src/modules/sessions/dto/...
   export class SessionDto {
     @ApiProperty()
     newField: string; // Added new field
   }
   ```

2. **Client developer regenerates types:**
   ```bash
   cd client
   npm run generate:api-types
   ```

3. **TypeScript shows errors where updates needed:**
   ```typescript
   // TypeScript error: Property 'newField' is missing
   const session: Session = { ... };
   ```

4. **Fix errors and commit both changes:**
   - Server DTO changes
   - Generated types (if committed)
   - Client code using new field
