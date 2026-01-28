"use client";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Wraps app in Redux Provider */}
      {children}
    </>
  );
}
