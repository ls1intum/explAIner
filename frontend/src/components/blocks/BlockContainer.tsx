'use client';

interface BlockContainerProps {
  children: React.ReactNode;
}

/** BlockContainer component - wraps all other block components and applies a fade-in animation */
export default function BlockContainer({ children }: BlockContainerProps) {
  return (
    <div className="w-full animate-fadeIn">
      {children}
    </div>
  );
}
