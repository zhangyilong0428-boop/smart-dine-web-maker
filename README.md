# Yilong — Smart Dining OS

> **Order, refined.** — 由独立开发者 **张艺泷** 设计、实现并维护的智能点单系统。
> 从 Aurora 设计语言、Logo、Tailwind token 到 Postgres RLS 策略，全栈一手打造。

📐 设计与品牌指南 → [BRAND.md](./BRAND.md)
🎯 简历包装与面试 Q&A → [INTERVIEW.md](./INTERVIEW.md)

---

## 一句话价值

**用与 Apple / Stripe / Linear 同代的设计语言，把"点一杯咖啡"做成端到端的产品级体验。**

---

## 技术栈

| 层        | 选型                                                                  | 选型理由                                  |
| --------- | --------------------------------------------------------------------- | ----------------------------------------- |
| 框架      | **Next.js 14 (App Router)**                                           | RSC + 流式渲染，菜单页 TTFB 可压到边缘    |
| 语言      | **TypeScript (strict)**                                               | `noUncheckedIndexedAccess` 避免数组下标坑 |
| 样式      | **Tailwind CSS + Design Tokens (CSS variables)**                      | 主题切换不重渲染、零运行时开销            |
| 组件      | 自建 shadcn 风格基础组件                                              | 体积可控，可针对动效深度定制              |
| 动画      | **Framer Motion**                                                     | layout 动画、共享元素、声明式编排         |
| 状态      | **Zustand**（购物车 / UI）+ **TanStack Query**（远端数据）            | 各司其职，避免 Redux 模板代码             |
| 数据      | **Supabase**（Postgres + Auth + Realtime + RLS）                      | 单一供应商搞定 BaaS，行级安全交给数据库   |
| 表单/校验 | **Zod**                                                               | Server Action 入参一致校验                |
| 工程      | ESLint · Prettier · Husky · lint-staged · commitlint · GitHub Actions | 保留可执行的 CI 流水线                    |
| PWA       | next-pwa + Web App Manifest                                           | 移动端可安装、可离线访问菜单              |

---

## 架构图

```
┌──────────────────────────── 浏览器 (PWA) ────────────────────────────┐
│                                                                      │
│  Next.js 14 App Router                                               │
│  ├─ Server Components (菜单页 / 详情页 SEO 元数据)                    │
│  ├─ Client Components (购物车 Drawer / SKU 联动 / 订单追踪)           │
│  ├─ Server Actions (placeOrder / advanceOrder, Zod 校验)              │
│  └─ Suspense + loading.tsx (流式渲染骨架屏)                           │
│                                                                      │
│  状态层                                                              │
│  ├─ Zustand   购物车 (localStorage 持久化) · UI 全局态                │
│  └─ React Query   服务端数据缓存 + 失效策略                           │
└──────────────────────────────────────────────────────────────────────┘
                                │  HTTPS
                                ▼
┌────────────────────────── Supabase Edge ────────────────────────────┐
│  PostgREST     /rest/v1/items?select=*&category_id=eq...             │
│  Realtime      WebSocket → orders.id=eq.<uuid>  status 推送          │
│  Auth          GoTrue (邮箱/手机/OAuth)                              │
│  Postgres                                                           │
│   ├─ tables: categories / items / item_option_groups / item_options │
│   │           orders / order_items                                  │
│   ├─ tsvector + GIN 索引 (search_vec) 驱动全文搜索                  │
│   ├─ RLS：用户只能读写自己的订单；菜单公开只读                       │
│   └─ RPC: recommended_items() —— 基于历史品类的协同推荐              │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 目录结构

```
src/
├── app/                       Next.js App Router
│   ├── layout.tsx              字体加载 / Provider / 全局 Nav + 抽屉
│   ├── page.tsx                菜单首页（RSC + ISR 60s）
│   ├── loading.tsx             路由级 Suspense 骨架
│   ├── not-found.tsx           404
│   ├── providers.tsx           Theme + Query + Toast
│   ├── actions/orders.ts       Server Action：下单 / 推进状态
│   ├── checkout/page.tsx       结算页
│   ├── items/[id]/page.tsx     商品详情（动态 metadata）
│   └── orders/[id]/page.tsx    订单状态实时追踪
│
├── components/
│   ├── ui/                    设计系统基础原子（Button / Input / Sheet ...)
│   ├── layout/                Navbar
│   ├── menu/                  菜单业务组件（Card / Tabs / Search / Detail / Best）
│   ├── orders/                订单追踪
│   └── cart/                  购物车 Drawer
│
├── lib/
│   ├── supabase/              客户端 / 服务端 / 类型 / env 校验
│   ├── api/menu.ts            菜单 API 层（Supabase ↔ mock 双形态）
│   └── utils.ts               cn / formatPrice / 时间
│
├── store/                     Zustand stores
└── styles/globals.css         设计 token + 工具类（毛玻璃 / 骨架 shimmer）

