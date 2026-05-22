# Yilong — 面试 Playbook

> 这份文档不是营销材料，是面试现场可以直接照着说的版本。
> 关键原则：**先承认边界，再讲深度**。把"为什么没做 X"答得比"做了 X"更漂亮，是高级与初级的分水岭。

---

## 1. 30 秒电梯介绍

> "Yilong 是我从 0 到 1 独立设计、实现并维护的智能点单 Web 系统。
> 技术栈是 Next.js 14 App Router + Supabase + TypeScript strict。
> 我把它定位成一个**端到端**的项目 — 从设计 token、Logo、Aurora 配色，到 Postgres 的 RLS 策略和 tsvector 全文搜索，全部我自己设计；
> 不是用模板，不是用第三方 UI 库，是为了证明我对前后端、设计、工程的全栈把控能力。"

---

## 2. STAR 结构化描述

### Situation

餐厅业务方需要一套能替代第三方平台（美团 / 饿了么）的自有点单 Web 应用，要求 SaaS 级 UI 与品牌一致性，并在移动端达到原生级体验。

### Task

独立设计并实现整个前端架构与核心业务流程；负责品牌视觉、技术选型、数据建模、实时订单与性能优化。

### Action

1. **设计系统层** — 自建 Aurora 设计语言：CSS variables + Tailwind 双主题 token，零运行时切换；自定义 Logo (纯 SVG)；从字体到圆角节奏全部固定为可复用的设计 token，沉淀为 `BRAND.md`。
2. **架构层** — 选型 **Next.js 14 App Router** 替代传统 SPA：菜单页 RSC + ISR 60s 边缘缓存，TTFB 移到边缘；Server Actions + Zod 处理下单，绕开手写 API 路由。
3. **数据层** — 设计 6 张表的 schema，包含 SKU 双表（option_groups + options 用 `price_delta` 累加）、`tsvector` 全文搜索生成列 + GIN 索引、订单状态枚举；写了一个 **Postgres RPC `recommended_items()`** 做规则化协同推荐。
4. **安全层** — 把权限从应用层下沉到 **Postgres RLS**：用户只能读写自己的订单，菜单公开只读 — 即使应用代码出 bug 也读不到别人数据。
5. **实时层** — Supabase **Realtime (WebSocket)** 订阅 `orders.id=eq.<uuid>`，订单状态机端到端推送，无需轮询。
6. **工程层** — ESLint + Prettier + Husky + lint-staged + commitlint + GitHub Actions 完整流水线（lint / typecheck / build），pre-commit 即时反馈。
7. **性能层** — TanStack Query 缓存、220ms 搜索防抖、`next/image` 自动 AVIF/WebP、路由级 `loading.tsx` Suspense 流式、PWA 缓存静态资源、`optimizePackageImports` 砍 lucide / framer 摇树。
8. **品牌层** — 重做 Landing：Hero 极光光场 + Bento Grid 功能展示 + AI 推荐打分实时演示 + 作者卡 + 决策日志 (`/about`) + 更新日志 (`/changelog`)。

### Result

- 移动端 Lighthouse Performance / Accessibility / Best Practices / SEO **目标 ≥ 90**（部署后填入实测）
- First Load JS **< 130KB**（无第三方 UI 库依赖）
- 端到端订单状态推送延迟 **~ 100-500ms**
- 项目从冷启动到能独立部署到 Vercel + Supabase 全程文档化，GitHub Actions CI 一键复现

> 真实部署后用 PageSpeed Insights / WebPageTest 跑一次，把"目标"改为"实测"。把虚数说成实数会被一眼识破。

---

## 3. 高频面试题（含"反向题"）

### Q1 — 为什么是 Next.js App Router 而不是 Vite + React?

> App Router 把 RSC + Server Actions + 流式渲染原生集成进路由层。我们的菜单页需要 SEO + 动态 metadata + ISR 边缘缓存，这些在纯客户端方案里要自己拼。RSC 还让我把 Supabase 的服务端调用直接放进组件，不用造一层 API 路由 — 减少了一个失败点。

