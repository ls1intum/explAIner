/**
 * Extracts JSON content from text, handling markdown code blocks if present
 * Supports both ```json and plain ``` code blocks
 * 
 * @param text - Raw text that may contain JSON wrapped in markdown code blocks
 * @returns Cleaned JSON string ready for parsing
 * 
 * @example
 * ```typescript
 * const text = '```json\n{"key": "value"}\n```';
 * const json = extractJsonFromMarkdown(text);
 * const parsed = JSON.parse(json);
 * ```
 */
export function extractJsonFromMarkdown(text: string): string {
  let jsonText = text.trim();
  const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonText = jsonMatch[1].trim();
  }
  return jsonText;
}
