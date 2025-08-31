import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

import { generateMeta } from "@lib/meta";

export const metadata = generateMeta();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white">
      <body className={`${outfit.variable} antialiased bg-white text-neutral-900`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
