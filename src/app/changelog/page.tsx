import { GitCommit } from "lucide-react";

export const metadata = {
  title: "更新日志",
  description: "Yilong 的版本更新与发布说明",
};

interface Release {
  version: string;
  date: string;
  badge?: "major" | "minor" | "patch";
  highlights: string[];
}

const RELEASES: Release[] = [
  {
    version: "0.2.0",
    date: "2026-05-21",
    badge: "minor",
    highlights: [
      "品牌升级：项目正式更名为 Yilong，引入 Aurora 设计语言（Aurora Orange + Electric Lime）",
      "Logo 全新设计：单字符 Y 标识 + 渐变描边，纯 SVG 不依赖位图资源",
      "重做 Landing：Hero 极光光场 + Bento Grid 功能展示 + AI 推荐交互演示",
      "新增 /about 作者页（含决策日志）、/changelog 更新日志、全局 Footer",
    ],
  },
  {
    version: "0.1.0",
    date: "2026-05-21",
    badge: "major",
    highlights: [
      "Next.js 14 App Router + TS strict 项目骨架",
      "Supabase schema：categories / items / SKU / orders 全套，含 RLS 与 tsvector 全文搜索",
      "购物车 Drawer + 商品详情 SKU 价格联动",
      "结算流程 + Server Action 下单 + Realtime 订单状态推送",
      "工程化：ESLint / Prettier / Husky / commitlint / GitHub Actions CI",
      "PWA 支持：manifest + Service Worker + offline-first 缓存",
    ],
  },
  {
    version: "0.0.1",
    date: "2026-03-20",
    badge: "patch",
    highlights: ["项目以微信小程序原型起步（已迁移到 legacy/miniprogram/ 保留）"],
  },
];

const BADGE_CLASS: Record<NonNullable<Release["badge"]>, string> = {
  major: "bg-primary/15 text-primary",
  minor: "bg-accent/30 text-accent-foreground",
  patch: "bg-secondary text-secondary-foreground",
};

export default function ChangelogPage() {
  return (
    <div className="container max-w-3xl space-y-10">
      <header className="space-y-2">
        <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">
          changelog
        </p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          更新日志
        </h1>
        <p className="text-sm text-muted-foreground">
          Yilong 遵循 Semantic Versioning。每次发布都对应一个 Git tag。
        </p>
      </header>

      <ol className="relative space-y-8 border-l border-border/60 pl-6">
        {RELEASES.map((r) => (
          <li key={r.version} className="relative">
            <span className="absolute -left-[31px] top-1 grid size-6 place-items-center rounded-full border border-border bg-card">
              <GitCommit className="size-3 text-primary" />
            </span>
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="font-display text-2xl font-extrabold tracking-tight">
                v{r.version}
              </h2>
              {r.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${BADGE_CLASS[r.badge]}`}
                >
                  {r.badge}
                </span>
              )}
              <time className="text-xs text-muted-foreground">{r.date}</time>
            </div>
            <ul className="mt-3 space-y-2">
              {r.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-2xl border border-border/60 bg-card/40 px-4 py-2.5 text-sm leading-relaxed"
                >
                  {h}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
