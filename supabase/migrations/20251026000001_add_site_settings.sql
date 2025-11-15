-- Create site_settings table for managing homepage hero content
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default values
INSERT INTO site_settings (key, value) VALUES
  ('hero_availability', '{"status": "available", "label": "Available"}'),
  ('hero_experience_years', '{"years": 3}'),
  ('hero_text', '{"kicker": "Portfolio", "title1": "Hire Expert Designer

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can read settings" ON site_settings
  FOR SELECT USING (true);

-- Only authenticated users can update settings
CREATE POLICY "Authenticated users can update settings" ON site_settings
  FOR UPDATE TO authenticated USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();
