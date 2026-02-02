import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class AiService {
  private anthropic: Anthropic;
  private readonly logger = new Logger('AI');

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('anthropic.apiKey');
    this.anthropic = new Anthropic({ apiKey });
  }

  /**
   * Call Claude with a prompt and return raw text response
   */
  async callClaude(prompt: string, promptSource?: string): Promise<string> {
    const startTime = Date.now();

    this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    this.logger.log('🤖 CLAUDE API CALL');
    this.logger.log(`Model: claude-sonnet-4-5-20250929`);
    if (promptSource) {
      this.logger.log(`Prompt: ${promptSource}`);
    }
    this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      const message = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      // Extract text content from response
      const textContent = message.content.find(
        (block) => block.type === 'text',
      );
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text content in Claude response');
      }

      const duration = Date.now() - startTime;
      const responsePreview = textContent.text.length > 200
        ? `${textContent.text.substring(0, 200)}...`
        : textContent.text;

      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.logger.log(`✅ CLAUDE RESPONSE [${duration}ms]`);
      this.logger.log(`Response Preview:\n${responsePreview}`);
      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      return textContent.text;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.logger.error(`❌ CLAUDE ERROR [${duration}ms]`);
      this.logger.error(`Error: ${error.message}`);
      this.logger.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      throw new Error(`Failed to call Claude: ${error.message}`);
    }
  }
}
