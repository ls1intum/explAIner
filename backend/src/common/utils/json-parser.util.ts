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
  
  // Try to extract from markdown code blocks
  // Match ```json or just ``` with optional whitespace
  const codeBlockMatch = jsonText.match(/```(?:json|JSON)?\s*\n?([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonText = codeBlockMatch[1].trim();
  }
  
  // Remove any leading/trailing backticks that might remain
  jsonText = jsonText.replace(/^`+|`+$/g, '').trim();
  
  // If text starts with something before {, try to extract just the JSON object/array
  if (!jsonText.startsWith('{') && !jsonText.startsWith('[')) {
    const jsonObjectMatch = jsonText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonObjectMatch) {
      jsonText = jsonObjectMatch[1];
    }
  }
  
  return jsonText.trim();
}
