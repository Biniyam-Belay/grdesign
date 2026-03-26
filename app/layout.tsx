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
  title: {
    default: "Ilaala.Studio | Strategic Design & Digital Products",
    template: "%s | Ilaala.Studio",
  },
  description:
    "Independent design studio crafting clear, effective brands, visual systems, and digital interfaces for those who refuse to be ordinary. Working worldwide.",
  keywords: [
    "Brand Strategy",
    "UI/UX Design",
    "Web Development",
    "Editorial Design",
    "Independent Design Studio",
    "Digital Products",
    "Visual Identity",
    "Ilaala",
  ],
  authors: [{ name: "Biniyam Belay" }, { name: "Ilaala.Studio" }],
  creator: "Ilaala.Studio",
  publisher: "Ilaala.Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://binigrdesign.vercel.app/",
    title: "Ilaala.Studio | Strategic Design & Digital Products",
    description:
      "Independent design studio crafting clear, effective brands, visual systems, and digital interfaces. Working worldwide.",
    siteName: "Ilaala.Studio",
    images: [
      {
        url: "/og-image.jpg", // Ensure you configure a beautiful OG image later!
        width: 1200,
        height: 630,
        alt: "Ilaala.Studio - Strategic Design & Digital Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ilaala.Studio | Strategic Design & Digital Products",
    description:
      "Strategic visual systems and high-converting products that fundamentally change how the market perceives your brand.",
    images: ["/og-image.jpg"],
    creator: "@biniyam_belay",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://binigrdesign.vercel.app/",
  },
  category: "design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} bg-[#F5F5F0] overflow-x-hidden`}
      suppressHydrationWarning
    >
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
      <body className="font-sans antialiased bg-[#F5F5F0] text-neutral-900 overflow-x-hidden">
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
