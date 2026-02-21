import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GenerateChatResponseChain } from '../../ai/llm/chains/generate-chat-response.chain';
import { GenerateChatResponseRequestDto } from '../dto/request/generate-chat-response.request.dto';
import { GenerateChatResponseResponseDto } from '../dto/response/generate-chat-response.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { mapChatResponse } from '../block.utils';

@Injectable()
export class GenerateChatResponseService {
  constructor(
    private prisma: PrismaService,
    private generateChatResponseChain: GenerateChatResponseChain,
  ) {}

  @LogService()
  async send(
    sessionId: string,
    orderIndex: string,
    dto: GenerateChatResponseRequestDto,
  ): Promise<GenerateChatResponseResponseDto> {
    const orderIndexNum = parseInt(orderIndex, 10);

    // Get block, session, and inform block messages
    const block = await this.prisma.block.findUnique({
      where: {
        sessionId_orderIndex: {
          sessionId,
          orderIndex: orderIndexNum,
        },
      },
      include: {
        session: true,
        informBlock: {
          include: {
            messages: { orderBy: { timestamp: 'asc' } },
          },
        },
      },
    });

    if (!block?.informBlock) {
      throw new NotFoundException('Block not found');
    }

    const informBlockId = block.informBlock.blockId;
    // Build conversation history in memory (include new user message for LLM context).
    const existingHistory = block.informBlock.messages
      .map((msg) => `${msg.sender}: ${msg.message}`)
      .join('\n');
    const conversationHistory = existingHistory
      ? `${existingHistory}\nUser: ${dto.message}`
      : `User: ${dto.message}`;

    // Generate AI response before any DB writes (keep transaction short).
    const chatResponse = await this.generateChatResponseChain.execute({
      topic: block.session.topic,
      learningGoal: block.session.learningGoal,
      bloomsLevel: block.session.learningGoalBloomsLevel,
      userMessage: dto.message,
      conversationHistory,
    });

    // Atomic: both messages commit together or roll back.
    const [, owlbertMessage] = await this.prisma.$transaction([
      this.prisma.informBlockMessage.create({
        data: { informBlockId, message: dto.message, sender: 'User' },
      }),
      this.prisma.informBlockMessage.create({
        data: {
          informBlockId,
          message: chatResponse.response,
          sender: 'Owlbert',
        },
      }),
    ]);

    return mapChatResponse(owlbertMessage.message);
  }
}
