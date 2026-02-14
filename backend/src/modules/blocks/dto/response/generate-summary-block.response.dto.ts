import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { GetBlockResponseDto } from './get-block-by-order-index.response.dto';

// Session Stats Schema
const sessionStatsSchema = z.object({
  learningGoal: z.string().describe('Learning goal for the session'),
  bloomsLevel: z.string().describe('Bloom\'s taxonomy level'),
  totalBlocks: z.number().describe('Total number of blocks in the session'),
  sessionDuration: z.number().describe('Session duration in minutes'),
});

export class SessionStatsDto extends createZodDto(sessionStatsSchema) {}

/**
 * Generate Summary Block Response DTO
 *
 * Wrapper DTO for summary block generation response.
 * Note: Kept as class-based DTO since it references GetBlockResponseDto.
 */
export class GenerateSummaryBlockResponseDto {
  @ApiProperty({ description: 'Generated summary block', type: GetBlockResponseDto })
  block: GetBlockResponseDto;

  @ApiProperty({ description: 'Session statistics for the summary', type: SessionStatsDto })
  sessionStats: SessionStatsDto;
}
