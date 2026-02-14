import { ApiProperty } from '@nestjs/swagger';

export class GenerateChatResponseResponseDto {
  @ApiProperty({ description: 'AI response from Owlbert' })
  response: string;
}
