import Image from "next/image";
import Link from "next/link";
import { Flame, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Item } from "@/lib/supabase/types";

interface BestSellersProps {
  items: Item[];
}

/**
 * Marquee-like horizontal rail. Renders on the server — no JS for initial paint,
 * scroll-snap handles the interaction. Cheap on Lighthouse.
 */
export function BestSellers({ items }: BestSellersProps) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="best-sellers-heading" className="space-y-3">
      <header className="flex items-center justify-between">
        <h2
          id="best-sellers-heading"
          className="font-display text-xl font-bold tracking-tight"
        >
          <Flame className="mr-2 inline-block size-5 -translate-y-0.5 text-primary" />
          热销榜单
        </h2>
        <Badge variant="outline">实时数据</Badge>
      </header>

      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
        {items.map((item, idx) => (
          <Link
            key={item.id}
            href={`/items/${item.id}`}
            prefetch
            className="glass relative flex w-64 shrink-0 snap-start items-center gap-3 rounded-2xl p-3 transition-transform hover:-translate-y-0.5"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
              #{idx + 1}
            </span>
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
              {item.image_url && (
                <Image
                  src={item.image_url}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{item.name}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                {item.rating.toFixed(1)}
                <span>· {item.sold_count.toLocaleString()} 份</span>
              </p>
              <p className="mt-0.5 font-display text-sm font-bold text-primary">
                {formatPrice(item.base_price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
