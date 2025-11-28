import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { ZaloChatWidget } from "@/components/ui/zalo-chat-widget";
import { CONTACT_CONFIG } from "@/lib/contact-config";
import { OrganizationStructuredData } from "@/components/seo/organization-structured-data";
import { ChatLauncher } from "@/components/ui/chat-launcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Canonical / metadata base selection logic
const CANONICAL_BASE = process.env.NEXT_PUBLIC_CANONICAL_BASE_URL || "https://audiotailoc.com";

export const metadata: Metadata = {
  title: "Audio Tài Lộc - Thiết bị âm thanh chuyên nghiệp",
  description: "Chuyên cung cấp thiết bị âm thanh chất lượng cao, dịch vụ kỹ thuật chuyên nghiệp và giải pháp âm thanh toàn diện.",
  keywords: "thiết bị âm thanh, amplifier, loa, micro, mixer, studio thu âm, hệ thống âm thanh",
  authors: [{ name: "Audio Tài Lộc" }],
  metadataBase: new URL(CANONICAL_BASE),
  openGraph: {
    title: "Audio Tài Lộc - Thiết bị âm thanh chuyên nghiệp",
    description: "Chuyên cung cấp thiết bị âm thanh chất lượng cao, dịch vụ kỹ thuật chuyên nghiệp và giải pháp âm thanh toàn diện.",
    type: "website",
    locale: "vi_VN",
    url: CANONICAL_BASE,
    siteName: "Audio Tài Lộc",
  },
  twitter: {
    card: "summary_large_image",
    title: "Audio Tài Lộc - Thiết bị âm thanh chuyên nghiệp",
    description: "Chuyên cung cấp thiết bị âm thanh chất lượng cao, dịch vụ kỹ thuật chuyên nghiệp và giải pháp âm thanh toàn diện.",
  },
  alternates: {
    canonical: CANONICAL_BASE,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Cần cập nhật mã thực tế
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <OrganizationStructuredData />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <SocketProvider>
              <CartProvider>
                <Header />
                {children}
                <Footer />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "var(--background)",
                    color: "var(--foreground)",
                  },
                  success: {
                    duration: 3000,
                  },
                  error: {
                    duration: 5000,
                  },
                }}
              />
              <ZaloChatWidget phoneNumber={CONTACT_CONFIG.zalo.phoneNumber} />
              <ChatLauncher />
              </CartProvider>
            </SocketProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
