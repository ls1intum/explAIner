import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GenerateChatResponseChain } from '../../ai/llm/chains/generate-chat-response.chain';
import { GenerateChatResponseRequestDto } from '../dto/request/generate-chat-response.request.dto';
import { GenerateChatResponseResponseDto } from '../dto/response/generate-chat-response.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { buildConversationHistory, mapChatResponse } from '../block.utils';

/** Generates chat responses to users' follow-up questions on inform blocks */
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

    // Convert orderIndex to number (URL parameters are always strings)
    const orderIndexNum = parseInt(orderIndex, 10);

    // Fetch inform block
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

    // Build conversation history
    const conversationHistory = buildConversationHistory(
      block.informBlock.messages,
      dto.message,
    );

    // Call chain 
    const chatResponse = await this.generateChatResponseChain.execute({
      topic: block.session.topic,
      learningGoal: block.session.learningGoal,
      bloomsLevel: block.session.learningGoalBloomsLevel,
      userMessage: dto.message,
      conversationHistory,
    });

    // Persist both messages in database
    const informBlockId = block.informBlock.blockId;
    const [, owlbertMessage] = await this.prisma.$transaction([

      // User question
      this.prisma.informBlockMessage.create({
        data: { informBlockId, message: dto.message, sender: 'User' },
      }),

      // Owlbert response
      this.prisma.informBlockMessage.create({
        data: {
          informBlockId,
          message: chatResponse.response,
          sender: 'Owlbert',
        },
      }),
    ]);

    // Return response
    return mapChatResponse(owlbertMessage.message);
  }
}
