interface PriorKnowledgeKeywordsInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PriorKnowledgeKeywordsInput({ value, onChange }: PriorKnowledgeKeywordsInputProps) {
  return (
    <div className="relative w-full">
      <div className="absolute top-0 left-5 -translate-y-1/2 z-10">
        <span className="inline-block bg-muted text-muted-foreground text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
          Optional: Tell Owlbert what you already know
        </span>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter keywords ..."
        className="w-full px-5 py-3 pt-6 border border-input rounded-3xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm text-foreground placeholder:text-muted-foreground bg-card shadow-sm"
      />
    </div>
  );
}
