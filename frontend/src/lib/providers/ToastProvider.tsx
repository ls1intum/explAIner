"use client";

import Toast from "@/components/ui/Toast";

/* Toast Provider - provides the Toast component to all child components (used in src/app/layout.tsx) */
export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toast />
      {children}
    </>
  );
}