### Q2 — 状态管理为什么是 Zustand 而不是 Redux/Jotai?

> 购物车是高频写入但作用域窄的本地态，Zustand 50 行解决，省掉 reducer/action 模板。同时把"远端数据"交给 React Query — 本地态和远端态分离，是当前社区最佳实践。Redux 适合复杂的衍生状态图，这里没有。

### Q3 — 实时推送怎么做的？为什么不用轮询?

> Supabase Realtime 基于 Postgres 的 WAL 改成 WebSocket。我订阅 `orders.id=eq.<uuid>`，服务端 `update orders set status=...` 时客户端直接收到推送，延迟约 100-500ms。轮询的代价是 N 个客户端 × 每秒一次请求，对小餐厅没问题，对扩展不友好；也无法低延迟反映"出餐了"这种关键状态变化。

### Q4 — SKU 多规格价格怎么联动?

> 数据库层：`item_option_groups + item_options` 双表，每个 option 有 `price_delta`。前端用 `Record<groupId, optionId[]>` 表示选中状态，必选用 radio 语义、可选用 checkbox 语义，全部由 `is_required` 字段驱动 UI 行为。`unitPrice = base_price + Σ price_delta` 写成 `useMemo`，依赖 `[item, selection]`。

### Q5 — 全文搜索如何实现?

> Postgres 端：`items` 表上一个 `tsvector` **生成列** `search_vec`，权重 A/B/C 分给 name/description/tags，配 GIN 索引。前端 220ms 防抖 + `textSearch('search_vec', q, { type: 'websearch' })`。客户端同时做即时过滤，让用户感知亚毫秒响应。

### Q6 — 个性化推荐是真的吗？是不是接了 LLM?

> 是基于规则的协同推荐，**不是 LLM**。RPC `recommended_items()` 取用户历史订单的品类做候选，回查热销前 N，冷启动用户回落全局排行。这是面试里"诚实但有想法"的写法 — 一上来就吹 AI 推荐反而扣分。Landing 页的 AI 演示是同形态的客户端打分函数，可视化每一项分数，可解释、可调试。

### Q7 — RLS 是什么? 为什么不在应用层做权限?

> Row-Level Security 把权限从应用层下沉到数据库层。我写的策略 `auth.uid() = user_id` 保证即使应用代码有 bug，用户也读不到别人的订单。这是"安全是默认开"的思路，适合多租户场景。应用层做权限的危险在于：每加一个新接口都要重新写一遍权限校验，迟早漏一个。

### Q8 — 性能上你做了什么?

> 7 件事可以排序：
>
> 1. **RSC + ISR 60s** 让菜单页冷启动 TTFB 在边缘解决
> 2. **`next/image`** 自动 AVIF/WebP 协商，菜单卡片首屏标 priority
> 3. **路由级 `loading.tsx`** 走 Suspense 流式，而不是整页等
> 4. 搜索 **220ms 防抖** + 客户端即时过滤兜底用户感知
> 5. **`optimizePackageImports`** 让 lucide-react / framer-motion 真正 tree-shake
> 6. **Zustand persist** 让购物车跨刷新无闪烁
> 7. **PWA** 缓存静态资源 + offline-first

### Q9 — 工程化你最在意什么?

> 是否能在新人不写一行代码的情况下被安全地改坏。我的判据：pre-commit 跑 lint-staged + commit-msg 跑 commitlint + CI 跑 lint/typecheck/build — 这三道闸至少一道挡得住每一种典型错误。我不会在 CI 里跳过这些检查（`--no-verify` 是禁用品）。

### Q10 — 你怎么避免代码腐烂?

> 类型驱动：`Database` interface 是单一真相源，组件 props 顺着类型推导。第二是模块边界 — `lib/api/menu.ts` 屏蔽了 mock vs Supabase 的差异，业务层完全不感知。第三是设计 token — 所有颜色 / 圆角 / 字体在一个 CSS 文件里集中定义，改主题不需要全局搜索替换。

---

