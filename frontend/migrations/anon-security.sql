-- protect CoHosts table from unlimited access with the anon key --
-- enable RLS
alter table "CoHosts" enable row level security;

-- grant limited column access to anon users
-- remove all privileges(`Events` table) from anon users
revoke all on "CoHosts" from anon;
-- grant read privileges for column 'id'
grant select(id) on "CoHosts" to anon;

-- protect Events table from unlimited access with the anon key --
-- enable RLS
alter table "Events" enable row level security;

-- grant limited column access to anon users
-- remove all privileges(`Events` table) from anon users
revoke all on "Events" from anon;
-- grant read privileges for column 'id'
grant select(id) on "Events" to anon;

-- protect Follows table from unlimited access with the anon key --
-- enable RLS
alter table "Follows" enable row level security;
-- allow anon users to read follows
create policy "anon-read-follows" on public."Follows" for select using (role() = 'anon'::text);

-- protect users table from unlimited access with the anon key --
-- enable RLS
alter table "Users" enable row level security;

-- grant limited column access to anon users
-- remove all privileges(`users` table) from anon users
revoke all on "Users" from anon;
-- grant read privileges for column 'id', 'username'
grant select(id, username) on "Users" to anon;
