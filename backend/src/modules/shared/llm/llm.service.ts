import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { Parser } from './llm.parser';

@Injectable()
export class LlmService {
  private anthropic: Anthropic;
  private readonly model: string;

  /** Parser with retry wired to this service; pass only the schema. */
  createParser<T>(schema: z.ZodSchema<T>): Parser<T> {
    return new Parser(schema, (p) => this.callClaude(p));
  }

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('anthropic.apiKey');
    this.model = this.configService.get<string>('anthropic.model')!;
    this.anthropic = new Anthropic({ apiKey });
  }

  /** Call Claude with a prompt and return raw text response */
  async callClaude(prompt: string): Promise<string> {
    try {
      const rawResponseMessage = await this.anthropic.messages.create({
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
      const content = rawResponseMessage.content.find(
        (block) => block.type === 'text',
      );
      if (!content || content.type !== 'text') {
        throw new Error('No text content in Claude response');
      }

      return content.text;
    } catch (error) {
      throw new Error(`Failed to call Claude: ${error.message}`);
    }
  }
}
