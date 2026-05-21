import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";

import { Navbar } from "@/components/layout/navbar";
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
    default: "Dine — 智能点餐",
    template: "%s · Dine",
  },
  description:
    "现代化智能点餐体验。设计系统驱动的 UI、Supabase 实时订单、Next.js 14 App Router、PWA 离线可用。",
  keywords: ["点餐", "餐厅", "设计系统", "Next.js", "Supabase"],
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Dine — 智能点餐",
    description: "现代化智能点餐体验",
    type: "website",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${display.variable} bg-background bg-mesh-light dark:bg-mesh-dark min-h-dvh`}
      >
        <Providers>
          <Navbar />
          <main className="pb-24 pt-20">{children}</main>
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
