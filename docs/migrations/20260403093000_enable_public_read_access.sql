-- Enable public read access for the landing-facing experience.
-- This allows anonymous visitors to:
-- 1. browse the family tree
-- 2. view upcoming events
-- 3. use kinship lookup without logging in

alter table public.persons enable row level security;
alter table public.relationships enable row level security;
alter table public.custom_events enable row level security;

drop policy if exists "Enable read access for authenticated users" on public.persons;
drop policy if exists "Public can view persons" on public.persons;
create policy "Public can view persons"
on public.persons
for select
using (true);

drop policy if exists "Enable read access for authenticated users" on public.relationships;
drop policy if exists "Public can view relationships" on public.relationships;
create policy "Public can view relationships"
on public.relationships
for select
using (true);

drop policy if exists "Enable read access for authenticated users" on public.custom_events;
drop policy if exists "Public can view custom events" on public.custom_events;
create policy "Public can view custom events"
on public.custom_events
for select
using (true);
