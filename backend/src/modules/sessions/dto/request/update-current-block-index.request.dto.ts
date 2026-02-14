import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * Update Current Block Index Request Schema
 *
 * Validates current block index (must be non-negative integer).
 */
const updateCurrentBlockIndexRequestSchema = z.object({
  currentBlockIndex: z
    .number()
    .int()
    .min(0, 'Block index must be 0 or greater')
    .describe('The index of the current block being viewed (0-based) by the user'),
});

/**
 * Update Current Block Index Request DTO
 *
 * Request body for updating the current block index in a session.
 */
export class UpdateCurrentBlockIndexRequestDto extends createZodDto(
  updateCurrentBlockIndexRequestSchema,
) {}
