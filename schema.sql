
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  referrer_name text,
  status text not null default 'pending' check (status in ('pending','approved','suspended')),
  role text not null default 'member' check (role in ('member','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  size text,
  price numeric(10,2) not null default 0,
  stock_status text,
  description text,
  additional_info text,
  dosing text,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists(
    select 1 from public.profiles
    where id = auth.uid() and role='admin'
  );
$$;

create or replace function public.is_approved()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists(
    select 1 from public.profiles
    where id = auth.uid() and status='approved'
  );
$$;

drop policy if exists "profile self read" on public.profiles;
create policy "profile self read" on public.profiles for select
using (id=auth.uid() or public.is_admin());

drop policy if exists "profile self insert" on public.profiles;
create policy "profile self insert" on public.profiles for insert
with check (id=auth.uid());

drop policy if exists "admin update profiles" on public.profiles;
create policy "admin update profiles" on public.profiles for update
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "approved read products" on public.products;
create policy "approved read products" on public.products for select
using (public.is_approved());

drop policy if exists "admin manage products" on public.products;
create policy "admin manage products" on public.products for all
using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id,name,public)
values ('product-images','product-images',true)
on conflict (id) do update set public=true;

drop policy if exists "admin upload product images" on storage.objects;
create policy "admin upload product images" on storage.objects for insert
to authenticated with check (bucket_id='product-images' and public.is_admin());

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects for select
using (bucket_id='product-images');
