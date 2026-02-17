import { z } from 'zod';
import { extractJsonFromMarkdown } from '../../common/utils/json-parser.util';

/**
 * Generic parser for LLM outputs
 * Extracts JSON from markdown, parses, and validates using provided Zod schema
 */
export class Parser<T> {
  private readonly schemaName: string;

  constructor(private readonly schema: z.ZodSchema<T>) {
    // Extract schema type name from Zod's internal _def property
    this.schemaName = (this.schema as any)._def?.typeName || 'Unknown';
  }

  /**
   * Parse and validate LLM output using the configured Zod schema
   * @param text Raw LLM output (may contain markdown code blocks)
   * @returns Validated parsed object
   */
  parse(text: string): T {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonText = extractJsonFromMarkdown(text);

      // Parse JSON
      const parsed = JSON.parse(jsonText);

      // Validate using Zod schema
      const validated = this.schema.parse(parsed);

      return validated;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse LLM output against Schema ${this.schemaName}: ${error.message}`);
      }
      throw new Error(`Failed to parse LLM output against Schema ${this.schemaName}: Unknown error`);
    }
  }
}
