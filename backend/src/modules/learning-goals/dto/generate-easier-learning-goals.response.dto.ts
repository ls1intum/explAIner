import { ApiProperty } from '@nestjs/swagger';
import { LearningGoalDto } from './learning-goal.dto';

/**
 * Generate Easier Learning Goals Response DTO
 *
 * Returns a wrapped response with full context (topic, priorKnowledgeKeywords)
 * since the client only sends sessionId in the request.
 */
export class GenerateEasierLearningGoalsResponseDto {
  @ApiProperty({ 
    description: 'The learning topic from the previous session',
    example: 'Photosynthesis'
  })
  topic: string;

  @ApiProperty({ 
    description: 'Prior knowledge keywords from the previous session',
    example: 'plants, light',
    required: false
  })
  priorKnowledgeKeywords?: string;

  @ApiProperty({ 
    description: 'Array of easier learning goals generated for new session',
    type: [LearningGoalDto]
  })
  learningGoals: LearningGoalDto[];
}
