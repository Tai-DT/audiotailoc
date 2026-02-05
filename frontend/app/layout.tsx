import type { Metadata, Viewport } from "next";
import { Outfit, Be_Vietnam_Pro, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import HeaderShell from "@/components/layout/header-shell";
import FooterShell from "@/components/layout/footer-shell";
import { OrganizationStructuredData } from "@/components/seo/organization-structured-data";
import { LazyAnalytics } from "@/components/analytics/lazy-analytics";
import { LazyChatWidget } from "@/components/ui/lazy-chat-widget";
import { LazyToaster } from "@/components/ui/lazy-toaster";
import { ResourceHints } from "@/components/performance/resource-hints";

const bodyFont = Be_Vietnam_Pro({
    variable: "--font-be-vietnam-pro",
    subsets: ["latin", "latin-ext"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
    preload: true,
});

const displayFont = Outfit({
    variable: "--font-outfit",
    subsets: ["latin", "latin-ext"],
    weight: ["400", "500", "600", "700", "800", "900"],
    display: "swap",
    preload: true,
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
    preload: false,
});

// Canonical / metadata base selection logic
const CANONICAL_BASE = process.env.NEXT_PUBLIC_CANONICAL_BASE_URL || "https://audiotailoc.com";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    ],
};

export const metadata: Metadata = {
    title: {
        default: "Audio Tài Lộc - Thiết bị âm thanh chuyên nghiệp | Dàn Karaoke, Loa, Ampli, Micro",
        template: "%s | Audio Tài Lộc",
    },
    description: "Audio Tài Lộc - Chuyên cung cấp thiết bị âm thanh chất lượng cao: Dàn karaoke gia đình, Loa JBL, Ampli, Micro không dây, Mixer. Dịch vụ lắp đặt, bảo hành tại TP.HCM. Hotline: 0768 426 262",
    keywords: [
        "thiết bị âm thanh",
        "dàn karaoke",
        "loa karaoke",
        "loa JBL",
        "loa Bose",
        "amplifier",
        "ampli karaoke",
        "micro không dây",
        "micro Shure",
        "mixer",
        "hệ thống âm thanh",
        "âm thanh hội nghị",
        "âm thanh sân khấu",
        "loa bluetooth",
        "sub điện",
        "bộ dàn karaoke gia đình",
        "mua loa karaoke",
        "lắp đặt karaoke",
        "audio tài lộc",
        "audiotailoc",
        "thiết bị âm thanh tphcm",
        "mua loa tphcm",
    ],
    authors: [{ name: "Audio Tài Lộc", url: CANONICAL_BASE }],
    creator: "Audio Tài Lộc",
    publisher: "Audio Tài Lộc",
    metadataBase: new URL(CANONICAL_BASE),
    icons: {
        icon: [{ url: "/favicon.ico", sizes: "any" }],
        apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.json",
    openGraph: {
        title: "Audio Tài Lộc - Thiết bị âm thanh chuyên nghiệp",
        description: "Chuyên cung cấp thiết bị âm thanh chất lượng cao: Dàn karaoke, Loa, Ampli, Micro. Dịch vụ lắp đặt, bảo hành uy tín tại TP.HCM. Hotline: 0768 426 262",
        type: "website",
        locale: "vi_VN",
        url: CANONICAL_BASE,
        siteName: "Audio Tài Lộc",
        images: [
            {
                url: `${CANONICAL_BASE}/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: "Audio Tài Lộc - Thiết bị âm thanh chuyên nghiệp",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Audio Tài Lộc - Thiết bị âm thanh chuyên nghiệp",
        description: "Chuyên cung cấp thiết bị âm thanh chất lượng cao: Dàn karaoke, Loa, Ampli, Micro. Hotline: 0768 426 262",
        images: [`${CANONICAL_BASE}/og-image.jpg`],
    },
    alternates: {
        canonical: CANONICAL_BASE,
        languages: {
            'vi-VN': CANONICAL_BASE,
        },
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
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    },
    category: "Electronics",
    classification: "Audio Equipment Store",
    other: {
        'geo.region': 'VN-SG',
        'geo.placename': 'Ho Chi Minh City',
        'geo.position': '10.8231;106.6297',
        'ICBM': '10.8231, 106.6297',
        'rating': 'general',
        'revisit-after': '7 days',
        'language': 'Vietnamese',
        'distribution': 'global',
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" translate="no" suppressHydrationWarning data-scroll-behavior="smooth">
            <head>
                <meta name="google" content="notranslate" />
                {/* Preconnect to critical domains for faster LCP */}
                <link rel="preconnect" href="https://res.cloudinary.com" />
                <link rel="dns-prefetch" href="https://res.cloudinary.com" />

                {/* Critical CSS for above-the-fold content - prevents FOUC and speeds up FCP */}
                <style dangerouslySetInnerHTML={{
                    __html: `
 /* Critical rendering styles */
 *, *::before, *::after { box-sizing: border-box; }
 html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
 body { margin: 0; min-height: 100vh; }
 img { max-width: 100%; height: auto; }
  /* Skeleton animation for faster perceived load */
 @keyframes skeleton-loading {
 0% { background-position: -200px 0; }
 100% { background-position: calc(200px + 100%) 0; }
 }
 .skeleton-pulse {
 background: linear-gradient(90deg, #f0f0f0 8px, #e0e0e0 18px, #f0f0f0 33px);
 background-size: 200px 100%;
 animation: skeleton-loading 1.5s infinite;
 }
  /* Hide content until hydrated to prevent layout shift */
 [data-pending-hydration] { opacity: 0.99; }
 `}} />
            </head>
            <body
                className={`${bodyFont.variable} ${displayFont.variable} ${geistMono.variable} notranslate antialiased min-h-screen bg-background text-foreground`}
                suppressHydrationWarning
            >
                <OrganizationStructuredData />
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <QueryProvider>
                        <CartProvider>

                            <HeaderShell />
                            <main id="main-content" tabIndex={-1}>
                                {children}
                            </main>
                            <FooterShell />
                            <LazyToaster />
                            <LazyChatWidget />
                        </CartProvider>
                    </QueryProvider>
                </ThemeProvider>
                <LazyAnalytics />
                <ResourceHints />
            </body>
        </html>
    );
}
// Force rebuild Fri Jan 30 14:56:04 +07 2026
