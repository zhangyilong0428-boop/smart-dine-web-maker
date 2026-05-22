import Link from "next/link";
import { Github } from "lucide-react";

import { Logo } from "@/components/brand/logo";

const COLS = [
  {
    heading: "产品",
    links: [
      { href: "/menu", label: "菜单" },
      { href: "/checkout", label: "结算" },
      { href: "/changelog", label: "更新日志" },
    ],
  },
  {
    heading: "技术",
    links: [
      { href: "https://nextjs.org", label: "Next.js 14", external: true },
      { href: "https://supabase.com", label: "Supabase", external: true },
      { href: "https://tailwindcss.com", label: "Tailwind", external: true },
      {
        href: "https://www.framer.com/motion/",
        label: "Framer Motion",
        external: true,
      },
    ],
  },
  {
    heading: "关于",
    links: [
      { href: "/about", label: "作者" },
      {
        href: "https://github.com/zhangyilong5",
        label: "GitHub",
        external: true,
      },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-card/30 backdrop-blur">
      <div className="container py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-sm text-sm text-muted-foreground">
              Yilong — 由独立开发者
              <span className="font-medium text-foreground"> 张艺泷 </span>
              设计与实现的智能点单操作系统。
            </p>
            <Link
              href="https://github.com/zhangyilong5"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="size-3.5" />
              github.com/zhangyilong5
            </Link>
          </div>

          {COLS.map((col) => (
            <div key={col.heading}>
              <h3 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {col.heading}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      target={"external" in l && l.external ? "_blank" : undefined}
                      rel={
                        "external" in l && l.external
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="text-sm text-foreground/80 transition-colors hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © 2026 Yilong · Crafted by{" "}
            <span className="font-semibold text-foreground">张艺泷</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Next.js · Supabase · Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}
