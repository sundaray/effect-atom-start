import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

import { AtomRegistryProvider } from "@/providers/atom-registry-provider";
import { ProgressBarProvider } from "@/providers/progress-bar-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Effect Atom Demo",
  description:
    "A Next.js application demonstrating reactive state management using Effect Atom.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <AtomRegistryProvider>
          <ProgressBarProvider>
            <main className="py-24">{children}</main>
          </ProgressBarProvider>
        </AtomRegistryProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
