interface PriorKnowledgeInputProps {
  value: string;
  onChange: (value: string) => void;
}

/** PriorKnowledgeInput component - allows the user to optionally enter prior knowledge keywords to indicate what they already know about the topic */
export default function PriorKnowledgeInput({ value, onChange }: PriorKnowledgeInputProps) {
  return (
    <div className="relative w-full">
      {/* Floating label */}
      <div className="absolute top-0 left-5 -translate-y-1/2 z-10">
        <span className="inline-block bg-muted text-muted-foreground text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
          Optional: Tell Owlbert what you already know
        </span>
      </div>
      {/* Input field */}
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
