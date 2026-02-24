"use client";

import Toast from "@/components/ui/Toast";

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toast />
      {children}
    </>
  );
}
