import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateSigilSessionRequestDtoSchema = z.object({
  group: z.enum(['explainer', 'chat', 'text']),
  section: z.enum(['elements', 'details', 'all']),
  lang: z.enum(['de', 'en']).default('de'),
});

export class CreateSigilSessionRequestDto extends createZodDto(CreateSigilSessionRequestDtoSchema) {}
