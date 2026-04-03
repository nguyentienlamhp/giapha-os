alter table public.custom_events
add column if not exists event_type text;

update public.custom_events
set event_type = 'custom_event'
where event_type is null;

alter table public.custom_events
alter column event_type set default 'custom_event';

alter table public.custom_events
alter column event_type set not null;

alter table public.custom_events
drop constraint if exists custom_events_event_type_check;

alter table public.custom_events
add constraint custom_events_event_type_check
check (event_type in ('custom_event', 'organized_event'));

create index if not exists idx_custom_events_type
on public.custom_events (event_type);
