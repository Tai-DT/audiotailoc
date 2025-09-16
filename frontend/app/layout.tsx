import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Audio Tài Lộc - Thiết bị âm thanh chuyên nghiệp",
  description: "Chuyên cung cấp thiết bị âm thanh chất lượng cao, dịch vụ kỹ thuật chuyên nghiệp và giải pháp âm thanh toàn diện.",
  keywords: "thiết bị âm thanh, amplifier, loa, micro, mixer, studio thu âm, hệ thống âm thanh",
  authors: [{ name: "Audio Tài Lộc" }],
  openGraph: {
    title: "Audio Tài Lộc - Thiết bị âm thanh chuyên nghiệp",
    description: "Chuyên cung cấp thiết bị âm thanh chất lượng cao, dịch vụ kỹ thuật chuyên nghiệp và giải pháp âm thanh toàn diện.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}