"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCart, cartSelectors } from "@/store/cart";
import { useUi } from "@/store/ui";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/menu", label: "菜单" },
  { href: "/about", label: "作者" },
  { href: "/changelog", label: "更新日志" },
];

export function Navbar() {
  const count = useCart(cartSelectors.count);
  const setCartOpen = useUi((s) => s.setCartOpen);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="container">
        <motion.nav
          // SSR-safe: skip the slide-in on first paint so the header is never
          // invisible if framer-motion stalls. Animates only on client mount.
          initial={mounted ? { y: -16, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="glass mt-3 flex items-center justify-between gap-4 rounded-full px-4 py-2 sm:px-6"
        >
          <Link href="/" aria-label="Yilong 首页" className="shrink-0">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => {
              const active =
                pathname === n.href || (n.href !== "/" && pathname?.startsWith(n.href));
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className={cn(
                      "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-secondary"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative">{n.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-label="打开购物车"
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground shadow"
                >
                  {count}
                </motion.span>
              )}
            </Button>
          </div>
        </motion.nav>
      </div>
    </header>
  );
}
