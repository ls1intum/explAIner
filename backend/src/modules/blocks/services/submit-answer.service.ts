import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SubmitAnswerRequestDto } from '../dto/request/submit-answer.request.dto';
import { SubmitAnswerResponseDto } from '../dto/response/submit-answer.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import {
  isStudentAnswerCorrect,
  mapSubmitAnswerResponse,
} from '../block.utils';

/** Service evaluating correctness of a student answer on a practice block question */
@Injectable()
export class SubmitAnswerService {
  constructor(private prisma: PrismaService) {}

  @LogService()
  async submit(
    sessionId: string,
    orderIndex: string,
    dto: SubmitAnswerRequestDto,
  ): Promise<SubmitAnswerResponseDto> {

    // Convert orderIndex to number (URL parameters are always strings)
    const orderIndexNum = parseInt(orderIndex, 10);

    // Fetch practice block data
    const block = await this.prisma.block.findUnique({
      where: {
        sessionId_orderIndex: { sessionId, orderIndex: orderIndexNum },
      },
      include: { practiceBlock: true },
    });
    if (!block?.practiceBlock) {
      throw new NotFoundException('Practice block not found');
    }

    // Evaluate correctness
    const studentAnswerIsCorrect = isStudentAnswerCorrect(
      block.practiceBlock.correctAnswerOptionIndices,
      dto.studentAnswerOptionIndices,
    );

    // Persist student answer & correctness in database
    await this.prisma.practiceBlock.update({
      where: { blockId: block.id },
      data: {
        studentAnswerOptionIndices: dto.studentAnswerOptionIndices,
        studentAnswerIsCorrect,
      },
    });

    // Return response
    return mapSubmitAnswerResponse(dto.studentAnswerOptionIndices);
  }
}
