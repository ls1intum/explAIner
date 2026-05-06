import type { Metadata } from "next";
import "../styles/globals.css";
import { selectedFont } from "../styles/fonts";
import ReduxProvider from "@/providers/ReduxProvider";
import ToastProvider from "@/providers/ToastProvider";

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
    <html lang="en">
      <body className={`${selectedFont} antialiased`}>
        <ReduxProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
