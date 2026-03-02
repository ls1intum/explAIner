import { Injectable, NotFoundException } from '@nestjs/common';
import { BlockSchema } from '../../../domain/schemas/base/blocks/block.schema';
import { GetBlockResponseDto } from '../dto/response/get-block.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { mapToBlockResponseDto } from '../../shared/shared.utils';
import { BlocksRepository } from '../../shared/database/repositories/blocks.repository';

/** Service fetching a single block by order index */
@Injectable()
export class GetBlockService {
  constructor(private blocksRepository: BlocksRepository) {}

  @LogService()
  async getBlock(
    sessionId: string,
    orderIndex: number,
  ): Promise<GetBlockResponseDto> {

    // Fetch block data
    const block = await this.blocksRepository.findBlockBySessionIdAndOrderIndex(sessionId, orderIndex);
    if (!block) {
      throw new NotFoundException(
        `Block not found for session ${sessionId} at order index ${orderIndex}`,
      );
    }

    // Return response
    try {
      return { data: BlockSchema.parse(mapToBlockResponseDto(block)) };
    } catch {
      throw new NotFoundException('Invalid block type or missing block content');
    }
  }
}
