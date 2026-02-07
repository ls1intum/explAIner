import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateEasierLearningGoalsRequestDto {
  @ApiProperty({ 
    description: 'Session ID of the existing session to generate easier learning goals for'
  })
  @IsString()
  sessionId: string;
}
