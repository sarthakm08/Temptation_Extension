import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TEMPTATION AI // Autonomous Chrome Extension Laboratory",
  description: "Next-generation Agentic AI platform for building production-grade Chrome extensions. Natural-language planning, Manifest V3 code generation, security audits, and instant ZIP downloads.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#08080D] text-[#F5F5FA] selection:bg-purple-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
