import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/components/AudioProvider";
import { SettingsProvider } from "@/components/SettingsProvider";

import { ToastProvider } from "@/components/ToastProvider";
import ScrollProgress from "@/components/ScrollProgress";
import IncognitoDetector from "@/components/IncognitoDetector";
import KonamiCode from "@/components/KonamiCode";
import Chatbot from "@/components/Chatbot";
import LiveCursors from "@/components/LiveCursors";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "THARA // PORTFOLIO",
  description: "Creative Coder Portfolio - Hacker Aesthetic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SettingsProvider>
          <AudioProvider>
            <ToastProvider>
              <ScrollProgress />
              <LiveCursors />
              <IncognitoDetector />
              <KonamiCode />
              <Chatbot />
              {children}
            </ToastProvider>
          </AudioProvider>
        </SettingsProvider>

      </body>
    </html>
  );
}

