import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

function getAllowedAdmins() {
  return (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function isAllowedAdmin(userId: string) {
  return getAllowedAdmins().includes(userId);
}

function sanitizeSlug(input: string) {
  return String(input ?? "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateMixType(value: unknown): "live-set" | "twitch-stream" | null {
  if (value === "live-set" || value === "twitch-stream") return value;
  return null;
}

type CreateMixBody = {
  id?: string;
  slug?: string;
  title?: string;
  dateLabel?: string;
  runtime?: string;
  description?: string;
  tags?: string[];
  tracklist?: string[];
  featured?: boolean;
  published?: boolean;
  audioUrl?: string | null;
  coverImageUrl?: string | null;
  type?: string;
};

async function requireAdmin() {
  const supabase = await supabaseServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (!isAllowedAdmin(user.id)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { user };
}

const ADMIN_SELECT =
  "id, slug, title, date_label, runtime, description, tags, tracklist, published, featured, audio_url, cover_image_url, type, created_at";

export async function GET() {
  try {
    const auth = await requireAdmin();
    if ("error" in auth) return auth.error;

    const admin = getSupabaseAdminClient();

    const { data, error } = await admin
      .from("mixes")
      .select(ADMIN_SELECT)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, mixes: data ?? [] });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch mixes.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin();
    if ("error" in auth) return auth.error;

    const body = (await req.json()) as CreateMixBody;

    const title = String(body.title ?? "").trim();
    const slug = sanitizeSlug(body.slug ?? title);
    const dateLabel = String(body.dateLabel ?? "").trim();
    const runtime = String(body.runtime ?? "").trim();
    const description = String(body.description ?? "").trim();
    const mixType = validateMixType(body.type);

    const audioUrl =
      body.audioUrl && String(body.audioUrl).trim()
        ? String(body.audioUrl).trim()
        : null;

    const coverImageUrl =
      body.coverImageUrl && String(body.coverImageUrl).trim()
        ? String(body.coverImageUrl).trim()
        : null;

    const tags = Array.isArray(body.tags)
      ? body.tags.map((tag) => String(tag).trim()).filter(Boolean)
      : [];

    const tracklist = Array.isArray(body.tracklist)
      ? body.tracklist.map((item) => String(item).trim()).filter(Boolean)
      : [];

    const featured = Boolean(body.featured);
    const published = Boolean(body.published);

    if (!title) return NextResponse.json({ error: "Missing title." }, { status: 400 });
    if (!slug) return NextResponse.json({ error: "Missing slug." }, { status: 400 });
    if (!dateLabel) return NextResponse.json({ error: "Missing date." }, { status: 400 });
    if (!runtime) return NextResponse.json({ error: "Missing runtime." }, { status: 400 });
    if (!description) return NextResponse.json({ error: "Missing description." }, { status: 400 });
    if (!mixType) return NextResponse.json({ error: "Missing type — select Live Set or Twitch Stream." }, { status: 400 });

    const admin = getSupabaseAdminClient();

    const { data, error } = await admin
      .from("mixes")
      .insert({
        slug,
        title,
        date_label: dateLabel,
        runtime,
        description,
        tags,
        tracklist,
        featured,
        published,
        audio_url: audioUrl,
        cover_image_url: coverImageUrl,
        type: mixType,
      })
      .select("id, slug, title, published, featured, audio_url, cover_image_url, type")
      .single();

    if (error) {
      const message =
        error.code === "23505"
          ? "A mix with that slug already exists."
          : error.message;
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, mix: data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create mix.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await requireAdmin();
    if ("error" in auth) return auth.error;

    const body = (await req.json()) as { id?: string };
    const id = String(body.id ?? "").trim();

    if (!id) return NextResponse.json({ error: "Missing mix id." }, { status: 400 });

    const admin = getSupabaseAdminClient();

    const { error } = await admin.from("mixes").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete mix.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireAdmin();
    if ("error" in auth) return auth.error;

    const body = (await req.json()) as CreateMixBody;
    const id = String(body.id ?? "").trim();
    const title = String(body.title ?? "").trim();
    const slug = sanitizeSlug(body.slug ?? title);
    const dateLabel = String(body.dateLabel ?? "").trim();
    const runtime = String(body.runtime ?? "").trim();
    const description = String(body.description ?? "").trim();
    const mixType = validateMixType(body.type);

    const audioUrl =
      body.audioUrl && String(body.audioUrl).trim()
        ? String(body.audioUrl).trim()
        : null;

    const coverImageUrl =
      body.coverImageUrl && String(body.coverImageUrl).trim()
        ? String(body.coverImageUrl).trim()
        : null;

    const tags = Array.isArray(body.tags)
      ? body.tags.map((tag) => String(tag).trim()).filter(Boolean)
      : [];

    const tracklist = Array.isArray(body.tracklist)
      ? body.tracklist.map((item) => String(item).trim()).filter(Boolean)
      : [];

    const featured = Boolean(body.featured);
    const published = Boolean(body.published);

    if (!id) return NextResponse.json({ error: "Missing mix id." }, { status: 400 });
    if (!title) return NextResponse.json({ error: "Missing title." }, { status: 400 });
    if (!slug) return NextResponse.json({ error: "Missing slug." }, { status: 400 });
    if (!dateLabel) return NextResponse.json({ error: "Missing date." }, { status: 400 });
    if (!runtime) return NextResponse.json({ error: "Missing runtime." }, { status: 400 });
    if (!description) return NextResponse.json({ error: "Missing description." }, { status: 400 });
    if (!mixType) return NextResponse.json({ error: "Missing type — select Live Set or Twitch Stream." }, { status: 400 });

    const admin = getSupabaseAdminClient();

    const { data, error } = await admin
      .from("mixes")
      .update({
        slug,
        title,
        date_label: dateLabel,
        runtime,
        description,
        tags,
        tracklist,
        featured,
        published,
        audio_url: audioUrl,
        cover_image_url: coverImageUrl,
        type: mixType,
      })
      .eq("id", id)
      .select("id, slug, title, published, featured, audio_url, cover_image_url, type")
      .single();

    if (error) {
      const message =
        error.code === "23505"
          ? "A mix with that slug already exists."
          : error.message;
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, mix: data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update mix.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
