-- Add category field to works table for grouping
ALTER TABLE public.works 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS works_category_idx ON public.works(category);

-- Add a comment to describe common categories
COMMENT ON COLUMN public.works.category IS 'Category for grouping works (e.g., UI/UX, Web Design, Web Development, Social Media Design, Branding, etc.)';
