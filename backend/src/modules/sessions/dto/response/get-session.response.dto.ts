import { ApiProperty } from '@nestjs/swagger';
import { GetBlockResponseDto } from '../../../blocks/dto/response/get-block-by-order-index.response.dto';
import { SessionInfoDto } from '../session-info.dto';

/**
 * Get Session Response DTO
 *
 * Wrapper DTO for session retrieval response.
 * Note: Kept as class-based DTO since it references other DTOs.
 */
export class GetSessionResponseDto {
  @ApiProperty({ description: 'Session information', type: SessionInfoDto })
  session: SessionInfoDto;

  @ApiProperty({ description: 'All blocks in the session', type: [GetBlockResponseDto] })
  blocks: GetBlockResponseDto[];
}
