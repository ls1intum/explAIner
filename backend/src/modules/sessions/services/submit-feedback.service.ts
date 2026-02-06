import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SubmitFeedbackRequestDto } from '../dto/submit-feedback.request.dto';
import { SubmitFeedbackResponseDto } from '../dto/submit-feedback.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';

@Injectable()
export class SubmitFeedbackService {
  constructor(private prisma: PrismaService) {}

  @LogService()
  async submit(sessionId: string, dto: SubmitFeedbackRequestDto): Promise<SubmitFeedbackResponseDto> {
    // Check if session exists
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Update session with user feedback
    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        userFeedback: dto.rating,
      },
    });

    return { success: true, rating: dto.rating };
  }
}
