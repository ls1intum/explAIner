'use client';

interface InitialChatMessageProps {
  message: string;
}

/** Renders inform block message with KEY FACTS / KEY MISCONCEPTIONS / SUMMARY sections and bold (**text**) highlighting */
export default function InitialChatMessage({ message }: InitialChatMessageProps) {
  const sections = message.split(/(?=KEY FACTS|KEY MISCONCEPTIONS|SUMMARY)/);

  return (
    <>
      {sections.map((section, sectionIndex) => {
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
                    <BulletLine key={lineIndex} line={line} />
                  ))}
              </div>
            </div>
          );
        }
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
                    <BulletLine key={lineIndex} line={line} />
                  ))}
              </div>
            </div>
          );
        }
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
        return (
          <div key={sectionIndex} className="text-base leading-relaxed">
            <BoldParts text={section} />
          </div>
        );
      })}
    </>
  );
}

function BulletLine({ line }: { line: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-primary">•</span>
      <span className="flex-1">
        <BoldParts text={line} />
      </span>
    </div>
  );
}

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
