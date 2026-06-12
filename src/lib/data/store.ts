import { readFile, writeFile, access, mkdir } from "fs/promises";
import { join } from "path";
import { defaultSiteContent } from "./mock-data";
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

async function ensureDataDir() {
  try {
    await access(DATA_DIR);
  } catch {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensureDataDir();
  try {
    await access(file);
  } catch {
    await writeFile(file, JSON.stringify(fallback, null, 2));
    return fallback;
  }
  try {
    const raw = await readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T) {
  await ensureDataDir();
  await writeFile(file, JSON.stringify(data, null, 2));
}

export async function getSiteContent(): Promise<SiteContent> {
  return readJson<SiteContent>(DATA_FILE, defaultSiteContent);
}

export async function updateHero(data: Partial<HeroContent>) {
  const content = await getSiteContent();
  content.hero = { ...content.hero, ...data, updated_at: new Date().toISOString() };
  await writeJson(DATA_FILE, content);
  return content.hero;
}

export async function updateAbout(data: Partial<AboutContent>) {
  const content = await getSiteContent();
  content.about = { ...content.about, ...data, updated_at: new Date().toISOString() };
  await writeJson(DATA_FILE, content);
  return content.about;
}

export async function updateContact(data: Partial<ContactInfo>) {
  const content = await getSiteContent();
  content.contact = { ...content.contact, ...data, updated_at: new Date().toISOString() };
  await writeJson(DATA_FILE, content);
  return content.contact;
}

export async function updateSettings(data: Partial<SiteSettings>) {
  const content = await getSiteContent();
  content.settings = { ...content.settings, ...data, updated_at: new Date().toISOString() };
  await writeJson(DATA_FILE, content);
  return content.settings;
}

export async function getPortfolio(): Promise<PortfolioItem[]> {
  return (await getSiteContent()).portfolio;
}

export async function addPortfolioItem(
  item: Omit<PortfolioItem, "id" | "created_at" | "updated_at">
) {
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
  const content = await getSiteContent();
  content.portfolio = content.portfolio.filter((p) => p.id !== id);
  await writeJson(DATA_FILE, content);
}

export async function getServices(): Promise<ServiceItem[]> {
  return (await getSiteContent()).services;
}

export async function updateServices(services: ServiceItem[]) {
  const content = await getSiteContent();
  content.services = services;
  await writeJson(DATA_FILE, content);
  return services;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return (await getSiteContent()).testimonials;
}

export async function updateTestimonials(testimonials: Testimonial[]) {
  const content = await getSiteContent();
  content.testimonials = testimonials;
  await writeJson(DATA_FILE, content);
  return testimonials;
}

export async function getMessages(): Promise<ContactMessage[]> {
  return readJson<ContactMessage[]>(MESSAGES_FILE, []);
}

export async function addMessage(
  msg: Omit<ContactMessage, "id" | "read" | "created_at">
) {
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
  const messages = await getMessages();
  const index = messages.findIndex((m) => m.id === id);
  if (index === -1) return null;
  messages[index].read = true;
  await writeJson(MESSAGES_FILE, messages);
  return messages[index];
}

export async function deleteMessage(id: string) {
  const messages = (await getMessages()).filter((m) => m.id !== id);
  await writeJson(MESSAGES_FILE, messages);
}
