'use client';

interface BlockContainerProps {
  children: React.ReactNode;
}

/** BlockContainer component - wraps all other block components */
export default function BlockContainer({ children }: BlockContainerProps) {
  return (
    <div className="w-full">
      {children}
    </div>
  );
}
