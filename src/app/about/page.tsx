import Link from "next/link";
import { ArrowRight, CodeXml, Github, Layers, Sparkles } from "lucide-react";

import { Logo } from "@/components/brand/logo";

export const metadata = {
  title: "作者 · 张艺泷",
  description:
    "Yilong 是张艺泷独立设计、实现并维护的智能点单系统。这里讲述他的工程哲学、技术选型与决策逻辑。",
};

const PRINCIPLES = [
  {
    icon: Layers,
    title: "结构 > 装饰",
    body: "宁可少做一个动效，也要多写一行类型。视觉上的高级感来自留白和节奏，不是更多的渐变。",
  },
  {
    icon: CodeXml,
    title: "诚实 > 包装",
    body: "我会在 README 里写清楚什么是 Roadmap、什么是已实现 — 装做『全都做完了』是面试一眼的扣分项。",
  },
  {
    icon: Sparkles,
    title: "可解释 > 玄学",
    body: "AI 推荐如果讲不清打分逻辑，就不要叫 AI。Yilong 的推荐是规则化协同过滤，每一项分数都能溯源。",
  },
];

const DECISIONS: { q: string; a: string }[] = [
  {
    q: "为什么是 Next.js App Router 而不是 Vite + React?",
    a: "需要 SEO + 动态 metadata + ISR 边缘缓存。RSC 还让我把 Supabase 调用直接放进组件，省掉一层 API 路由。",
  },
  {
    q: "为什么是 Zustand 而不是 Redux/Jotai?",
    a: "购物车是高频写入但作用域窄的全局态，Zustand 50 行解决；远端态交给 React Query，本地与远端分离是当前最佳实践。",
  },
  {
    q: "为什么 RLS 写在数据库而不是应用层?",
    a: "权限下沉到 Postgres 层。即使应用代码出 bug，用户也读不到别人的订单。多租户场景里『安全是默认开』。",
  },
  {
    q: "为什么没接 LLM?",
    a: "餐饮推荐场景不需要黑盒。规则化协同过滤透明、可调试、零成本，效果对 11 道菜的样本足够好。引入 LLM 反而是反向工程。",
  },
  {
    q: "为什么没上 Redis?",
    a: "现在没有真实热点 key、没有跨实例需求。Next.js 的 ISR 已经在边缘缓存。如果接入 Redis，我会先在 Supabase 边上跑 Upstash，把订单状态机的派生值缓存（如门店队列长度），不会乱缓存菜单。",
  },
];

export default function AboutPage() {
  return (
    <div className="container max-w-3xl space-y-14">
      <header className="space-y-3">
        <Logo />
        <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">
          about the author
        </p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          张艺泷
          <span className="text-primary">.</span>
        </h1>
        <p className="text-balance text-base text-muted-foreground sm:text-lg">
          独立开发者。喜欢把"看起来很复杂"的产品拆成可解释的小块，再用尽量少的依赖把它们组装回去。
          Yilong 是我用来证明这条路径的项目。
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            href="https://github.com/zhangyilong5"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium transition-colors hover:border-foreground/30"
          >
            <Github className="size-4" /> github.com/zhangyilong5
          </Link>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-extrabold tracking-tight">
          工程信条
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {PRINCIPLES.map((p) => {
            const Icon = p.icon;
            return (
              <article key={p.title} className="glass ring-inner-soft rounded-3xl p-5">
                <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <h3 className="mt-3 font-display font-bold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-extrabold tracking-tight">
          关键决策（与"为什么没做"）
        </h2>
        <p className="text-sm text-muted-foreground">
          一个项目的质量不只由"做了什么"决定，更由"刻意没做什么"决定。下面是 Yilong
          的关键取舍：
        </p>
        <ul className="divide-y divide-border/60 overflow-hidden rounded-3xl border border-border/60 bg-card/40">
          {DECISIONS.map((d) => (
            <li key={d.q} className="p-5">
              <p className="font-display font-semibold">{d.q}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {d.a}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-border/60 bg-card/40 p-6">
        <h2 className="font-display text-xl font-extrabold tracking-tight">想聊聊?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          如果你在做相关的产品 / 工程问题，或者只是想对项目提建议，欢迎直接在 GitHub 开
          Issue 或 Discussion。
        </p>
        <Link
          href="https://github.com/zhangyilong5"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.55)] transition-all hover:brightness-105"
        >
          打开 GitHub
          <ArrowRight className="size-4" />
        </Link>
      </section>
    </div>
  );
}
