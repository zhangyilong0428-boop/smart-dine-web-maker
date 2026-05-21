"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: "right" | "left";
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Lightweight slide-over panel. Built from scratch (vs. Radix) so we can keep
 * the bundle lean and tune the spring choreography per surface.
 */
export function Sheet({
  open,
  onOpenChange,
  side = "right",
  title,
  description,
  children,
  className,
}: SheetProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  const x = side === "right" ? "100%" : "-100%";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x }}
            animate={{ x: 0 }}
            exit={{ x }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className={cn(
              "glass-strong absolute top-0 flex h-full w-full max-w-md flex-col shadow-2xl",
              side === "right" ? "right-0" : "left-0",
              className,
            )}
          >
            {(title || description) && (
              <header className="flex items-start justify-between gap-4 border-b border-border/60 p-6">
                <div>
                  {title && (
                    <h2 className="font-display text-xl font-semibold tracking-tight">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label="关闭"
                >
                  <X className="size-4" />
                </button>
              </header>
            )}
            <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
