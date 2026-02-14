import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Delete Session Response Schema
const deleteSessionResponseSchema = z.object({
  success: z.boolean().describe('Whether the session was successfully deleted'),
});

export class DeleteSessionResponseDto extends createZodDto(deleteSessionResponseSchema) {}
