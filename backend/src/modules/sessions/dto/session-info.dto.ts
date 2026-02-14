import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * Session Info Schema
 *
 * Shared schema for session metadata across different response DTOs.
 */
export const sessionInfoSchema = z.object({
  id: z.string().describe('Unique session identifier'),
  topic: z.string().describe('Learning topic or question'),
  learningGoal: z
    .string()
    .describe('Learning goal following the format "After this session, you will be able to <BloomsLevel> <objective>."'),
  bloomsLevel: z.string().describe('Bloom\'s taxonomy level'),
  totalBlocks: z.number().describe('Total number of blocks in the session (increases by 4 for each new block sequence)'),
  currentBlockIndex: z.number().describe('Block index (0-based) of currently / last viewed block by the user'),
});

/**
 * Session Info DTO
 *
 * Shared DTO for session metadata.
 */
export class SessionInfoDto extends createZodDto(sessionInfoSchema) {}
