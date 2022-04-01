-- create bucket
insert into storage.buckets (id, name) values ('impish', 'impish-storage-bucket');
-- create policies
create policy "Public access to images" on storage.objects for select using ( bucket_id = 'impish-storage-bucket' );
create policy "Upload image: authenticated users only" on storage.objects for insert using ((bucket_id = 'impish-storage-bucket'::text) AND (role() = 'authenticated'::text));
create policy "Update image: authenticated users only" on storage.objects for update using ((bucket_id = 'impish-storage-bucket'::text) AND (role() = 'authenticated'::text));
create policy "Remove image: authenticated users only" on storage.objects for delete using ((bucket_id = 'impish-storage-bucket'::text) AND (role() = 'authenticated'::text));