## 4. **反向题** — 为什么没做 X

这部分往往是高级工程师与初级的分水岭。**老练的回答模式：先承认边界，再讲在什么场景会引入。**

### 为什么没接 LLM 做推荐?

> 餐饮场景不需要黑盒。推荐总共 11 道菜，规则化协同过滤透明、可调试、零成本，效果对样本足够。LLM 引入的是延迟（>1s）、$/请求、不可控的 hallucination，对我没好处。**如果未来 SKU 突破 500 + 用户超过 10K**，我会用 LLM 做"基于自然语言意图的菜品筛选"（"想吃点甜的但不要太腻"），但首页 ranking 仍然是确定性算法。

### 为什么没上 Redis?

> 现在没有真实热点 key、没有跨实例需求。Next.js 的 ISR 已经在边缘缓存。**如果引入 Redis**，我会先在 Supabase 边上跑 Upstash，缓存订单状态机的派生值（如门店当前队列长度、近 1 小时菜品销售排行），不会乱缓存菜单 — 菜单改价改库存的时机比"快"更重要。

### 为什么没写单元测试?

> 这一版聚焦 UI / 数据流的端到端可演示性。**真要补**，我会先写 `src/lib/api/menu.ts` 的契约测试（mock vs Supabase 双形态返回相同 shape），再写 `<ItemDetail />` 的 SKU 价格联动测试 — 这两块如果错了，业务直接出现资损。Component visual snapshot 优先级最低。

### 为什么没接埋点?

> 埋点 SDK 是产品阶段的事 — 现在没有真实用户。**真要接**，我会用 PostHog 走 self-host，先埋三个事件：`menu_search` (含 query)、`item_view`、`order_placed` (含路径)，避免一上来埋 50 个事件然后没人看。埋点的最大坑是"想埋什么就埋什么"，我宁可少埋。

### 为什么没做 Edge Functions?

> 菜单 ISR 已经在边缘渲染。Edge Function 真有用的场景是**地理位置敏感的写操作**（如附近门店派单），但 Yilong 当前是单店模型。强行造一个 Edge Function 就是为了凑词，反而引入冷启动 + 状态一致性的复杂度。

### 为什么没做虚拟滚动?

> 菜单当前 11 道菜，DOM 节点 40+，强行上 react-virtual 是反优化（虚拟列表本身有几十 KB JS）。**临界点在 200 项左右** — 到那时再加，且只加在菜单页，搜索结果页不需要。

### 为什么 Footer 不放联系方式?

> 我不希望我的私人邮箱被爬虫扫到。GitHub Issue 是更好的接口 — 它默认 spam 过滤、有上下文、可被搜索。这是设计取舍，不是漏做。

---

## 5. 把"个人能力"显性化

如果面试官问"这个项目最能体现你哪方面能力"，按重要性排序回答：

1. **判断力** — 看清楚什么是"装样子"，什么是"真有用"。我把 LLM、Redis、Edge Function 都拒掉，是因为它们在当前规模下是负担不是杠杆。
2. **端到端思维** — 设计 token 改动会传导到代码。Tailwind config 改一行，Logo / CTA / 暗模式同步生效。这种闭环是模板项目做不到的。
3. **审美** — Aurora 配色、Bento Grid 节奏、动画时序，每一个数字都不是默认值。比如 `staggerChildren: 0.06` 不是 0.05 也不是 0.1，是因为这个值在多次手感测试后最舒服。
4. **诚实** — 在 README 里清楚区分"已实现"和"Roadmap"，在 Landing 标注 testimonials 是 fictional。这种诚实不会损失印象分，反而是加分项。

---

## 6. 听到"卷王项目"或"模板项目"质疑时怎么答

> "你可以打开任何一个文件，问我为什么这么写。
> Logo 为什么是 9 半径不是 8 半径，stagger 为什么是 0.06，RPC 为什么用 stable 不用 immutable，
> 我都能给出比'感觉好看'更深的答案。
> 模板项目的特征是改了 README 但答不出文件结构 — Yilong 没有这个问题。"
