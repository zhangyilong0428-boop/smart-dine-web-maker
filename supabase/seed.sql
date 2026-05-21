-- ============================================================================
-- Dine — seed.sql
-- Demo dataset: enough variety to make the menu look like a real restaurant.
-- Idempotent for top-level rows via slug/name uniqueness.
-- ============================================================================

insert into categories (slug, name, sort_order) values
    ('signature',  '招牌主厨', 1),
    ('rice',       '米饭面食', 2),
    ('grill',      '炭火烧物', 3),
    ('drink',      '精品饮品', 4),
    ('dessert',    '甜点',     5)
on conflict (slug) do nothing;

-- Items --------------------------------------------------------------------
insert into items (category_id, name, description, base_price, image_url, tags, sold_count, rating, is_featured)
select c.id, x.name, x.description, x.base_price, x.image_url, x.tags, x.sold_count, x.rating, x.is_featured
from categories c
join (values
    -- signature
    ('signature', '主厨黑松露和牛饭',  '澳洲M9和牛 · 黑松露酱 · 半熟蛋',     128.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80', array['招牌','热销','和牛'],  1284, 4.9, true),
    ('signature', '黄油龙虾意面',      '波士顿龙虾 · 手工意面 · 焦糖黄油',   148.00, 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=900&q=80', array['招牌','奶香','海鲜'],  962,  4.8, true),
    -- rice
    ('rice',      '炭烧鳗鱼饭',        '关东烧鳗 · 山椒 · 自制蒲烧汁',       68.00,  'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80', array['日式','炭烧'],         2103, 4.8, false),
    ('rice',      '香煎鸡腿藜麦饭',    '低温慢煎 · 藜麦 · 烤蔬菜',           48.00,  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80', array['轻食','高蛋白'],       1820, 4.7, false),
    ('rice',      '番茄牛尾汤面',      '慢炖三小时 · 自制面条',              52.00,  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80', array['暖胃','炖煮'],         1530, 4.7, false),
    -- grill
    ('grill',     '岩盐战斧牛排',      '美国Prime战斧 · 岩盐慢烤',           218.00, 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80', array['硬核','分享'],         540,  4.9, true),
    ('grill',     '炭烤鸡肉串',        '果木炭烤 · 蒜香迷迭香',              32.00,  'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80', array['烧烤','下酒'],         2410, 4.6, false),
    -- drink
    ('drink',     '冷萃黑咖啡',        '埃塞日晒 · 18小时冷萃',              28.00,  'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=900&q=80', array['咖啡','冷萃'],         3120, 4.8, false),
    ('drink',     '柚见百香气泡',      '蜂蜜柚子 · 百香果 · 苏打',           24.00,  'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=900&q=80', array['气泡','清爽'],         2670, 4.7, false),
    -- dessert
    ('dessert',   '咸蛋黄熔岩可丽露',  '法式可丽露 · 流心咸蛋黄',            22.00,  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80', array['甜点','网红'],         1980, 4.8, false),
    ('dessert',   '抹茶巴斯克',        '宇治抹茶 · 烤布蕾质地',              28.00,  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80', array['甜点','抹茶'],         1640, 4.8, false)
) as x(cat_slug, name, description, base_price, image_url, tags, sold_count, rating, is_featured)
  on c.slug = x.cat_slug
where not exists (select 1 from items i where i.name = x.name);

-- SKU demo: option groups + options on the signature dish ------------------
do $$
declare
    v_item    uuid;
    v_g_size  uuid;
    v_g_done  uuid;
    v_g_addon uuid;
begin
    select id into v_item from items where name = '主厨黑松露和牛饭' limit 1;
    if v_item is null then return; end if;
    -- short-circuit if already seeded
    if exists (select 1 from item_option_groups where item_id = v_item) then return; end if;

    insert into item_option_groups (item_id, name, is_required, sort_order)
        values (v_item, '份量', true,  1) returning id into v_g_size;
    insert into item_option_groups (item_id, name, is_required, sort_order)
        values (v_item, '熟度', true,  2) returning id into v_g_done;
    insert into item_option_groups (item_id, name, is_required, sort_order)
        values (v_item, '加配', false, 3) returning id into v_g_addon;

    insert into item_options (group_id, label, price_delta, is_default, sort_order) values
        (v_g_size,  '小份',     -10.00, false, 1),
        (v_g_size,  '标准',       0.00, true,  2),
        (v_g_size,  '大份',      18.00, false, 3),
        (v_g_done,  '五分熟',     0.00, true,  1),
        (v_g_done,  '七分熟',     0.00, false, 2),
        (v_g_done,  '全熟',       0.00, false, 3),
        (v_g_addon, '溏心蛋',     6.00,  false, 1),
        (v_g_addon, '黑松露切片', 28.00, false, 2),
        (v_g_addon, '炙烤蔬菜',   12.00, false, 3);
end $$;
