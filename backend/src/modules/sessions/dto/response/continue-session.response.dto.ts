import { ApiProperty } from '@nestjs/swagger';

export class ContinueSessionResponseDto {
  @ApiProperty({ 
    description: 'Next action to take in the session flow',
    enum: ['navigate', 'next-sequence', 'summary', 'prompt-user'],
    example: 'navigate'
  })
  action: 'navigate' | 'next-sequence' | 'summary' | 'prompt-user';

  @ApiProperty({ 
    description: 'Order index to navigate to (only present for "navigate" action)',
    required: false,
    example: 3
  })
  nextOrderIndex?: number;
}
