import { ApiProperty } from '@nestjs/swagger';

export class SendMessageResponseDto {
  @ApiProperty({ description: 'AI response from Owlbert' })
  response: string;
}
