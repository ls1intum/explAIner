import { Injectable, NotFoundException } from '@nestjs/common';
import { SubmitAnswerRequestDto } from '../dto/request/submit-answer.request.dto';
import { SubmitAnswerResponseDto } from '../dto/response/submit-answer.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { isStudentAnswerCorrect } from '../block.utils';
import { BlocksRepository } from '../../shared/database/repositories/blocks.repository';

/** Service evaluating correctness of a student answer on a practice block question */
@Injectable()
export class SubmitAnswerService {
  constructor(private blocksRepository: BlocksRepository) {}

  @LogService()
  async submit(
    sessionId: string,
    orderIndex: string,
    dto: SubmitAnswerRequestDto,
  ): Promise<SubmitAnswerResponseDto> {

    // Convert orderIndex to number (URL parameters are always strings)
    const orderIndexNum = parseInt(orderIndex, 10);

    // Fetch practice block data
    const block = await this.blocksRepository.findPracticeBlockBySessionIdAndOrderIndex(sessionId, orderIndexNum);
    if (!block?.practiceBlock) {
      throw new NotFoundException('Practice block not found');
    }

    // Evaluate correctness
    const studentAnswerIsCorrect = isStudentAnswerCorrect(
      block.practiceBlock.correctAnswerOptionIndices,
      dto.studentAnswerOptionIndices,
    );

    // Persist student answer & correctness in database
    await this.blocksRepository.updatePracticeBlockAnswer(block.id, {
      studentAnswerOptionIndices: dto.studentAnswerOptionIndices,
      studentAnswerIsCorrect,
    });

    // Return response
    return {
      success: true as const,
      studentAnswerOptionIndices: dto.studentAnswerOptionIndices,
    };
  }
}
