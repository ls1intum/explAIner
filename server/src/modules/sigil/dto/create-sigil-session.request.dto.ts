import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateSigilSessionRequestDtoSchema = z.object({
  mode: z.enum(['elements', 'details', 'analysis', 'chat']),
  lang: z.enum(['de', 'en']).default('de'),
});

export class CreateSigilSessionRequestDto extends createZodDto(CreateSigilSessionRequestDtoSchema) {}
