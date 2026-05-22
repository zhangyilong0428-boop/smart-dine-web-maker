/**
 * Supabase row types — kept hand-written for ergonomics.
 * In a "real" production setup you'd generate this with `supabase gen types`.
 */

export type OrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export interface Category {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
}

export interface Item {
  id: string;
  category_id: string;
  name: string;
  description: string | null;

  price: number;
  image: string | null;

  tags: string[];
  sold_count: number;

  // 加这里
  rating: number;

  is_available: boolean;
  is_featured: boolean;
}

export interface ItemOption {
  id: string;
  group_id: string;
  label: string;
  price_delta: number;
  is_default: boolean;
  sort_order: number;
}

export interface ItemOptionGroup {
  id: string;
  item_id: string;
  name: string;
  is_required: boolean;
  sort_order: number;
  options: ItemOption[];
}

export interface ItemWithOptions extends Item {
  option_groups: ItemOptionGroup[];
}

export interface Order {
  id: string;
  user_id: string | null;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  total: number;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  item_id: string;
  item_name: string;
  unit_price: number;
  quantity: number;
  options_summary: string | null;
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Partial<Category>;
        Update: Partial<Category>;
      };
      items: { Row: Item; Insert: Partial<Item>; Update: Partial<Item> };
      item_option_groups: {
        Row: Omit<ItemOptionGroup, "options">;
        Insert: Partial<Omit<ItemOptionGroup, "options">>;
        Update: Partial<Omit<ItemOptionGroup, "options">>;
      };
      item_options: {
        Row: ItemOption;
        Insert: Partial<ItemOption>;
        Update: Partial<ItemOption>;
      };
      orders: {
        Row: Order;
        Insert: Pick<Order, "user_id" | "subtotal" | "discount" | "total"> & {
          status?: OrderStatus;
          note?: string | null;
        };
        Update: Partial<Order>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id">;
        Update: Partial<OrderItem>;
      };
    };
    Functions: {
      recommended_items: { Args: { p_limit?: number }; Returns: Item[] };
    };
  };
}
