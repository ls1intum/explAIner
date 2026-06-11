import { Injectable, NotFoundException } from '@nestjs/common';
import { GenerateChatResponseChain } from '../../shared/llm/chains/generate-chat-response.chain';
import { GenerateChatResponseRequestDto } from '../dto/request/generate-chat-response.request.dto';
import { GenerateChatResponseResponseDto } from '../dto/response/generate-chat-response.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { buildChatHistory } from '../blocks.utils';
import { BlocksRepository } from '../../shared/database/repositories/blocks.repository';
import { SIGIL_STATE_COLORS_REFERENCE, type SigilLang } from '../../sigil/sigil.config';

/** Service generating a chat response to user follow-up question on inform block */
@Injectable()
export class GenerateChatResponseService {
  constructor(
    private blocksRepository: BlocksRepository,
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
    const block = await this.blocksRepository.findInformBlockBySessionIdAndOrderIndexWithInformMessages(sessionId, orderIndexNum);
    if (!block?.informBlock) {
      throw new NotFoundException('Block not found');
    }

    // Build conversation history
    const conversationHistory = buildChatHistory(
      block.informBlock.messages,
      dto.message,
    );

    // Sigil sessions: give the assistant the state-color reference knowledge
    // (not shown in the material) so it can answer color questions correctly.
    const lang = block.session.lang;
    const referenceKnowledge =
      block.session.sigilMode && (lang === 'de' || lang === 'en')
        ? SIGIL_STATE_COLORS_REFERENCE[lang as SigilLang]
        : undefined;

    // Call chain
    const chatResponse = await this.generateChatResponseChain.execute({
      topic: block.session.topic,
      learningGoal: block.session.learningGoal,
      bloomsLevel: block.session.learningGoalBloomsLevel,
      userMessage: dto.message,
      conversationHistory,
      lang,
      referenceKnowledge,
    });

    // Persist both messages in database
    const informBlockId = block.informBlock.blockId;
    const owlbertMessage = await this.blocksRepository.createInformBlockMessages(
      informBlockId,
      dto.message,
      chatResponse.response,
    );

    // Return response
    return { response: owlbertMessage.message };
  }
}
