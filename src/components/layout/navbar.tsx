"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCart, cartSelectors } from "@/store/cart";
import { useUi } from "@/store/ui";

export function Navbar() {
  const count = useCart(cartSelectors.count);
  const setCartOpen = useUi((s) => s.setCartOpen);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="container">
        <motion.nav
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="glass mt-3 flex items-center justify-between gap-4 rounded-full px-4 py-2 sm:px-6"
        >
          <Link href="/" className="flex items-center gap-2 font-display font-bold">
            <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm">D</span>
            </span>
            <span className="text-lg tracking-tight">Dine</span>
            <Badge variant="outline" className="hidden sm:inline-flex">
              chef’s choice
            </Badge>
          </Link>

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
