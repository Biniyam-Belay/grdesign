-- Add insert policy for site_settings

-- Allow authenticated users to insert settings
CREATE POLICY "Authenticated users can insert settings"
ON site_settings FOR INSERT
TO authenticated
WITH CHECK (true);
