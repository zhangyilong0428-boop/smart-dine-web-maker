# Yilong — Brand Guide

> 品牌不是 Logo。品牌是当用户看到一个屏幕时，能不能在 0.5 秒内说出"这是 Yilong"。
> 这份文档把 Yilong 的视觉与文案规范固定下来，让代码和设计共享同一个真相源。

---

## 1. 命名

| 项             | 值                                                              |
| -------------- | --------------------------------------------------------------- |
| 项目名         | **Yilong**                                                      |
| 子标题         | Smart Dining OS                                                 |
| 中文副标       | 重新定义点餐体验                                                |
| 主 Slogan (EN) | **Order, refined.**                                             |
| 备选 Slogan    | _Where chefs meet code._ · _The dining experience, reimagined._ |
| Wordmark       | `yilong.` (注意末尾的句点 — 它不是装饰，是品牌资产)             |
| 作者署名       | Built by **张艺泷**                                             |

**为什么是 Yilong**：取作者姓名"艺泷"的拼音尾字。单词、可读、域名好抢，又与"易"+"龙"押韵 — 文化内核而不是装洋气。简历里写"我做的 Yilong"比"我做的 Dine"更有归属感。

---

## 2. 配色 — Aurora

整套色板围绕 **Aurora**（极光）这个隐喻：火光 + 电光 + 夜空。主色克制（只在 CTA、关键焦点）；强调色用作 AI / 数据可视化的视觉锚点。

### Tokens (HSL channels — 用于 `hsl(var(--token) / <alpha-value>)`)

| Token               | Light                          | Dark                         | 用途                             |
| ------------------- | ------------------------------ | ---------------------------- | -------------------------------- |
| `--primary`         | `16 100% 56%` (`#FF5A1F`)      | `16 100% 60%`                | CTA / 焦点 / Logo 渐变起点       |
| `--accent`          | `88 78% 73%` (`#C7F284`)       | `88 78% 60%`                 | AI 标识 / 数据条 / Logo 渐变终点 |
| `--background`      | `33 50% 97%` (Cream `#FBF7F1`) | `224 24% 5%` (Ink `#0A0B0F`) | 页面底                           |
| `--foreground`      | `222 30% 8%`                   | `33 30% 96%`                 | 正文                             |
| `--brand-fire-from` | `16 100% 60%`                  | 同                           | 渐变起点                         |
| `--brand-fire-to`   | `32 100% 60%` (橙金)           | 同                           | 渐变中段                         |
| `--brand-electric`  | `88 78% 73%`                   | 同                           | 渐变终点                         |
| `--brand-aurora`    | `224 76% 56%` (深空蓝)         | 同                           | 极光背景的第三色                 |

### 使用约束

- **主色 `--primary` 只用于**：CTA 按钮、Logo、当前焦点、品牌强调（数字 / 标志色块）。
- **强调色 `--accent` 只用于**：AI 推荐 / 数据可视化 / Logo 句点 / Hero 渐变终点。
- **正文不要使用主色**。橙色作为正文颜色会让页面显得廉价。
- **暗黑模式底色用 `Ink`，不是 slate**。Ink (`#0A0B0F`) 比 Tailwind 默认的 zinc/slate 更接近真黑，有"高级显示设备"的气质。

---

## 3. 字体

| 用途                   | 字体        | 字重                  | Variable         |
| ---------------------- | ----------- | --------------------- | ---------------- |
| Display (标题、大数字) | **Manrope** | 500 / 600 / 700 / 800 | `--font-display` |
| Sans (正文、UI)        | **Inter**   | 默认                  | `--font-sans`    |

为什么这两个：Inter 是当下 SaaS 的"无个性"基线（Stripe / Linear / Vercel 都在用），Manrope 在保留几何感的同时有更圆润的字怀，做大字标题时不像 Inter 那么冷。两者都通过 `next/font/google` 自托管，零隐私泄漏，零外部请求。

字距规则：

- 大字标题：`tracking-tight` 或 `tracking-[-0.02em]`
- 小字标签 / 章节眉：`tracking-[0.24em]` + `uppercase` + 主色
- 正文：默认

---

## 4. Logomark

- 单字符 **Y** 在圆角方块（半径 9）内，方块用 Aurora 渐变填充
- Y 的形状被设计成"叉子" — 三笔中央汇集，暗示餐具
- 右上一颗 Electric Lime 圆点，作为"光斑" — 同时呼应 wordmark 末尾的句点
- 单色（mono）变体把整个方块替换为 `currentColor`，用在 Footer 等密度高的位置

实现见 `src/components/brand/logo.tsx`，纯 SVG，0 位图。

---

## 5. 视觉语言（关键决策）

| 决策            | 怎么做                                                              | 为什么                                         |
| --------------- | ------------------------------------------------------------------- | ---------------------------------------------- |
| **大圆角**      | 卡片 `rounded-3xl` (24px) / 大块 `rounded-[2rem]` (32px)            | iOS / Apple 美学；视觉上比 8/12px 圆角"软"很多 |
| **毛玻璃**      | `glass` 工具类：`backdrop-blur(20px) saturate(180%) + bg-card/0.55` | 信息层级靠玻璃叠加暗示，不需要硬边框           |
| **Aurora 光场** | `aurora` 工具类（conic-gradient + 80px blur + 32s 旋转）            | Hero 和 Closing CTA 的核心视觉。比单色背景"贵" |
| **Bento Grid**  | 自动行高 + col/row span 不规则化                                    | Apple 官网常用编排，让信息密度可读             |
| **微动画**      | Framer Motion `layoutId` + spring(380, 32)                          | 状态切换感是品牌一部分，不是装饰               |
| **进入动画**    | `whileInView` + `staggerChildren: 0.06`                             | 0.06s 是节奏感的甜区，0.1 显得拖沓             |
| **数字字体**    | `tabular-nums`                                                      | 数字滚动 / 价格更新时不抖                      |

---

## 6. 文案语气

写文案时问自己三件事：

1. **它是不是只能在 Yilong 出现？** — 通用的"高级"形容词换成具体描述。
2. **去掉它信息量会不会少？** — 不会就删。
3. **它能否被竞品直接抄走？** — 能就重写。

**好** ：「Aurora 设计语言 · Supabase Realtime 订单同步 · AI 个性化推荐」
**差** ：「极致的用户体验，赋能餐饮新时代」

---

## 7. 无障碍

- 全部交互元素 `focus-visible:ring-2 ring-ring`，主色与背景对比度通过 WCAG AA
- 所有 SVG / icon 配 `aria-label` 或 `aria-hidden`
- 暗黑模式不只是反色 — 用 `Ink` 而非纯黑，避免 OLED 漂移
- 选区颜色用主色 25% 透明，避免与默认蓝色冲突

---

## 8. 不要做的事

- 不要给所有按钮加渐变（高级感来自克制）
- 不要在正文里用 emoji（Lucide 图标即可）
- 不要让动画超过 600ms（Apple 标准是 300-500ms）
- 不要在一个屏幕里同时使用主色和强调色作为 CTA（视觉打架）
- 不要直接抄竞品的色板 — Aurora 的克制橙是 Yilong 的资产
