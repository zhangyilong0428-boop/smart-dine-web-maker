"use client";

import { useEffect, useState } from "react";
import { motion, type MotionProps, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * SSR-safe reveal wrapper.
 *
 * The pitfall this fixes:
 *   `<motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} />`
 * sends `style="opacity:0"` down in the SSR HTML. If the IntersectionObserver
 * never fires (slow JS, ad-blocker, hydration error, prefers-reduced-motion),
 * the section stays invisible forever. Users perceive this as a broken page.
 *
 * Reveal renders the content fully visible until the client mounts, then
 * applies the motion props. This guarantees the page is readable even when JS
 * is disabled or stalled, while keeping the polish for the happy path.
 */
interface RevealProps extends Omit<
  MotionProps,
  "variants" | "initial" | "whileInView" | "viewport" | "transition"
> {
  as?: "div" | "section" | "article" | "li" | "figure";
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  children: React.ReactNode;
}

export function Reveal({
  as = "div",
  className,
  delay = 0,
  y = 16,
  once = true,
  children,
  ...rest
}: RevealProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Server + first paint: render children with no motion side-effects.
  if (!mounted) {
    const Tag = as;
    return (
      <Tag className={className} {...(rest as React.HTMLAttributes<HTMLElement>)}>
        {children}
      </Tag>
    );
  }

  const variants: Variants = {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0 },
  };
  const Component = motion[as];

  return (
    <Component
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.25 }}
      variants={variants}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Component>
  );
}
