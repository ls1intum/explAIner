import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GenerateChatResponseChain } from '../../ai/llm/chains/generate-chat-response.chain';
import { GenerateChatResponseRequestDto } from '../dto/request/generate-chat-response.request.dto';
import { GenerateChatResponseResponseDto } from '../dto/response/generate-chat-response.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { buildConversationHistory, mapChatResponse } from '../block.utils';

/** Handles user chat messages in an inform block: LLM reply + persist User + Owlbert messages. */
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

    const block = await this.prisma.block.findUnique({
      where: {
        sessionId_orderIndex: { sessionId, orderIndex: orderIndexNum },
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

    const conversationHistory = buildConversationHistory(
      block.informBlock.messages,
      dto.message,
    );

    const chatResponse = await this.generateChatResponseChain.execute({
      topic: block.session.topic,
      learningGoal: block.session.learningGoal,
      bloomsLevel: block.session.learningGoalBloomsLevel,
      userMessage: dto.message,
      conversationHistory,
    });

    const informBlockId = block.informBlock.blockId;
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
