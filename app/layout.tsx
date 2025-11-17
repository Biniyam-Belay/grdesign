import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import { VideoCacheProvider } from "@lib/hooks/useVideoCache";
import { Analytics } from "@vercel/analytics/next";
import LoadingIndicator from "@components/ui/LoadingIndicator";
import { ToastProvider } from "@components/ui/ToastProvider";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  preload: true,
  fallback: ["system-ui", "arial"],
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
      <head>
        {/* Preconnect to critical origins */}
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <>
            <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
            <link
              rel="preconnect"
              href={process.env.NEXT_PUBLIC_SUPABASE_URL}
              crossOrigin="anonymous"
            />
          </>
        )}
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans antialiased bg-white text-neutral-900">
        <LoadingIndicator />
        <ToastProvider>
          <VideoCacheProvider>
            <Header />
            {children}
            <Analytics />
            <Footer />
          </VideoCacheProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
