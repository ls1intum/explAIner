'use client';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface ChatMessageContentProps {
  message: string;
}

/** ChatMessageContent component - formats and displays inform block messages
 *
 * for first inform block message of initial block sequence:      formats and displays KEY FACTS section
 * for first inform block message of subsequent block sequence:   formats and displays KEY MISCONCEPTIONS section
 * for first inform block message of any block sequence:          formats and displays SUMMARY section
 * for all block messages:                                        adds bold (**text**) highlighting
 * for sigil inform blocks (markdown with headers):               full markdown rendering
 */
export default function ChatMessageContent({ message }: ChatMessageContentProps) {

  const { t } = useTranslation();

  // A subsequent (tailored) explanation is the only message that addresses
  // KEY MISCONCEPTIONS. Show an explanatory title above it so the learner knows
  // this is a fresh explanation generated in response to their answers.
  const isTailoredExplanation = message.includes('KEY MISCONCEPTIONS');

  // Sigil inform blocks contain full markdown with headers — render with react-markdown
  if (/^#\s/m.test(message)) {
    return (
      <div className="sigil-markdown text-base leading-relaxed">
        <Markdown remarkPlugins={[remarkGfm]}>{message}</Markdown>
      </div>
    );
  }

  // Split message into sections based on KEY FACTS, KEY MISCONCEPTIONS, and SUMMARY
  const sections = message.split(/(?=KEY FACTS|KEY MISCONCEPTIONS|SUMMARY)/);

  return (
    <>
      {/* Explanatory title above a tailored (subsequent) explanation */}
      {isTailoredExplanation && (
        <h2 className="text-lg font-semibold text-primary mb-3">
          {t('informBlock.tailoredExplanationTitle') as string}
        </h2>
      )}
      {sections.map((section, sectionIndex) => {

        // KEY FACTS section - displays bullet points
        if (section.startsWith('KEY FACTS')) {
          return (
            <div key={sectionIndex} className="mt-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                KEY FACTS
              </h3>
              <div className="space-y-3">
                {section
                  .replace('KEY FACTS', '')
                  .trim()
                  .split('\n')
                  .filter((line) => line.trim())
                  .map((line, lineIndex) => (
                    <BulletPoint key={lineIndex} line={line} />
                  ))}
              </div>
            </div>
          );
        }

        // KEY MISCONCEPTIONS section - displays bullet points
        if (section.startsWith('KEY MISCONCEPTIONS')) {
          return (
            <div key={sectionIndex} className="mt-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                KEY MISCONCEPTIONS
              </h3>
              <div className="space-y-3">
                {section
                  .replace('KEY MISCONCEPTIONS', '')
                  .trim()
                  .split('\n')
                  .filter((line) => line.trim())
                  .map((line, lineIndex) => (
                    <BulletPoint key={lineIndex} line={line} />
                  ))}
              </div>
            </div>
          );
        }

        // SUMMARY section - displays text with bold formatting
        if (section.startsWith('SUMMARY')) {
          return (
            <div key={sectionIndex} className="mt-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                SUMMARY
              </h3>
              <div className="text-base leading-relaxed">
                <BoldParts text={section.replace('SUMMARY', '').trim()} />
              </div>
            </div>
          );
        }

        // Every other section (not KEY FACTS/MISCONCEPTIONS/SUMMARY) - displays text with bold formatting
        return (
          <div key={sectionIndex} className="text-base leading-relaxed">
            <BoldParts text={section} />
          </div>
        );
      })}
    </>
  );
}

/** Helper function - renders a single bullet point (one bullet + line of text) */
function BulletPoint({ line }: { line: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-primary">•</span>
      <span className="flex-1">
        <BoldParts text={line} />
      </span>
    </div>
  );
}

/** Helper function - formats bold text */
function BoldParts({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, partIndex) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={partIndex} className="font-semibold text-primary">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={partIndex}>{part}</span>;
      })}
    </>
  );
}
