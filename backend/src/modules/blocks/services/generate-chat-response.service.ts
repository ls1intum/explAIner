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

    // 1. Persist user message
    await this.prisma.informBlockMessage.create({
      data: {
        informBlockId: block.informBlock!.blockId,
        message: dto.message,
        sender: 'User',
      },
    });

    // 2. Build conversation history (re-fetch to include new user message)
    const messages = await this.prisma.informBlockMessage.findMany({
      where: { informBlockId: block.informBlock!.blockId },
      orderBy: { timestamp: 'asc' },
    });
    const conversationHistory = messages
      .map((msg) => `${msg.sender}: ${msg.message}`)
      .join('\n');

    // 3. Generate AI response
    const chatResponse = await this.generateChatResponseChain.execute({
      topic: block.session.topic,
      learningGoal: block.session.learningGoal,
      bloomsLevel: block.session.learningGoalBloomsLevel,
      userMessage: dto.message,
      conversationHistory,
    });

    // 4. Persist Owlbert response
    const owlbertMessage = await this.prisma.informBlockMessage.create({
      data: {
        informBlockId: block.informBlock!.blockId,
        message: chatResponse.response,
        sender: 'Owlbert',
      },
    });

    return mapChatResponse(owlbertMessage.message);
  }
}
