import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Continue Session Response Schema
const continueSessionResponseSchema = z.object({
  action: z
    .enum(['navigate', 'next-sequence', 'summary', 'prompt-user'])
    .describe('Next action to take in the session flow')
    .meta({ example: 'navigate' }),
  targetBlockIndex: z
    .number()
    .optional()
    .describe('Order index to navigate to (only present for "navigate" action)')
    .meta({ example: 3 }),
});

export class ContinueSessionResponseDto extends createZodDto(continueSessionResponseSchema) {}
