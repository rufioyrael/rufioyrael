import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function sanitizeSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  if (process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}


export async function POST(req: Request) {

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const adminSecret = process.env.ADMIN_UPLOAD_SECRET!;
    const body = await req.json();

    if (!body?.adminSecret || body.adminSecret !== adminSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const slug = sanitizeSlug(body.slug);
    const title = String(body.title ?? "").trim();
    const audio_url = String(body.audio_url ?? "").trim();

    if (!slug || !title || !audio_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tags =
      Array.isArray(body.tags) ? body.tags.map((t: any) => String(t).trim()).filter(Boolean) : [];

    const payload = {
      slug,
      title,
      audio_url,
      published: body.published ?? true,
      date: body.date ?? new Date().toISOString(),
      cover_url: body.cover_url ?? null,
      tags,
      description: body.description ?? null,
      tracklist: body.tracklist ?? [],
      duration_sec: body.duration_sec ?? null,
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
