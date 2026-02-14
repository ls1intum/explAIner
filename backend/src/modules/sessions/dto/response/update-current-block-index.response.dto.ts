import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Update Current Block Index Response Schema
const updateCurrentBlockIndexResponseSchema = z.object({
  success: z.boolean().describe('Whether the current block index was successfully updated'),
  currentBlockIndex: z.number().describe('The updated current block index (0-based)'),
});

export class UpdateCurrentBlockIndexResponseDto extends createZodDto(updateCurrentBlockIndexResponseSchema) {}
