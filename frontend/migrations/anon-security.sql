-- protect notifications table from unlimited access with the anon key --
-- enable RLS
alter table notifications enable row level security;
-- allow anon users to read notifications
create policy "anon-read-notifications" on public.notifications for select using (role() = 'anon'::text);

-- grant limited column access to anon users
-- remove all previleges(`users` table) from anon users
remove all on users from anon;
-- grant read privileges for column 'id', 'username'
grant select(id, username) on users to anon;
