import { ApiProperty } from '@nestjs/swagger';

export class DeleteSessionResponseDto {
  @ApiProperty({ description: 'Whether the session was successfully deleted' })
  success: boolean;
}
