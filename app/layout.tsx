import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { Toaster } from "@/components/ui/sonner";

const GTAG_ID = "AW-17964649243";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  // Only used on a handful of admin/payment screens - don't spend a preload
  // slot on it for every page load.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "YT Shop India - YouTube Channel Marketplace",
    template: "%s | YT Shop India",
  },
  description: "A stunning YouTube channel listing marketplace - Buy and sell YouTube channels with ease and security.",
  keywords: ["YouTube channel", "buy YouTube channel", "sell YouTube channel", "YT marketplace", "India"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ytshopindia.com",
    siteName: "YT Shop India",
  },
  twitter: {
    card: "summary_large_image",
    title: "YT Shop India - YouTube Channel Marketplace",
    description: "Buy and sell YouTube channels with ease and security.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster />
        </ThemeProvider>

        {/* `lazyOnload` holds the ~140KB gtag bundle until after the window
            load event, keeping its ~330ms of script evaluation out of the
            page's blocking time. Trade-off: tags fire roughly a second later
            than with "afterInteractive". Switch this pair back to
            "afterInteractive" if conversions need to fire as early as possible. */}
        <Script
          id="gtag-src"
          src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
          strategy="lazyOnload"
        />
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GTAG_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
