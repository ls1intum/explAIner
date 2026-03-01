interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
}

/** TopicInput component - allows the user to enter a topic or question they want to learn about */
export default function TopicInput({ value, onChange }: TopicInputProps) {
  return (
    <div className="relative w-full">
      {/* Floating label */}
      <div className="absolute top-0 left-5 -translate-y-1/2 z-10">
        <span className="inline-block bg-brand-gradient text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
          What do you want to learn?
        </span>
      </div>
      {/* Input field */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your topic or question ..."
        className="w-full px-5 py-3 pt-6 border-2 border-primary rounded-3xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm text-foreground placeholder:text-muted-foreground bg-card shadow-sm"
      />
    </div>
  );
}
