-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('docs', 'docs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for docs bucket
CREATE POLICY "Public read access for docs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'docs');

CREATE POLICY "Authenticated users can upload to docs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'docs');

CREATE POLICY "Authenticated users can update docs"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'docs');

CREATE POLICY "Authenticated users can delete docs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'docs');
