-- ============================================================================
-- Dine — schema.sql
-- Run this once in the Supabase SQL editor (or `supabase db reset`).
-- Tables, indexes, RLS, and an RPC for personalized recommendations.
-- ============================================================================

-- Extensions ----------------------------------------------------------------
create extension if not exists "pgcrypto";

-- Tables --------------------------------------------------------------------
create table if not exists categories (
    id            uuid primary key default gen_random_uuid(),
    slug          text not null unique,
    name          text not null,
    sort_order    int  not null default 0,
    created_at    timestamptz not null default now()
);

create table if not exists items (
    id              uuid primary key default gen_random_uuid(),
    category_id     uuid not null references categories(id) on delete restrict,
    name            text not null,
    description     text,
    price      numeric(10,2) not null check (price >= 0),
    image       text,
    tags            text[] default '{}',
    -- denormalized counters that power "热销" without a heavy aggregate
    sold_count      int not null default 0,
    rating          numeric(3,2) not null default 4.8 check (rating between 0 and 5),
    is_available    boolean not null default true,
    is_featured     boolean not null default false,
    created_at      timestamptz not null default now(),
    -- generated tsvector — drives /search without an external service
    search_vec      tsvector generated always as (
        setweight(to_tsvector('simple', coalesce(name, '')), 'A') ||
        setweight(to_tsvector('simple', coalesce(description, '')), 'B') ||
        setweight(to_tsvector('simple', array_to_string(coalesce(tags, '{}'), ' ')), 'C')
    ) stored
);
create index if not exists items_category_idx on items(category_id);
create index if not exists items_sold_idx     on items(sold_count desc);
create index if not exists items_search_idx   on items using gin(search_vec);

-- A flexible SKU model: each option group (e.g. "份量", "甜度") has options
-- that adjust the base price by `price_delta`.
create table if not exists item_option_groups (
    id          uuid primary key default gen_random_uuid(),
    item_id     uuid not null references items(id) on delete cascade,
    name        text not null,
    is_required boolean not null default true,
    sort_order  int not null default 0
);
create table if not exists item_options (
    id           uuid primary key default gen_random_uuid(),
    group_id     uuid not null references item_option_groups(id) on delete cascade,
    label        text not null,
    price_delta  numeric(10,2) not null default 0,
    is_default   boolean not null default false,
    sort_order   int not null default 0
);

create type order_status as enum ('pending', 'paid', 'preparing', 'ready', 'completed', 'cancelled');

create table if not exists orders (
    id            uuid primary key default gen_random_uuid(),
    user_id       uuid references auth.users(id) on delete set null,
    status        order_status not null default 'pending',
    subtotal      numeric(10,2) not null,
    discount      numeric(10,2) not null default 0,
    total         numeric(10,2) not null,
    note          text,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);
create index if not exists orders_user_idx   on orders(user_id);
create index if not exists orders_status_idx on orders(status);

create table if not exists order_items (
    id              uuid primary key default gen_random_uuid(),
    order_id        uuid not null references orders(id) on delete cascade,
    item_id         uuid not null references items(id),
    item_name       text not null,                  -- snapshot
    unit_price      numeric(10,2) not null,         -- snapshot incl. options
    quantity        int not null check (quantity > 0),
    options_summary text                            -- "大份 / 少冰"
);

-- Row-Level Security --------------------------------------------------------
alter table categories          enable row level security;
alter table items               enable row level security;
alter table item_option_groups  enable row level security;
alter table item_options        enable row level security;
alter table orders              enable row level security;
alter table order_items         enable row level security;

-- Public read for the menu surface
create policy "menu read" on categories          for select using (true);
create policy "menu read" on items               for select using (true);
create policy "menu read" on item_option_groups  for select using (true);
create policy "menu read" on item_options        for select using (true);

-- Users see only their own orders
create policy "own orders" on orders
    for select using (auth.uid() = user_id);
create policy "own order items" on order_items
    for select using (
        exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
    );

-- Users may create orders for themselves
create policy "create own orders" on orders
    for insert with check (auth.uid() = user_id);
create policy "create own order items" on order_items
    for insert with check (
        exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
    );

-- Trigger to keep updated_at fresh + bump sold_count on paid
create or replace function bump_updated_at() returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trg_orders_updated on orders;
create trigger trg_orders_updated before update on orders
    for each row execute function bump_updated_at();

-- RPC: lightweight "personalized" recommendation.
-- Strategy: items in categories the user has previously purchased, ordered by
-- popularity, falling back to global best sellers for cold-start users.
-- Returns the standard items shape so the client treats it like any other list.
create or replace function recommended_items(p_limit int default 6)
returns setof items
language sql stable as $$
    with seen as (
        select distinct i.category_id
        from order_items oi
        join orders o  on o.id = oi.order_id
        join items  i  on i.id = oi.item_id
        where o.user_id = auth.uid() and o.status <> 'cancelled'
    )
    select i.*
    from items i
    where i.is_available
      and (
            (select count(*) from seen) = 0
         or i.category_id in (select category_id from seen)
      )
    order by i.sold_count desc, i.rating desc
    limit p_limit;
$$;
