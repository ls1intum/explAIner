'use client';

interface BlockContainerProps {
  children: React.ReactNode;
}

export default function BlockContainer({ children }: BlockContainerProps) {
  return (
    <div className="w-full animate-fadeIn">
      {children}
    </div>
  );
}
