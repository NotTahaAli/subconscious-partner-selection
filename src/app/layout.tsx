import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Subconscious Partner Selection",
  description: "A tool for understanding your subconscious partner preferences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased`}>
        <header className="bg-background border-b border-foreground/10 p-4">
          <nav className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Partner Selector</h1>
            <div className="space-x-4">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/compare" className="hover:underline">Compare</Link>
              <Link href="/settings" className="hover:underline">Settings</Link>
            </div>
          </nav>
        </header>
        <main className="flex-1 container mx-auto p-4">
          {children}
        </main>
        <footer className="bg-background border-t border-foreground/10 p-4">
          <div className="container mx-auto text-center text-sm">
            © {new Date().getFullYear()} Partner Selector. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
