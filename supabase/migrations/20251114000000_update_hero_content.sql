-- Update hero content to match current hardcoded values
UPDATE site_settings 
SET value = '{"status": "available", "label": "Available Now on Upwork"}'
WHERE key = 'hero_availability';

UPDATE site_settings 
SET value = '{
  "kicker": "Professional Design Services",
  "title1": "Hire Expert Designer",
  "title2": "That Delivers Results",
  "subtitle": "Professional graphic designer specializing in branding, social media, and web design — trusted by agencies, startups, and organizations for fast, quality delivery."
}'
WHERE key = 'hero_text';

-- Add additional hero settings for the full content
INSERT INTO site_settings (key, value) VALUES
  ('hero_mobile_subtitle', '{"text": "Professional designer delivering graphic design, branding, social media content, and web solutions — perfect for agencies, startups, and HR teams hiring top talent."}'),
  ('hero_credentials', '{"primary": "Top Rated • Fast Delivery", "secondary": "Rated Designer", "turnaround": "Fast 7-14 Day Turnaround"}'),
  ('hero_trust_signals', '{"items": ["Quality guarantee", "Same-day response", "Revision-friendly"]}'),
  ('hero_urgency', '{"text": "Perfect for agencies & startups", "highlight": "Same-day response"}'),
  ('hero_limited_capacity', '{"title": "Limited Capacity", "slots": "3 project slots", "period": "this month"}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
