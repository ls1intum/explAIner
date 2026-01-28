export default function BlockContainer({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Shared wrapper (animations, spacing) */}
      {children}
    </div>
  );
}
