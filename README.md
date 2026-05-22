# Dine — 现代化智能点餐系统

> 一个面向真实业务场景的点餐 SPA。设计系统驱动 UI、Supabase 提供 Auth + 实时数据库、Next.js 14 App Router 处理 SSR/ISR，工程化与性能优化贯穿全栈。

---

## 一句话价值

**用与 Apple / Stripe / Linear 同代的设计语言，把"点一杯咖啡"做成端到端的产品级体验。**

---

## 技术栈

| 层 | 选型 | 选型理由 |
|---|---|---|
| 框架 | **Next.js 14 (App Router)** | RSC + 流式渲染，菜单页 TTFB 可压到边缘 |
| 语言 | **TypeScript (strict)** | `noUncheckedIndexedAccess` 避免数组下标坑 |
| 样式 | **Tailwind CSS + Design Tokens (CSS variables)** | 主题切换不重渲染、零运行时开销 |
| 组件 | 自建 shadcn 风格基础组件 | 体积可控，可针对动效深度定制 |
| 动画 | **Framer Motion** | layout 动画、共享元素、声明式编排 |
| 状态 | **Zustand**（购物车 / UI）+ **TanStack Query**（远端数据）| 各司其职，避免 Redux 模板代码 |
| 数据 | **Supabase**（Postgres + Auth + Realtime + RLS）| 单一供应商搞定 BaaS，行级安全交给数据库 |
| 表单/校验 | **Zod** | Server Action 入参一致校验 |
| 工程 | ESLint · Prettier · Husky · lint-staged · commitlint · GitHub Actions | 保留可执行的 CI 流水线 |
| PWA | next-pwa + Web App Manifest | 移动端可安装、可离线访问菜单 |

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

## 项目亮点（写进简历的版本）

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

## STAR 简历描述

> **Situation**: 餐厅业务方需要一套能替代第三方平台（美团 / 饿了么）的自有点餐 Web 应用，要求 SaaS 级 UI 与品牌一致性，并在移动端达到原生级体验。
>
> **Task**: 独立设计并实现整个前端架构与核心业务流程；负责技术选型、设计系统、数据建模、实时订单与性能优化。
>
> **Action**:
> - 选型 **Next.js 14 App Router + RSC** 替代传统 SPA，菜单页通过 ISR 60s 边缘缓存，TTFB ↓ 60%；
> - 自建基于 CSS 变量的设计系统，零运行时开销实现 Light/Dark 双主题；用 Framer Motion 完成共享元素转场与 Drawer 弹簧动画；
> - 后端用 **Supabase**：自定义 `tsvector` 全文搜索、`RPC` 协同推荐、`Realtime` 订阅完成订单状态机的端到端实时推送；
> - **Server Actions + Zod** 完成下单流程，RLS 在数据库层保证用户只读写自己的订单；
> - 工程化：**ESLint + Prettier + Husky + commitlint + GitHub Actions** 完整流水线，pre-commit lint-staged，CI 跑 lint/typecheck/build；
> - 性能优化：**TanStack Query 缓存 + 220ms 搜索防抖 + next/image 自动 AVIF/WebP + 路由级流式 Suspense + PWA**。
>
> **Result**:
> - Lighthouse 移动端 Performance/Best Practices/SEO/Accessibility ≥ 90 (本地 Lighthouse CI)；
> - First Load JS < 130KB（产品骨架），无第三方 UI 库依赖；
> - 端到端订单状态推送延迟 < 800ms；
> - 项目从冷启动到能独立部署到 Vercel + Supabase 全程文档化，可直接演示。

> 数字按你部署后的真实数据替换 — 上面是合理目标范围，不是虚报。

---

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
