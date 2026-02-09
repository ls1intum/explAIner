import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BloomsLevel } from '@prisma/client';

export class CreateSessionRequestDto {
  @ApiProperty({ 
    description: 'The learning topic or question for the session',
    example: 'Photosynthesis'
  })
  @IsString()
  topic: string;

  @ApiProperty({ 
    description: 'Keywords indicating what the user already knows about the learning topic or question (optional)',
    example: 'plants, chlorophyll, light energy',
    required: false
  })
  @IsOptional()
  @IsString()
  priorKnowledgeKeywords?: string;

  @ApiProperty({ 
    description: 'The specific learning goal for this session',
    example: 'After this session, you will be able to Understand the process of photosynthesis in plants.'
  })
  @IsString()
  learningGoal: string;

  @ApiProperty({ 
    description: 'Bloom\'s taxonomy level for the learning goal',
    enum: BloomsLevel,
    example: BloomsLevel.Understand
  })
  @IsEnum(BloomsLevel)
  bloomsLevel: BloomsLevel;
}
