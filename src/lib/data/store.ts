import { readFile, writeFile, access, mkdir } from "fs/promises";
import { join } from "path";
import { defaultSiteContent } from "./mock-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  SiteContent,
  PortfolioItem,
  ServiceItem,
  Testimonial,
  ContactMessage,
  HeroContent,
  AboutContent,
  ContactInfo,
  SiteSettings,
} from "@/lib/types";

const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "site-content.json");
const MESSAGES_FILE = join(DATA_DIR, "messages.json");

// Helper to safely get Supabase client
async function getSupabase() {
  try {
    return await createServerSupabaseClient();
  } catch (err) {
    console.warn("Supabase client instantiation failed (likely static build), falling back to local:", err);
    return null;
  }
}

async function ensureDataDir() {
  try {
    await access(DATA_DIR);
  } catch {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    // Only attempt to write fallback file locally if not in Vercel serverless environment
    if (process.env.VERCEL !== "1") {
      try {
        await ensureDataDir();
        await writeFile(file, JSON.stringify(fallback, null, 2));
      } catch (err) {
        console.error("Local JSON write fallback failed:", err);
      }
    }
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T) {
  if (process.env.VERCEL === "1") {
    console.warn("Skipping local file write on Vercel read-only environment");
    return;
  }
  await ensureDataDir();
  await writeFile(file, JSON.stringify(data, null, 2));
}

export async function getSiteContent(): Promise<SiteContent> {
  const supabase = await getSupabase();
  if (supabase) {
    try {
      const [
        { data: hero },
        { data: about },
        { data: settings },
        { data: contact },
        { data: services },
        { data: testimonials },
        { data: portfolio },
      ] = await Promise.all([
        supabase.from("hero_content").select("*").maybeSingle(),
        supabase.from("about_content").select("*").maybeSingle(),
        supabase.from("site_settings").select("*").maybeSingle(),
        supabase.from("contact_info").select("*").maybeSingle(),
        supabase.from("service_items").select("*").order("order", { ascending: true }),
        supabase.from("testimonials").select("*"),
        supabase.from("portfolio_items").select("*").order("created_at", { ascending: false }),
      ]);

      return {
        hero: (hero as any) || defaultSiteContent.hero,
        about: (about as any) || defaultSiteContent.about,
        settings: (settings as any) || defaultSiteContent.settings,
        contact: (contact as any) || defaultSiteContent.contact,
        services: (services as any[]) || defaultSiteContent.services,
        testimonials: (testimonials as any[]) || defaultSiteContent.testimonials,
        portfolio: (portfolio as any[]) || defaultSiteContent.portfolio,
      };
    } catch (dbError) {
      console.error("Supabase select query failed, falling back to local JSON database:", dbError);
    }
  }

  return readJson<SiteContent>(DATA_FILE, defaultSiteContent);
}

export async function updateHero(data: Partial<HeroContent>) {
  const supabase = await getSupabase();
  if (supabase) {
    const { data: hero } = await supabase.from("hero_content").select("id").maybeSingle();
    if (hero?.id) {
      const { data: updated } = await supabase
        .from("hero_content")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", hero.id)
        .select()
        .single();
      return updated;
    } else {
      const { data: inserted } = await supabase
        .from("hero_content")
        .insert({ ...data, updated_at: new Date().toISOString() })
        .select()
        .single();
      return inserted;
    }
  }

  const content = await getSiteContent();
  content.hero = { ...content.hero, ...data, updated_at: new Date().toISOString() };
  await writeJson(DATA_FILE, content);
  return content.hero;
}

export async function updateAbout(data: Partial<AboutContent>) {
  const supabase = await getSupabase();
  if (supabase) {
    const { data: about } = await supabase.from("about_content").select("id").maybeSingle();
    if (about?.id) {
      const { data: updated } = await supabase
        .from("about_content")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", about.id)
        .select()
        .single();
      return updated;
    } else {
      const { data: inserted } = await supabase
        .from("about_content")
        .insert({ ...data, updated_at: new Date().toISOString() })
        .select()
        .single();
      return inserted;
    }
  }

  const content = await getSiteContent();
  content.about = { ...content.about, ...data, updated_at: new Date().toISOString() };
  await writeJson(DATA_FILE, content);
  return content.about;
}

export async function updateContact(data: Partial<ContactInfo>) {
  const supabase = await getSupabase();
  if (supabase) {
    const { data: contact } = await supabase.from("contact_info").select("id").maybeSingle();
    if (contact?.id) {
      const { data: updated } = await supabase
        .from("contact_info")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", contact.id)
        .select()
        .single();
      return updated;
    } else {
      const { data: inserted } = await supabase
        .from("contact_info")
        .insert({ ...data, updated_at: new Date().toISOString() })
        .select()
        .single();
      return inserted;
    }
  }

  const content = await getSiteContent();
  content.contact = { ...content.contact, ...data, updated_at: new Date().toISOString() };
  await writeJson(DATA_FILE, content);
  return content.contact;
}

export async function updateSettings(data: Partial<SiteSettings>) {
  const supabase = await getSupabase();
  if (supabase) {
    const { data: settings } = await supabase.from("site_settings").select("id").maybeSingle();
    if (settings?.id) {
      const { data: updated } = await supabase
        .from("site_settings")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", settings.id)
        .select()
        .single();
      return updated;
    } else {
      const { data: inserted } = await supabase
        .from("site_settings")
        .insert({ ...data, updated_at: new Date().toISOString() })
        .select()
        .single();
      return inserted;
    }
  }

  const content = await getSiteContent();
  content.settings = { ...content.settings, ...data, updated_at: new Date().toISOString() };
  await writeJson(DATA_FILE, content);
  return content.settings;
}

export async function getPortfolio(): Promise<PortfolioItem[]> {
  const supabase = await getSupabase();
  if (supabase) {
    const { data } = await supabase.from("portfolio_items").select("*").order("created_at", { ascending: false });
    return data || [];
  }
  return (await getSiteContent()).portfolio;
}

export async function addPortfolioItem(
  item: Omit<PortfolioItem, "id" | "created_at" | "updated_at">
) {
  const supabase = await getSupabase();
  if (supabase) {
    const { data } = await supabase.from("portfolio_items").insert(item).select().single();
    return data;
  }

  const content = await getSiteContent();
  const newItem: PortfolioItem = {
    ...item,
    id: `port-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  content.portfolio.push(newItem);
  await writeJson(DATA_FILE, content);
  return newItem;
}

export async function updatePortfolioItem(
  id: string,
  data: Partial<PortfolioItem>
) {
  const supabase = await getSupabase();
  if (supabase) {
    const { data: updated } = await supabase
      .from("portfolio_items")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    return updated;
  }

  const content = await getSiteContent();
  const index = content.portfolio.findIndex((p) => p.id === id);
  if (index === -1) return null;
  content.portfolio[index] = {
    ...content.portfolio[index],
    ...data,
    updated_at: new Date().toISOString(),
  };
  await writeJson(DATA_FILE, content);
  return content.portfolio[index];
}

export async function deletePortfolioItem(id: string) {
  const supabase = await getSupabase();
  if (supabase) {
    await supabase.from("portfolio_items").delete().eq("id", id);
    return;
  }

  const content = await getSiteContent();
  content.portfolio = content.portfolio.filter((p) => p.id !== id);
  await writeJson(DATA_FILE, content);
}

export async function getServices(): Promise<ServiceItem[]> {
  const supabase = await getSupabase();
  if (supabase) {
    const { data } = await supabase.from("service_items").select("*").order("order", { ascending: true });
    return data || [];
  }
  return (await getSiteContent()).services;
}

export async function updateServices(services: ServiceItem[]) {
  const supabase = await getSupabase();
  if (supabase) {
    // Delete existing service items and insert updated array
    await supabase.from("service_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const formatted = services.map(({ id, ...rest }) => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      return isUuid ? { id, ...rest } : rest;
    });
    const { data } = await supabase.from("service_items").insert(formatted).select();
    return (data as any) || services;
  }

  const content = await getSiteContent();
  content.services = services;
  await writeJson(DATA_FILE, content);
  return services;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await getSupabase();
  if (supabase) {
    const { data } = await supabase.from("testimonials").select("*");
    return data || [];
  }
  return (await getSiteContent()).testimonials;
}

export async function updateTestimonials(testimonials: Testimonial[]) {
  const supabase = await getSupabase();
  if (supabase) {
    await supabase.from("testimonials").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const formatted = testimonials.map(({ id, ...rest }) => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      return isUuid ? { id, ...rest } : rest;
    });
    const { data } = await supabase.from("testimonials").insert(formatted).select();
    return (data as any) || testimonials;
  }

  const content = await getSiteContent();
  content.testimonials = testimonials;
  await writeJson(DATA_FILE, content);
  return testimonials;
}

export async function getMessages(): Promise<ContactMessage[]> {
  const supabase = await getSupabase();
  if (supabase) {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    return data || [];
  }
  return readJson<ContactMessage[]>(MESSAGES_FILE, []);
}

export async function addMessage(
  msg: Omit<ContactMessage, "id" | "read" | "created_at">
) {
  const supabase = await getSupabase();
  if (supabase) {
    const { data } = await supabase.from("contact_messages").insert(msg).select().single();
    return data;
  }

  const messages = await getMessages();
  const newMsg: ContactMessage = {
    ...msg,
    id: `msg-${Date.now()}`,
    read: false,
    created_at: new Date().toISOString(),
  };
  messages.unshift(newMsg);
  await writeJson(MESSAGES_FILE, messages);
  return newMsg;
}

export async function markMessageRead(id: string) {
  const supabase = await getSupabase();
  if (supabase) {
    const { data } = await supabase
      .from("contact_messages")
      .update({ read: true })
      .eq("id", id)
      .select()
      .single();
    return data;
  }

  const messages = await getMessages();
  const index = messages.findIndex((m) => m.id === id);
  if (index === -1) return null;
  messages[index].read = true;
  await writeJson(MESSAGES_FILE, messages);
  return messages[index];
}

export async function deleteMessage(id: string) {
  const supabase = await getSupabase();
  if (supabase) {
    await supabase.from("contact_messages").delete().eq("id", id);
    return;
  }

  const messages = (await getMessages()).filter((m) => m.id !== id);
  await writeJson(MESSAGES_FILE, messages);
}
