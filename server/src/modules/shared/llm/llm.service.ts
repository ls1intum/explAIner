import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { z } from 'zod';
import { Parser } from './llm.parser';

@Injectable()
export class LlmService {
  private client: OpenAI;
  private readonly model: string;

  /** Parser with retry wired to this service; pass only the schema. */
  createParser<T>(schema: z.ZodSchema<T>): Parser<T> {
    return new Parser(schema, (p) => this.callClaude(p));
  }

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('llm.apiKey');
    const baseURL = this.configService.get<string>('llm.baseUrl');
    this.model = this.configService.get<string>('llm.model')!;
    this.client = new OpenAI({ apiKey, baseURL });
  }

  /** Call LLM with a prompt and return raw text response */
  async callClaude(prompt: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No text content in LLM response');
      }

      return content;
    } catch (error) {
      throw new Error(`Failed to call LLM: ${error.message}`);
    }
  }
}
