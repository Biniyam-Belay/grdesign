-- Create works table for Featured Works section
CREATE TABLE IF NOT EXISTS public.works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT NOT NULL,
  aspect_ratio TEXT DEFAULT 'square' CHECK (aspect_ratio IN ('square', 'portrait45', 'portrait916')),
  link TEXT,
  featured_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access on works"
  ON public.works
  FOR SELECT
  USING (true);

-- Authenticated users can insert
CREATE POLICY "Allow authenticated users to insert works"
  ON public.works
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "Allow authenticated users to update works"
  ON public.works
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete
CREATE POLICY "Allow authenticated users to delete works"
  ON public.works
  FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_works_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER works_updated_at
  BEFORE UPDATE ON public.works
  FOR EACH ROW
  EXECUTE FUNCTION update_works_updated_at();

-- Create storage bucket for works
INSERT INTO storage.buckets (id, name, public)
VALUES ('works', 'works', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for works bucket
CREATE POLICY "Public read access for works"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'works');

CREATE POLICY "Authenticated users can upload to works"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'works');

CREATE POLICY "Authenticated users can update works images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'works');

CREATE POLICY "Authenticated users can delete works images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'works');

-- Create index for ordering
CREATE INDEX IF NOT EXISTS works_featured_order_idx ON public.works(featured_order);
CREATE INDEX IF NOT EXISTS works_slug_idx ON public.works(slug);
