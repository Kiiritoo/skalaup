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
  whatsapp_text TEXT DEFAULT 'Hubungi Kami',
  whatsapp_message TEXT DEFAULT 'Halo StudioWave, saya tertarik untuk berkonsultasi mengenai layanan Anda.',
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
SELECT 'Bangun Website Impianmu', 'Platform modern untuk kreator & bisnis', 'Kami membantu kamu membuat website yang keren, responsif, dan siap bersaing di era digital.', 'Lihat Portofolio', '/portfolio'
WHERE NOT EXISTS (SELECT 1 FROM hero_content);

INSERT INTO about_content (title, description, skills, experience_years)
SELECT 'Tentang Kami', 'Kami adalah tim kreatif yang passionate soal desain dan teknologi. Sejak 2020, kami sudah bantu puluhan brand dan kreator punya presence digital yang memorable.', ARRAY['Web Design', 'UI/UX', 'Branding', 'Development', 'SEO'], 5
WHERE NOT EXISTS (SELECT 1 FROM about_content);

INSERT INTO contact_info (email, phone, address, social_instagram, social_linkedin, whatsapp_text, whatsapp_message)
SELECT 'hello@studiowave.id', '+62 812-3456-7890', 'Jakarta, Indonesia', 'https://instagram.com/studiowave', 'https://linkedin.com/company/studiowave', 'Hubungi Kami', 'Halo StudioWave, saya tertarik untuk berkonsultasi mengenai layanan Anda.'
WHERE NOT EXISTS (SELECT 1 FROM contact_info);

INSERT INTO site_settings (site_name, site_tagline, primary_color)
SELECT 'StudioWave', 'Create. Launch. Grow.', '#7C3AED'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- Add discount columns to service_items if they don't exist yet (safe migration)
ALTER TABLE service_items ADD COLUMN IF NOT EXISTS price_original TEXT DEFAULT '';
ALTER TABLE service_items ADD COLUMN IF NOT EXISTS discount_label TEXT DEFAULT '';
ALTER TABLE service_items ADD COLUMN IF NOT EXISTS discount_expires TEXT DEFAULT '';

-- Add WhatsApp columns to contact_info if they don't exist yet (safe migration)
ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS whatsapp_text TEXT DEFAULT 'Hubungi Kami';
ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS whatsapp_message TEXT DEFAULT 'Halo Skala Up, saya tertarik untuk berkonsultasi mengenai layanan Anda.';

INSERT INTO service_items (title, description, icon, price_starting, price_original, discount_label, discount_expires, featured, "order")
SELECT * FROM (VALUES
  ('Website Design', E'Desain website yang eye-catching dan user-friendly.\n- 1-2 Halaman Desain\n- Mockup UI/UX Modern\n- Revisi 3 Kali\n- Aset Grafis & Icon Custom', 'palette', 'Rp 4jt', 'Rp 5jt', '20% OFF', '30 Jun 2026', TRUE, 1),
  ('Web Development', E'Development full-stack dengan teknologi terkini.\n- Full Responsive Mobile-first\n- CMS & Dashboard Admin\n- Integrasi Database\n- Free Basic SEO Setup', 'code', 'Rp 6,5jt', 'Rp 8jt', 'BEST DEAL', '', TRUE, 2),
  ('Branding & Identity', E'Bangun identitas brand yang kuat dari logo hingga guidelines.\n- Desain Logo Utama & Alternatif\n- Palet Warna & Tipografi Brand\n- Format File Master Komplit', 'sparkles', 'Rp 3jt', '', '', '', FALSE, 3),
  ('SEO & Marketing', E'Optimasi website untuk growth yang sustainable.\n- Audit SEO Komprehensif\n- Riset Keyword Kompetitor\n- Laporan Bulanan Performa', 'trending-up', 'Rp 2jt/bulan', '', '', '', FALSE, 4)
) AS v(title, description, icon, price_starting, price_original, discount_label, discount_expires, featured, ord)
WHERE NOT EXISTS (SELECT 1 FROM service_items);

INSERT INTO testimonials (name, role, company, content, rating, featured)
SELECT * FROM (VALUES
  ('Sarah Wijaya', 'Founder', 'Bloom Cafe', 'Website yang dibuat StudioWave bener-bener ngebantu bisnis kami grow. Desainnya fresh banget dan customernya suka!', 5, TRUE),
  ('Rizky Pratama', 'CEO', 'FitTrack', 'Timnya responsif, komunikasinya enak, dan hasilnya melebihi ekspektasi. Highly recommended!', 5, TRUE),
  ('Diana Putri', 'Creative Director', 'Studio Lumière', 'Portfolio website kami jadi lebih professional dan banyak client baru yang datang lewat online.', 4, FALSE)
) AS v(name, role, company, content, rating, featured)
WHERE NOT EXISTS (SELECT 1 FROM testimonials);

INSERT INTO portfolio_items (title, description, category, tags, project_url, featured)
SELECT * FROM (VALUES
  ('Bloom Cafe', 'Website modern untuk coffee shop dengan online ordering dan menu interaktif.', 'Food & Beverage', ARRAY['Next.js', 'E-commerce', 'UI Design'], '#', TRUE),
  ('FitTrack App', 'Landing page dan dashboard untuk aplikasi fitness tracking generasi Z.', 'Health & Fitness', ARRAY['React', 'Mobile-first', 'Animation'], '#', TRUE),
  ('Studio Lumière', 'Portfolio website untuk studio fotografi dengan galeri immersive.', 'Creative', ARRAY['Photography', 'Gallery', 'Minimal'], '#', FALSE),
  ('TechStart Hub', 'Corporate website untuk startup incubator dengan blog dan event calendar.', 'Technology', ARRAY['CMS', 'Blog', 'Corporate'], '#', FALSE)
) AS v(title, description, category, tags, project_url, featured)
WHERE NOT EXISTS (SELECT 1 FROM portfolio_items);
