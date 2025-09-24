import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import { VideoCacheProvider } from "@lib/hooks/useVideoCache";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
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
    <html lang="en" className={`${outfit.variable} bg-white`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-neutral-900">
        <VideoCacheProvider>
          <Header />
          {children}
          <Footer />
        </VideoCacheProvider>
      </body>
    </html>
  );
}
