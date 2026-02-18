import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { summaryBlockSchema } from '../../../../domain/schemas/blocks/summary-block.schema';

/**
 * Generate Summary Block Response Schema
 *
 * Returns the generated summary block along with session metadata.
 * Note: learningGoal and bloomsLevel are not included as they are already
 * stored in the frontend from the session data.
 */
const generateSummaryBlockResponseSchema = z.object({
  summaryBlock: summaryBlockSchema.describe('Generated summary block'),
  sessionDuration: z.number().describe('Session duration in minutes'),
  totalBlocks: z.number().describe('Total number of blocks in the session'),
});

/**
 * Generate Summary Block Response DTO
 */
export class GenerateSummaryBlockResponseDto extends createZodDto(generateSummaryBlockResponseSchema) {}
