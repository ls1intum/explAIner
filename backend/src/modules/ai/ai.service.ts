import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { isLogEnabled } from '../../common/config/logging.config';

@Injectable()
export class AiService {
  private anthropic: Anthropic;
  private readonly logger = new Logger('AI');
  private readonly model: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('anthropic.apiKey');
    this.model = this.configService.get<string>('anthropic.model')!;
    this.anthropic = new Anthropic({ apiKey });
  }

  /**
   * Call Claude with a prompt and return raw text response
   * Format: [AI] <prompt name>
   */
  async callClaude(prompt: string, promptSource?: string): Promise<string> {
    // Log AI prompt usage
    if (isLogEnabled('ai')) {
      const promptName = promptSource 
        ? promptSource.replace('.prompt.ts', '')
        : 'unknown-prompt';
      this.logger.log(promptName);
    }

    try {
      const message = await this.anthropic.messages.create({
        model: this.model,
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

      return textContent.text;
    } catch (error) {
      if (isLogEnabled('ai')) {
        const promptName = promptSource 
          ? promptSource.replace('.prompt.ts', '')
          : 'unknown-prompt';
        this.logger.error(`${promptName} Error: ${error.message}`);
      }
      throw new Error(`Failed to call Claude: ${error.message}`);
    }
  }
}
