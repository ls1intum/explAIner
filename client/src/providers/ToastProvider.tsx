"use client";

import Toast from "@/components/shared/ui/Toast";

/* Toast Provider - provides the toast component to all child components (<-> src/app/layout.tsx) */
export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toast />
      {children}
    </>
  );
}
