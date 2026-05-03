import { createClient } from "@supabase/supabase-js";

export type Mix = {
  slug: string;
  title: string;
  date: string | null;
  runtime: string | null;
  tags: string[];
  description: string | null;
  tracklist: string[];
  featured: boolean;
  published: boolean;
  audioUrl: string | null;
  coverImageUrl: string | null;
  type: "live-set" | "twitch-stream";
};

type MixRow = {
  slug: string;
  title: string;
  date_label: string | null;
  runtime: string | null;
  tags: string[] | null;
  description: string | null;
  tracklist: unknown;
  featured: boolean | null;
  published: boolean | null;
  audio_url: string | null;
  cover_image_url: string | null;
  type: string | null;
};

function getPublicSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function normalizeTracklist(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeText(value: string | null): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeTags(value: string[] | null): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((tag) => tag.trim()).filter(Boolean);
}

function normalizeUrl(value: string | null): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeType(value: string | null): "live-set" | "twitch-stream" {
  return value === "twitch-stream" ? "twitch-stream" : "live-set";
}

function mapRowToMix(row: MixRow): Mix {
  return {
    slug: row.slug.trim(),
    title: row.title.trim(),
    date: normalizeText(row.date_label),
    runtime: normalizeText(row.runtime),
    tags: normalizeTags(row.tags),
    description: normalizeText(row.description),
    tracklist: normalizeTracklist(row.tracklist),
    featured: row.featured ?? false,
    published: row.published ?? false,
    audioUrl: normalizeUrl(row.audio_url),
    coverImageUrl: normalizeUrl(row.cover_image_url),
    type: normalizeType(row.type),
  };
}

const SELECT_FIELDS =
  "slug, title, date_label, runtime, tags, description, tracklist, featured, published, audio_url, cover_image_url, type, created_at";

export async function getPublishedMixes(): Promise<Mix[]> {
  const supabase = getPublicSupabaseClient();

  const { data, error } = await supabase
    .from("mixes")
    .select(SELECT_FIELDS)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch published mixes:", error.message ?? JSON.stringify(error));
    return [];
  }

  return (data as MixRow[]).map(mapRowToMix);
}

export async function getPublishedMixBySlug(slug: string): Promise<Mix | null> {
  const supabase = getPublicSupabaseClient();

  const { data, error } = await supabase
    .from("mixes")
    .select(SELECT_FIELDS)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error(`Failed to fetch mix for slug "${slug}":`, error.message ?? JSON.stringify(error));
    return null;
  }

  if (!data) return null;

  return mapRowToMix(data as MixRow);
}