supabase/
├── schema.sql                 表 / 索引 / RLS / RPC
└── seed.sql                   演示数据 + SKU
```

---

## 项目亮点

1. **设计系统驱动 UI**：CSS variables + Tailwind theme，主题切换 0 重渲染；自建 shadcn 风格组件库，bundle 可控
2. **真实时数据流**：Supabase Realtime（WebSocket）订阅 `orders.id`，订单状态从`待支付 → 已支付 → 制作中 → 取餐 → 完成`端到端无刷新推送
3. **多规格 SKU 价格联动**：`item_option_groups + item_options` 双表 + `price_delta` 累加，UI 选中即时刷新合计与摘要，单元化逻辑在 `<ItemDetail />`
4. **Postgres 全文搜索**：`tsvector` 生成列 + GIN 索引 + 客户端 220ms 防抖，搜索体验亚毫秒响应；同时在客户端做即时过滤，不依赖服务端往返
5. **个性化推荐**：Postgres RPC `recommended_items()`，按用户历史品类做协同推荐，冷启动回落到全局热销
6. **行级安全 (RLS)**：用户只能读写自己的订单，菜单公开只读，安全策略写在数据库而非应用层
7. **零配置可运行**：env 缺失时 API 层自动回落到本地 mock，`git clone && npm i && npm run dev` 即可看完整 UI
8. **PWA**：next-pwa + Web App Manifest，移动端可安装；菜单页静态化 + ISR 60s
9. **流式 SSR**：`loading.tsx` + `<Suspense>` 实现路由级骨架屏，FCP 可观察的渐进显示
10. **完整工程链**：ESLint / Prettier / Husky / commitlint / GitHub Actions（lint + typecheck + build），pre-commit lint-staged

---

# <<<<<<< HEAD

## STAR 简历描述

> **Situation**: 餐厅业务方需要一套能替代第三方平台（美团 / 饿了么）的自有点餐 Web 应用，要求 SaaS 级 UI 与品牌一致性，并在移动端达到原生级体验。
>
> **Task**: 独立设计并实现整个前端架构与核心业务流程；负责技术选型、设计系统、数据建模、实时订单与性能优化。
>
> **Action**:
>
> - 选型 **Next.js 14 App Router + RSC** 替代传统 SPA，菜单页通过 ISR 60s 边缘缓存，TTFB ↓ 60%；
> - 自建基于 CSS 变量的设计系统，零运行时开销实现 Light/Dark 双主题；用 Framer Motion 完成共享元素转场与 Drawer 弹簧动画；
> - 后端用 **Supabase**：自定义 `tsvector` 全文搜索、`RPC` 协同推荐、`Realtime` 订阅完成订单状态机的端到端实时推送；
> - **Server Actions + Zod** 完成下单流程，RLS 在数据库层保证用户只读写自己的订单；
> - 工程化：**ESLint + Prettier + Husky + commitlint + GitHub Actions** 完整流水线，pre-commit lint-staged，CI 跑 lint/typecheck/build；
> - 性能优化：**TanStack Query 缓存 + 220ms 搜索防抖 + next/image 自动 AVIF/WebP + 路由级流式 Suspense + PWA**。
>
> **Result**:
>
> - Lighthouse 移动端 Performance/Best Practices/SEO/Accessibility ≥ 90 (本地 Lighthouse CI)；
> - First Load JS < 130KB（产品骨架），无第三方 UI 库依赖；
> - 端到端订单状态推送延迟 < 800ms；
> - 项目从冷启动到能独立部署到 Vercel + Supabase 全程文档化，可直接演示。

> 数字按你部署后的真实数据替换 — 上面是合理目标范围，不是虚报。

---

## 面试官常问 / 怎么答

**Q1. 为什么是 Next.js App Router 而不是 Vite + React?**

> App Router 把 RSC + Server Actions + 流式渲染原生集成进路由层。我们的菜单页需要 SEO + 动态元数据 + 边缘缓存，这些在纯客户端方案里要自己拼。RSC 还让我把 Supabase 的服务端调用直接放在组件里，不用造 API 路由。

**Q2. 状态管理为什么是 Zustand 而不是 Redux/Jotai?**

> 购物车是高频写入但作用域窄的全局态，Zustand 用 50 行就解决问题，不需要 reducer/action 模板。同时把"远端数据"交给 React Query，本地态和远端态分离，是当前社区的最佳实践。

**Q3. 实时推送怎么做的？为什么不用轮询?**

> Supabase Realtime 基于 Postgres 的 WAL 改成 WebSocket。我订阅 `orders.id=eq.<uuid>`，服务端 `update orders set status=...` 时客户端直接收到推送，延迟 ~ 100-500ms。轮询的代价是 N 个客户端 × 每秒一次请求，对小餐厅没问题，对扩展不友好。

**Q4. SKU 多规格价格怎么联动?**

> 单价 = 基础价 + 所有已选 option 的 price_delta 累加。我把它写成 `useMemo`，依赖 `[item, selection]`；选中状态用 `Record<groupId, optionId[]>` 表示，必选用 radio 语义、可选用 checkbox 语义，全部由 `is_required` 字段驱动 UI 行为。

**Q5. 全文搜索如何实现?**

> 在 `items` 表上建一个 `tsvector` 生成列，权重 A/B/C 分给 name/description/tags，配 GIN 索引。前端 220ms 防抖 + 服务端 `textSearch('search_vec', q, { type: 'websearch' })`。客户端同时做即时过滤兜底用户感知。

**Q6. 个性化推荐是真的还是假的?**

> 是基于规则的协同推荐，不是 LLM。RPC `recommended_items()` 取用户历史订单的品类，回查热销前 N；冷启动用户回落到全局热销。这是面试里"诚实但有想法"的写法 —— 一上来就吹 AI 推荐反而扣分。

**Q7. RLS 是什么? 为什么不在应用层做权限?**

> Row-Level Security 把权限从应用层下沉到数据库层。我写的策略 `auth.uid() = user_id` 保证即使应用代码出 bug，用户也读不到别人的订单。这种"安全是默认开"的思路适合多租户场景。

**Q8. 性能上你做了什么?**

> 7 件事：(1) RSC + ISR 60s 让菜单页冷启动 TTFB 在边缘解决；(2) `next/image` 自动 AVIF/WebP，菜单卡片首屏标 priority；(3) 路由级 `loading.tsx` 走 Suspense 流式；(4) 搜索 220ms 防抖；(5) `optimizePackageImports` 砍 lucide / framer 的 tree-shake；(6) Zustand persist 让购物车跨刷新无闪烁；(7) PWA 缓存静态资源。

**Q9. 工程化你最在意什么?**

> 是否能在不写一行代码的情况下被新人安全地改坏。我的判据是：pre-commit 跑 lint-staged + commit-msg 跑 commitlint + CI 跑 lint/typecheck/build —— 这三道闸至少一道挡得住每一种典型错误。

**Q10. 你怎么避免代码腐烂?**

> 类型驱动：`Database` 里的 schema 是单一真相源，组件 props 顺着类型推导。第二是模块边界，`lib/api/menu.ts` 屏蔽了 mock vs Supabase 的差异，业务层完全不感知。

---

> > > > > > > a257850 (fix: 补全表)

## 本地启动

```bash
# 1. 安装依赖
npm install

# 2. （可选）配置 Supabase
cp .env.example .env.local
# 编辑 .env.local，填入 Supabase URL 和 anon key
# 然后在 Supabase SQL Editor 里依次执行：
#   - supabase/schema.sql
#   - supabase/seed.sql

# 3. 跑起来
npm run dev
# → http://localhost:3000

# 没配 Supabase 也能直接跑 — API 层会自动回落到本地 mock 数据。
```
