import type { Metadata } from "next";
import { Kanit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/components/AudioProvider";
import { SettingsProvider } from "@/components/SettingsProvider";

import { ToastProvider } from "@/components/ToastProvider";
import ScrollProgress from "@/components/ScrollProgress";
import ClientSideComponents from "@/components/ClientSideComponents";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ธรณัส // พอร์ตโฟลิโอ",
  description: "พอร์ตโฟลิโอของผู้สร้างสรรค์โค้ด - สไตล์แฮกเกอร์",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TharaPort",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  openGraph: {
    images: [{ url: '/api/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/api/og'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://github-contributions-api.jogruber.de" />
        <link rel="preconnect" href="https://ipapi.co" />
      </head>
      <body
        className={`${kanit.variable} ${geistMono.variable} antialiased`}
      >
        <SettingsProvider>
          <AudioProvider>
            <ToastProvider>
              <ScrollProgress />
              <ClientSideComponents />
              {children}
            </ToastProvider>
          </AudioProvider>
        </SettingsProvider>

      </body>
    </html>
  );
}

