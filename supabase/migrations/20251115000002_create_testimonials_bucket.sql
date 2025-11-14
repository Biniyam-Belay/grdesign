-- supabase/migrations/20251115000002_create_testimonials_bucket.sql

-- Create a bucket for testimonials
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonials', 'testimonials', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for the testimonials bucket
-- Allow public read access
CREATE POLICY "Allow public read access for testimonials"
ON storage.objects FOR SELECT
USING ( bucket_id = 'testimonials' );

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload testimonials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'testimonials' );

-- Allow owner to update their own files
CREATE POLICY "Allow owner to update their own testimonials"
ON storage.objects FOR UPDATE
USING ( auth.uid() = owner );

-- Allow owner to delete their own files
CREATE POLICY "Allow owner to delete their own testimonials"
ON storage.objects FOR DELETE
USING ( auth.uid() = owner );
