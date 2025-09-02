import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import { VideoCacheProvider } from "@lib/hooks/useVideoCache";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://binigrdesign.vercel.app/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white">
      <body className={`${inter.variable} font-sans antialiased bg-white text-neutral-900`}>
        <VideoCacheProvider>
          <Header />
          {children}
          <Footer />
        </VideoCacheProvider>
      </body>
    </html>
  );
}
