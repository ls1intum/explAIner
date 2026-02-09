import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateLearningGoalsRequestDto {
  @ApiProperty({ 
    description: 'The learning topic or question to generate learninggoals for',
    example: 'Photosynthesis'
  })
  @IsString()
  topic: string;

  @ApiProperty({ 
    description: 'Keywords describing prior knowledge (optional)',
    example: 'plants, light, energy',
    required: false
  })
  @IsOptional()
  @IsString()
  priorKnowledgeKeywords?: string;
}
