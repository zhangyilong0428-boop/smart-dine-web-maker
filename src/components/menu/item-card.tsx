"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useUi } from "@/store/ui";
import { cn, formatPrice } from "@/lib/utils";
import type { Item } from "@/lib/supabase/types";

interface ItemCardProps {
  item: Item;
  priority?: boolean;
}

export function ItemCard({ item, priority }: ItemCardProps) {
  const add = useCart((s) => s.add);
  const openCart = useUi((s) => s.setCartOpen);

  const hasOptions = item.is_featured; // featured items demo SKU flow
  const href = `/items/${item.id}`;

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    add({
      key: item.id,
      itemId: item.id,
      name: item.name,
      imageUrl: item.image,
      unitPrice: item.price,
    });
    openCart(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link
        href={href}
        prefetch
        className="block overflow-hidden rounded-3xl border border-border/60 bg-card/70 backdrop-blur transition-shadow hover:shadow-[0_24px_60px_-24px_hsl(var(--primary)/0.35)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className={cn(
                "object-cover transition-transform duration-700 ease-out",
                "group-hover:scale-[1.06]",
              )}
            />
          ) : (
            <div className="absolute inset-0 bg-secondary" />
          )}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 via-black/0" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 2).map((t) => (
              <Badge key={t} variant="default" className="backdrop-blur">
                {t}
              </Badge>
            ))}
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-xs text-white backdrop-blur">
            <Star className="size-3 fill-amber-300 text-amber-300" />
            {item.rating.toFixed(1)}
          </div>
        </div>

        <div className="flex items-start justify-between gap-3 p-4">
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold tracking-tight">
              {item.name}
            </h3>
            {item.description && (
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                {item.description}
              </p>
            )}
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-display text-lg font-bold">
                {formatPrice(item.price)}
              </span>
              <span className="text-xs text-muted-foreground">
                · 已售 {item.sold_count.toLocaleString()}
              </span>
            </div>
          </div>
          <Button
            size="icon"
            aria-label={hasOptions ? "查看规格" : "加入购物车"}
            onClick={hasOptions ? undefined : quickAdd}
            className="shrink-0"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </Link>
    </motion.div>
  );
}
