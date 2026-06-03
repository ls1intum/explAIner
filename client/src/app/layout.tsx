import type { Metadata } from "next";
import { Suspense } from "react";
import "../styles/globals.css";
import { selectedFont } from "../styles/fonts";
import ReduxProvider from "@/providers/ReduxProvider";
import ToastProvider from "@/providers/ToastProvider";
import LanguageProvider from "@/providers/LanguageProvider";

export const metadata: Metadata = {
  title: "ExplAIner - Learn at Your Own Pace",
  description: "An AI-powered learning platform that adapts to your pace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${selectedFont} antialiased`}>
        <ReduxProvider>
          <Suspense>
            <LanguageProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </LanguageProvider>
          </Suspense>
        </ReduxProvider>
      </body>
    </html>
  );
}
