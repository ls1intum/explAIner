import { ApiProperty } from '@nestjs/swagger';
import { BloomsLevel } from '@prisma/client';

/**
 * Learning Goal DTO
 *
 * Represents a single learning goal with Bloom's taxonomy level.
 * Used as the base DTO for all learning goal responses.
 */
export class LearningGoalDto {
  @ApiProperty({ 
    description: 'The learning goal following the format "After this session, you will be able to <BloomsLevel> <objective>."',
    example: 'After this session, you will be able to Understand the process of photosynthesis.'
  })
  learningGoal: string;

  @ApiProperty({ 
    description: 'Bloom\'s taxonomy level for this learning goal',
    enum: BloomsLevel,
    example: BloomsLevel.Understand
  })
  bloomsLevel: BloomsLevel;
}
