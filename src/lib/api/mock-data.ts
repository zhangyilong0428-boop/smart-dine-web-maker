/**
 * Local fallback dataset — kept in sync with supabase/seed.sql so the app
 * looks identical whether or not env vars are configured. Used by the API
 * layer when `isSupabaseConfigured` is false (e.g. fresh clone, CI build).
 */
import type {
  Category,
  Item,
  ItemOption,
  ItemOptionGroup,
  ItemWithOptions,
} from "@/lib/supabase/types";

export const mockCategories: Category[] = [
  { id: "c-sig", slug: "signature", name: "招牌主厨", sort_order: 1 },
  { id: "c-rice", slug: "rice", name: "米饭面食", sort_order: 2 },
  { id: "c-grill", slug: "grill", name: "炭火烧物", sort_order: 3 },
  { id: "c-drink", slug: "drink", name: "精品饮品", sort_order: 4 },
  { id: "c-dessert", slug: "dessert", name: "甜点", sort_order: 5 },
];

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const mockItems: Item[] = [
  {
    id: "i-wagyu",
    category_id: "c-sig",
    name: "主厨黑松露和牛饭",
    description: "澳洲M9和牛 · 黑松露酱 · 半熟蛋",
    base_price: 128,
    image_url: img("photo-1546833999-b9f581a1996d"),
    tags: ["招牌", "热销", "和牛"],
    sold_count: 1284,
    rating: 4.9,
    is_available: true,
    is_featured: true,
  },
  {
    id: "i-lobster",
    category_id: "c-sig",
    name: "黄油龙虾意面",
    description: "波士顿龙虾 · 手工意面 · 焦糖黄油",
    base_price: 148,
    image_url: img("photo-1473093226795-af9932fe5856"),
    tags: ["招牌", "奶香", "海鲜"],
    sold_count: 962,
    rating: 4.8,
    is_available: true,
    is_featured: true,
  },
  {
    id: "i-eel",
    category_id: "c-rice",
    name: "炭烧鳗鱼饭",
    description: "关东烧鳗 · 山椒 · 自制蒲烧汁",
    base_price: 68,
    image_url: img("photo-1553621042-f6e147245754"),
    tags: ["日式", "炭烧"],
    sold_count: 2103,
    rating: 4.8,
    is_available: true,
    is_featured: false,
  },
  {
    id: "i-chicken",
    category_id: "c-rice",
    name: "香煎鸡腿藜麦饭",
    description: "低温慢煎 · 藜麦 · 烤蔬菜",
    base_price: 48,
    image_url: img("photo-1546069901-ba9599a7e63c"),
    tags: ["轻食", "高蛋白"],
    sold_count: 1820,
    rating: 4.7,
    is_available: true,
    is_featured: false,
  },
  {
    id: "i-oxtail",
    category_id: "c-rice",
    name: "番茄牛尾汤面",
    description: "慢炖三小时 · 自制面条",
    base_price: 52,
    image_url: img("photo-1569718212165-3a8278d5f624"),
    tags: ["暖胃", "炖煮"],
    sold_count: 1530,
    rating: 4.7,
    is_available: true,
    is_featured: false,
  },
  {
    id: "i-tomahawk",
    category_id: "c-grill",
    name: "岩盐战斧牛排",
    description: "美国Prime战斧 · 岩盐慢烤",
    base_price: 218,
    image_url: img("photo-1558030006-450675393462"),
    tags: ["硬核", "分享"],
    sold_count: 540,
    rating: 4.9,
    is_available: true,
    is_featured: true,
  },
  {
    id: "i-skewer",
    category_id: "c-grill",
    name: "炭烤鸡肉串",
    description: "果木炭烤 · 蒜香迷迭香",
    base_price: 32,
    image_url: img("photo-1599487488170-d11ec9c172f0"),
    tags: ["烧烤", "下酒"],
    sold_count: 2410,
    rating: 4.6,
    is_available: true,
    is_featured: false,
  },
  {
    id: "i-coldbrew",
    category_id: "c-drink",
    name: "冷萃黑咖啡",
    description: "埃塞日晒 · 18小时冷萃",
    base_price: 28,
    image_url: img("photo-1517701550927-30cf4ba1dba5"),
    tags: ["咖啡", "冷萃"],
    sold_count: 3120,
    rating: 4.8,
    is_available: true,
    is_featured: false,
  },
  {
    id: "i-soda",
    category_id: "c-drink",
    name: "柚见百香气泡",
    description: "蜂蜜柚子 · 百香果 · 苏打",
    base_price: 24,
    image_url: img("photo-1497534446932-c925b458314e"),
    tags: ["气泡", "清爽"],
    sold_count: 2670,
    rating: 4.7,
    is_available: true,
    is_featured: false,
  },
  {
    id: "i-canele",
    category_id: "c-dessert",
    name: "咸蛋黄熔岩可丽露",
    description: "法式可丽露 · 流心咸蛋黄",
    base_price: 22,
    image_url: img("photo-1606313564200-e75d5e30476c"),
    tags: ["甜点", "网红"],
    sold_count: 1980,
    rating: 4.8,
    is_available: true,
    is_featured: false,
  },
  {
    id: "i-basque",
    category_id: "c-dessert",
    name: "抹茶巴斯克",
    description: "宇治抹茶 · 烤布蕾质地",
    base_price: 28,
    image_url: img("photo-1565958011703-44f9829ba187"),
    tags: ["甜点", "抹茶"],
    sold_count: 1640,
    rating: 4.8,
    is_available: true,
    is_featured: false,
  },
];

const wagyuOptions: ItemOptionGroup[] = [
  {
    id: "g-size",
    item_id: "i-wagyu",
    name: "份量",
    is_required: true,
    sort_order: 1,
    options: [
      { id: "o-s-1", group_id: "g-size", label: "小份", price_delta: -10, is_default: false, sort_order: 1 },
      { id: "o-s-2", group_id: "g-size", label: "标准", price_delta: 0, is_default: true, sort_order: 2 },
      { id: "o-s-3", group_id: "g-size", label: "大份", price_delta: 18, is_default: false, sort_order: 3 },
    ] satisfies ItemOption[],
  },
  {
    id: "g-done",
    item_id: "i-wagyu",
    name: "熟度",
    is_required: true,
    sort_order: 2,
    options: [
      { id: "o-d-1", group_id: "g-done", label: "五分熟", price_delta: 0, is_default: true, sort_order: 1 },
      { id: "o-d-2", group_id: "g-done", label: "七分熟", price_delta: 0, is_default: false, sort_order: 2 },
      { id: "o-d-3", group_id: "g-done", label: "全熟", price_delta: 0, is_default: false, sort_order: 3 },
    ],
  },
  {
    id: "g-add",
    item_id: "i-wagyu",
    name: "加配",
    is_required: false,
    sort_order: 3,
    options: [
      { id: "o-a-1", group_id: "g-add", label: "溏心蛋", price_delta: 6, is_default: false, sort_order: 1 },
      { id: "o-a-2", group_id: "g-add", label: "黑松露切片", price_delta: 28, is_default: false, sort_order: 2 },
      { id: "o-a-3", group_id: "g-add", label: "炙烤蔬菜", price_delta: 12, is_default: false, sort_order: 3 },
    ],
  },
];

export function mockItemWithOptions(id: string): ItemWithOptions | null {
  const base = mockItems.find((i) => i.id === id);
  if (!base) return null;
  return {
    ...base,
    option_groups: id === "i-wagyu" ? wagyuOptions : [],
  };
}
