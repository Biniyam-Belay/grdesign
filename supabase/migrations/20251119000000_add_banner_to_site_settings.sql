ALTER TABLE site_settings
ADD COLUMN banner_text TEXT,
ADD COLUMN banner_cta_text TEXT,
ADD COLUMN banner_cta_link TEXT,
ADD COLUMN banner_enabled BOOLEAN DEFAULT false;

