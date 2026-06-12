export interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  updated_at: string;
}

export interface AboutContent {
  id: string;
  title: string;
  description: string;
  image_url: string;
  skills: string[];
  experience_years: number;
  updated_at: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  tags: string[];
  project_url: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  price_starting: string;
  price_original: string;      // Harga sebelum diskon (kosong = tidak ada diskon)
  discount_label: string;      // Badge teks, mis: "20% OFF", "PROMO", "LIMITED"
  discount_expires: string;    // Tanggal kedaluwarsa promo, mis: "31 Des 2026" (kosong = tanpa batas)
  featured: boolean;
  order: number;
}

export interface ContactInfo {
  id: string;
  email: string;
  phone: string;
  address: string;
  social_instagram: string;
  social_linkedin: string;
  social_twitter: string;
  social_github: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar_url: string;
  rating: number;
  featured: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  site_tagline: string;
  logo_url: string;
  primary_color: string;
  updated_at: string;
}

export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  portfolio: PortfolioItem[];
  services: ServiceItem[];
  contact: ContactInfo;
  testimonials: Testimonial[];
  settings: SiteSettings;
}
