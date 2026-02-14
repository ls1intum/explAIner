import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateChatResponseRequestDto {
  @ApiProperty({ 
    description: 'User message / follow-up question sent in the inform block chat',
    example: 'Can you explain more about chloroplasts?'
  })
  @IsString()
  message: string;
}
