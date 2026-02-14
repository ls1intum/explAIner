import { ApiProperty } from '@nestjs/swagger';
import { GetBlockResponseDto } from '../../../blocks/dto/response/get-block-by-order-index.response.dto';
import { SessionInfoDto } from '../session-info.dto';

/**
 * Create Session Response DTO
 *
 * Wrapper DTO for session creation response.
 * Note: Kept as class-based DTO since it references other DTOs.
 */
export class CreateSessionResponseDto {
  @ApiProperty({ description: 'Session information', type: SessionInfoDto })
  session: SessionInfoDto;

  @ApiProperty({ description: 'Initial block sequence (1 inform + 3 practice)', type: [GetBlockResponseDto] })
  blocks: GetBlockResponseDto[];
}
