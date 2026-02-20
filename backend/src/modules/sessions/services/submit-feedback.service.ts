import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SubmitFeedbackRequestDto } from '../dto/request/submit-feedback.request.dto';
import { SubmitFeedbackResponseDto } from '../dto/response/submit-feedback.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { mapSubmitFeedbackResponse } from '../utils/session-mapper.utils';

@Injectable()
export class SubmitFeedbackService {
  constructor(private prisma: PrismaService) {}

  @LogService()
  async submit(sessionId: string, dto: SubmitFeedbackRequestDto): Promise<SubmitFeedbackResponseDto> {

    // 1. Check if session exists
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // 2. Update session with user feedback
    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        userFeedback: dto.rating,
      },
    });

    return mapSubmitFeedbackResponse(dto.rating);
  }
}
