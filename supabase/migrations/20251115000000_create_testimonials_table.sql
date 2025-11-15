-- supabase/migrations/20251115000000_create_testimonials_table.sql

CREATE TABLE testimonials (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name text NOT NULL,
    role text,
    company text,
    image text,
    content text NOT NULL,
    result text,
    project text,
    rating smallint DEFAULT 5 NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to testimonials"
ON testimonials
FOR SELECT
USING (true);

-- Allow admin users to perform all actions
CREATE POLICY "Allow admin users full access to testimonials"
ON testimonials
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
