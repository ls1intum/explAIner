'use client';

interface CustomLearningGoalInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CustomLearningGoalInput({ 
  value, 
  onChange, 
  placeholder = 'Or enter your own custom learning goal...' 
}: CustomLearningGoalInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-6 py-4 rounded-2xl border-2 border-secondary bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
    />
  );
}
