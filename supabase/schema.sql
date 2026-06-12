-- StudioWave CMS Database Schema
-- Jalankan SQL ini di Supabase SQL Editor setelah project dibuat

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hero Section
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  cta_text TEXT NOT NULL DEFAULT '',
  cta_link TEXT NOT NULL DEFAULT '/portfolio',
  image_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- About Section
CREATE TABLE IF NOT EXISTS about_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  project_url TEXT DEFAULT '',
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE IF NOT EXISTS service_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT DEFAULT 'sparkles',
  price_starting TEXT DEFAULT '',
  price_original TEXT DEFAULT '',
  discount_label TEXT DEFAULT '',
  discount_expires TEXT DEFAULT '',
  featured BOOLEAN DEFAULT FALSE,
  "order" INTEGER DEFAULT 0
);

-- Contact Info
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  social_instagram TEXT DEFAULT '',
  social_linkedin TEXT DEFAULT '',
  social_twitter TEXT DEFAULT '',
  social_github TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  company TEXT DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  avatar_url TEXT DEFAULT '',
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN DEFAULT FALSE
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'StudioWave',
  site_tagline TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  primary_color TEXT DEFAULT '#7C3AED',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies (Idempotent)
DROP POLICY IF EXISTS "Public read hero" ON hero_content;
CREATE POLICY "Public read hero" ON hero_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read about" ON about_content;
CREATE POLICY "Public read about" ON about_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read portfolio" ON portfolio_items;
CREATE POLICY "Public read portfolio" ON portfolio_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read services" ON service_items;
CREATE POLICY "Public read services" ON service_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read contact" ON contact_info;
CREATE POLICY "Public read contact" ON contact_info FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read settings" ON site_settings;
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);

-- Public insert messages
DROP POLICY IF EXISTS "Public insert messages" ON contact_messages;
CREATE POLICY "Public insert messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Authenticated write policies
DROP POLICY IF EXISTS "Auth write hero" ON hero_content;
CREATE POLICY "Auth write hero" ON hero_content FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth write about" ON about_content;
CREATE POLICY "Auth write about" ON about_content FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth write portfolio" ON portfolio_items;
CREATE POLICY "Auth write portfolio" ON portfolio_items FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth write services" ON service_items;
CREATE POLICY "Auth write services" ON service_items FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth write contact" ON contact_info;
CREATE POLICY "Auth write contact" ON contact_info FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth write testimonials" ON testimonials;
CREATE POLICY "Auth write testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth read messages" ON contact_messages;
CREATE POLICY "Auth read messages" ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth update messages" ON contact_messages;
CREATE POLICY "Auth update messages" ON contact_messages FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth delete messages" ON contact_messages;
CREATE POLICY "Auth delete messages" ON contact_messages FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth write settings" ON site_settings;
CREATE POLICY "Auth write settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Insert default data safely (Only if tables are empty)
INSERT INTO hero_content (title, subtitle, description, cta_text, cta_link)
SELECT 'Bangun Website Impianmu', 'Platform modern untuk kreator & bisnis', 'Kami membantu kamu membuat website yang keren.', 'Lihat Portofolio', '/portfolio'
WHERE NOT EXISTS (SELECT 1 FROM hero_content);

INSERT INTO about_content (title, description, skills, experience_years)
SELECT 'Tentang Kami', 'Tim kreatif yang passionate soal desain dan teknologi.', ARRAY['Web Design', 'UI/UX', 'Development'], 5
WHERE NOT EXISTS (SELECT 1 FROM about_content);

INSERT INTO contact_info (email, phone, address)
SELECT 'hello@studiowave.id', '+62 812-3456-7890', 'Jakarta, Indonesia'
WHERE NOT EXISTS (SELECT 1 FROM contact_info);

INSERT INTO site_settings (site_name, site_tagline)
SELECT 'StudioWave', 'Create. Launch. Grow.'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);
