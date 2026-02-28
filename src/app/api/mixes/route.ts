import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { supabaseServer } from "@/lib/supabase/server";

function sanitizeSlug(input: string) {
  return String(input ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isProd() {
  return process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
}

function adminApiEnabled() {
  if (!isProd()) return true;
  return process.env.ADMIN_API_ENABLED === "true";
}

function isAllowedAdmin(userId: string | undefined) {
  if (!userId) return false;
  const allow = (process.env.ADMIN_USER_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return allow.includes(userId);
}

async function requireAdmin() {
  const supabase = supabaseServer();
  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;

  if (error || !user || !isAllowedAdmin(user.id)) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { ok: true as const, user };
}

export async function GET() {
  // If you want this to serve public mixes later, implement it explicitly.
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(req: Request) {
  // Optional prod gate
  if (!adminApiEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // ✅ Auth check (cookie-based)
  const admin = await requireAdmin();
  if (!admin.ok) return admin.res;

  try {
    const body = await req.json().catch(() => ({}));

    const slug = sanitizeSlug(body?.slug);
    const title = String(body?.title ?? "").trim();
    const audio_url = String(body?.audio_url ?? "").trim();

    if (!slug || !title || !audio_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tags = Array.isArray(body?.tags)
      ? body.tags.map((t: any) => String(t).trim()).filter(Boolean)
      : [];

    const payload = {
      slug,
      title,
      audio_url,
      published: body?.published ?? true,
      date: body?.date ?? new Date().toISOString(),
      cover_url: body?.cover_url ?? null,
      tags,
      description: body?.description ?? null,
      tracklist: Array.isArray(body?.tracklist) ? body.tracklist : [],
      duration_sec: body?.duration_sec ?? null,
    };

    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("mixes")
      .upsert(payload, { onConflict: "slug" })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.details ?? null,
          hint: error.hint ?? null,
          code: error.code ?? null,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ mix: data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
