import { readFile, writeFile, access, mkdir } from "fs/promises";
import { join } from "path";
import { defaultSiteContent } from "./mock-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
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

// ─── Supabase helpers ─────────────────────────────────────────────────────────

/** Read client — anon key, respects RLS public-read policies */
async function getReadClient() {
  try {
    return await createServerSupabaseClient();
  } catch {
    return null;
  }
}

/** Write client — service role key, bypasses RLS entirely */
function getWriteClient() {
  return createAdminSupabaseClient();
}

// ─── Local JSON helpers (dev fallback) ────────────────────────────────────────

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
    console.warn("Skipping local file write on Vercel (read-only filesystem)");
    return;
  }
  await ensureDataDir();
  await writeFile(file, JSON.stringify(data, null, 2));
}

// ─── Site Content (full) ──────────────────────────────────────────────────────

export async function getSiteContent(): Promise<SiteContent> {
  const supabase = await getReadClient();
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
        hero: (hero as any) ?? defaultSiteContent.hero,
        about: (about as any) ?? defaultSiteContent.about,
        settings: (settings as any) ?? defaultSiteContent.settings,
        contact: (contact as any) ?? defaultSiteContent.contact,
        // Only fall back to mock data if the table is truly empty (no rows at all)
        services: (services && services.length > 0)
          ? (services as any[])
          : defaultSiteContent.services,
        testimonials: (testimonials && testimonials.length > 0)
          ? (testimonials as any[])
          : defaultSiteContent.testimonials,
        portfolio: (portfolio && portfolio.length > 0)
          ? (portfolio as any[])
          : defaultSiteContent.portfolio,
      };
    } catch (dbError) {
      console.error("Supabase read failed, using local JSON:", dbError);
    }
  }
  return readJson<SiteContent>(DATA_FILE, defaultSiteContent);
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export async function updateHero(data: Partial<HeroContent>) {
  const admin = getWriteClient();
  if (admin) {
    const { data: existing } = await admin.from("hero_content").select("id").maybeSingle();
    if (existing?.id) {
      const { data: updated, error } = await admin
        .from("hero_content")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated;
    } else {
      const { data: inserted, error } = await admin
        .from("hero_content")
        .insert({ ...data, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return inserted;
    }
  }
  const content = await getSiteContent();
  content.hero = { ...content.hero, ...data, updated_at: new Date().toISOString() };
  await writeJson(DATA_FILE, content);
  return content.hero;
}

// ─── About ────────────────────────────────────────────────────────────────────

export async function updateAbout(data: Partial<AboutContent>) {
  const admin = getWriteClient();
  if (admin) {
    const { data: existing } = await admin.from("about_content").select("id").maybeSingle();
    if (existing?.id) {
      const { data: updated, error } = await admin
        .from("about_content")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated;
    } else {
      const { data: inserted, error } = await admin
        .from("about_content")
        .insert({ ...data, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return inserted;
    }
  }
  const content = await getSiteContent();
  content.about = { ...content.about, ...data, updated_at: new Date().toISOString() };
  await writeJson(DATA_FILE, content);
  return content.about;
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export async function updateContact(data: Partial<ContactInfo>) {
  const admin = getWriteClient();
  if (admin) {
    const { data: existing } = await admin.from("contact_info").select("id").maybeSingle();
    if (existing?.id) {
      const { data: updated, error } = await admin
        .from("contact_info")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated;
    } else {
      const { data: inserted, error } = await admin
        .from("contact_info")
        .insert({ ...data, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return inserted;
    }
  }
  const content = await getSiteContent();
  content.contact = { ...content.contact, ...data, updated_at: new Date().toISOString() };
  await writeJson(DATA_FILE, content);
  return content.contact;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function updateSettings(data: Partial<SiteSettings>) {
  const admin = getWriteClient();
  if (admin) {
    const { data: existing } = await admin.from("site_settings").select("id").maybeSingle();
    if (existing?.id) {
      const { data: updated, error } = await admin
        .from("site_settings")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated;
    } else {
      const { data: inserted, error } = await admin
        .from("site_settings")
        .insert({ ...data, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return inserted;
    }
  }
  const content = await getSiteContent();
  content.settings = { ...content.settings, ...data, updated_at: new Date().toISOString() };
  await writeJson(DATA_FILE, content);
  return content.settings;
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

export async function getPortfolio(): Promise<PortfolioItem[]> {
  const supabase = await getReadClient();
  if (supabase) {
    const { data } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("created_at", { ascending: false });
    return (data as any[]) || [];
  }
  return (await getSiteContent()).portfolio;
}

export async function addPortfolioItem(
  item: Omit<PortfolioItem, "id" | "created_at" | "updated_at">
) {
  const admin = getWriteClient();
  if (admin) {
    const { data, error } = await admin
      .from("portfolio_items")
      .insert(item)
      .select()
      .single();
    if (error) throw new Error(error.message);
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

export async function updatePortfolioItem(id: string, data: Partial<PortfolioItem>) {
  const admin = getWriteClient();
  if (admin) {
    const { data: updated, error } = await admin
      .from("portfolio_items")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
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
  const admin = getWriteClient();
  if (admin) {
    const { error } = await admin.from("portfolio_items").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  const content = await getSiteContent();
  content.portfolio = content.portfolio.filter((p) => p.id !== id);
  await writeJson(DATA_FILE, content);
}

// ─── Services ─────────────────────────────────────────────────────────────────

export async function getServices(): Promise<ServiceItem[]> {
  const supabase = await getReadClient();
  if (supabase) {
    const { data } = await supabase
      .from("service_items")
      .select("*")
      .order("order", { ascending: true });
    return (data as any[]) || [];
  }
  return (await getSiteContent()).services;
}

export async function addServiceItem(
  item: Omit<ServiceItem, "id">
) {
  const admin = getWriteClient();
  if (admin) {
    const { data, error } = await admin
      .from("service_items")
      .insert(item)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
  const content = await getSiteContent();
  const newItem: ServiceItem = { ...item, id: `svc-${Date.now()}` };
  content.services.push(newItem);
  await writeJson(DATA_FILE, content);
  return newItem;
}

export async function updateServiceItem(id: string, data: Partial<ServiceItem>) {
  const admin = getWriteClient();
  if (admin) {
    const { data: updated, error } = await admin
      .from("service_items")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return updated;
  }
  const content = await getSiteContent();
  const index = content.services.findIndex((s) => s.id === id);
  if (index === -1) return null;
  content.services[index] = { ...content.services[index], ...data };
  await writeJson(DATA_FILE, content);
  return content.services[index];
}

export async function deleteServiceItem(id: string) {
  const admin = getWriteClient();
  if (admin) {
    const { error } = await admin.from("service_items").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  const content = await getSiteContent();
  content.services = content.services.filter((s) => s.id !== id);
  await writeJson(DATA_FILE, content);
}

// Keep batch-update for backward compat with existing services-manager
export async function updateServices(services: ServiceItem[]) {
  const admin = getWriteClient();
  if (admin) {
    // Upsert: insert new rows, update existing ones (by id)
    const rows = services.map(({ id, ...rest }) => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      return isUuid ? { id, ...rest } : { ...rest };
    });
    // Delete all then re-insert (safest for full replace)
    const { error: delError } = await admin
      .from("service_items")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (delError) throw new Error(delError.message);
    const { data, error: insError } = await admin
      .from("service_items")
      .insert(rows)
      .select();
    if (insError) throw new Error(insError.message);
    return (data as any) || services;
  }
  const content = await getSiteContent();
  content.services = services;
  await writeJson(DATA_FILE, content);
  return services;
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await getReadClient();
  if (supabase) {
    const { data } = await supabase.from("testimonials").select("*");
    return (data as any[]) || [];
  }
  return (await getSiteContent()).testimonials;
}

export async function addTestimonial(item: Omit<Testimonial, "id">) {
  const admin = getWriteClient();
  if (admin) {
    const { data, error } = await admin
      .from("testimonials")
      .insert(item)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
  const content = await getSiteContent();
  const newItem: Testimonial = { ...item, id: `tst-${Date.now()}` };
  content.testimonials.push(newItem);
  await writeJson(DATA_FILE, content);
  return newItem;
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>) {
  const admin = getWriteClient();
  if (admin) {
    const { data: updated, error } = await admin
      .from("testimonials")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return updated;
  }
  const content = await getSiteContent();
  const index = content.testimonials.findIndex((t) => t.id === id);
  if (index === -1) return null;
  content.testimonials[index] = { ...content.testimonials[index], ...data };
  await writeJson(DATA_FILE, content);
  return content.testimonials[index];
}

export async function deleteTestimonial(id: string) {
  const admin = getWriteClient();
  if (admin) {
    const { error } = await admin.from("testimonials").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  const content = await getSiteContent();
  content.testimonials = content.testimonials.filter((t) => t.id !== id);
  await writeJson(DATA_FILE, content);
}

// Keep batch-update for backward compat
export async function updateTestimonials(testimonials: Testimonial[]) {
  const admin = getWriteClient();
  if (admin) {
    const rows = testimonials.map(({ id, ...rest }) => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      return isUuid ? { id, ...rest } : { ...rest };
    });
    const { error: delError } = await admin
      .from("testimonials")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (delError) throw new Error(delError.message);
    const { data, error: insError } = await admin
      .from("testimonials")
      .insert(rows)
      .select();
    if (insError) throw new Error(insError.message);
    return (data as any) || testimonials;
  }
  const content = await getSiteContent();
  content.testimonials = testimonials;
  await writeJson(DATA_FILE, content);
  return testimonials;
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function getMessages(): Promise<ContactMessage[]> {
  const supabase = await getReadClient();
  if (supabase) {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    return (data as any[]) || [];
  }
  return readJson<ContactMessage[]>(MESSAGES_FILE, []);
}

export async function addMessage(
  msg: Omit<ContactMessage, "id" | "read" | "created_at">
) {
  const admin = getWriteClient();
  if (admin) {
    const { data, error } = await admin
      .from("contact_messages")
      .insert(msg)
      .select()
      .single();
    if (error) throw new Error(error.message);
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
  const admin = getWriteClient();
  if (admin) {
    const { data, error } = await admin
      .from("contact_messages")
      .update({ read: true })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
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
  const admin = getWriteClient();
  if (admin) {
    const { error } = await admin.from("contact_messages").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  const messages = (await getMessages()).filter((m) => m.id !== id);
  await writeJson(MESSAGES_FILE, messages);
}
