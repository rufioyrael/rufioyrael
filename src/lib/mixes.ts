import { createClient } from "@supabase/supabase-js";

export type Mix = {
  slug: string;
  title: string;
  date: string;
  runtime: string;
  tags: string[];
  description: string;
  tracklist: string[];
  featured?: boolean;
  published?: boolean;
  audioUrl?: string | null;
  coverImageUrl?: string | null;
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
};

function getPublicSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function normalizeTracklist(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  return [];
}

function mapRowToMix(row: MixRow): Mix {
  return {
    slug: row.slug,
    title: row.title,
    date: row.date_label ?? "",
    runtime: row.runtime ?? "",
    tags: row.tags ?? [],
    description: row.description ?? "",
    tracklist: normalizeTracklist(row.tracklist),
    featured: row.featured ?? false,
    published: row.published ?? false,
    audioUrl: row.audio_url,
    coverImageUrl: row.cover_image_url,
  };
}

export async function getPublishedMixes(): Promise<Mix[]> {
  const supabase = getPublicSupabaseClient();

  const { data, error } = await supabase
    .from("mixes")
    .select(
      "slug, title, date_label, runtime, tags, description, tracklist, featured, published, audio_url, cover_image_url, created_at"
    )
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch published mixes:", error);
    return [];
  }

  return (data as MixRow[]).map(mapRowToMix);
}

export async function getPublishedMixBySlug(slug: string): Promise<Mix | null> {
  const supabase = getPublicSupabaseClient();

  const { data, error } = await supabase
    .from("mixes")
    .select(
      "slug, title, date_label, runtime, tags, description, tracklist, featured, published, audio_url, cover_image_url"
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error(`Failed to fetch mix for slug "${slug}":`, error);
    return null;
  }

  if (!data) return null;

  return mapRowToMix(data as MixRow);
}