import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";

import { Providers } from "./providers";

import "@/styles/globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const display = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Yilong — 重新定义点餐体验",
    template: "%s · Yilong",
  },
  description:
    "Yilong 是一套面向现代餐饮的智能点单操作系统：Aurora 设计语言、实时订单同步、AI 个性化推荐，由独立开发者张艺泷打造。",
  keywords: ["Yilong", "智能点餐", "餐厅 SaaS", "Next.js", "Supabase", "张艺泷"],
  authors: [{ name: "张艺泷", url: "https://github.com/zhangyilong5" }],
  creator: "张艺泷",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Yilong — 重新定义点餐体验",
    description: "Aurora 设计语言 · 实时订单同步 · AI 个性化推荐",
    type: "website",
    siteName: "Yilong",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yilong — 重新定义点餐体验",
    description: "Aurora 设计语言 · 实时订单同步 · AI 个性化推荐",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d12" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${display.variable} relative min-h-dvh bg-background`}
      >
        <Providers>
          <Navbar />
          <main className="pb-24 pt-20">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
