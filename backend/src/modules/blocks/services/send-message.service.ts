import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GenerateInformBlockChatResponseChain } from '../../ai/chains/generate-inform-block-chat-response.chain';
import { SendMessageRequestDto } from '../dto/send-message.request.dto';
import { SendMessageResponseDto } from '../dto/send-message.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';

@Injectable()
export class SendMessageService {
  constructor(
    private prisma: PrismaService,
    private generateChatResponseChain: GenerateInformBlockChatResponseChain,
  ) {}

  @LogService()
  async send(
    sessionId: string,
    orderIndex: string,
    dto: SendMessageRequestDto,
  ): Promise<SendMessageResponseDto> {
    const orderIndexNum = parseInt(orderIndex, 10);

    // Get block and session
    const block = await this.prisma.block.findUnique({
      where: {
        sessionId_orderIndex: {
          sessionId,
          orderIndex: orderIndexNum,
        },
      },
      include: {
        session: true,
        informBlockMessages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!block) {
      throw new NotFoundException('Block not found');
    }

    // 1. Persist user message
    const userMessage = await this.prisma.informBlockMessage.create({
      data: {
        blockId: block.id,
        message: dto.message,
        sender: 'User',
      },
    });

    // 2. Build conversation history
    const conversationHistory = block.informBlockMessages
      .map((msg) => `${msg.sender}: ${msg.message}`)
      .join('\n');

    // 3. Generate AI response
    const chatResponse = await this.generateChatResponseChain.execute({
      topic: block.session.learningTopicOrQuestion,
      learningGoal: block.session.learningGoal,
      bloomsLevel: block.session.learningGoalBloomsLevel,
      userMessage: dto.message,
      conversationHistory,
    });

    // 4. Persist Owlbert response
    const owlbertMessage = await this.prisma.informBlockMessage.create({
      data: {
        blockId: block.id,
        message: chatResponse.response,
        sender: 'Owlbert',
      },
    });

    // 5. Return response
    return {
      response: owlbertMessage.message,
    };
  }
}
