-- protect events table from unlimited access with the anon key --
-- enable RLS
alter table events enable row level security;

-- grant limited column access to anon users
-- remove all privileges(`events` table) from anon users
revoke all on events from anon;
-- grant read privileges for column 'id'
grant select(id) on events to anon;

-- protect Follows table from unlimited access with the anon key --
-- enable RLS
alter table "Follows" enable row level security;
-- allow anon users to read follows
create policy "anon-read-follows" on public."Follows" for select using (role() = 'anon'::text);

-- protect users table from unlimited access with the anon key --
-- enable RLS
alter table users enable row level security;

-- grant limited column access to anon users
-- remove all privileges(`users` table) from anon users
revoke all on users from anon;
-- grant read privileges for column 'id', 'username'
grant select(id, username) on users to anon;
