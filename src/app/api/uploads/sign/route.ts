import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { supabaseServer } from "@/lib/supabase/server";
import { r2Client, R2_BUCKET, R2_PUBLIC_BASE_URL } from "@/lib/r2";

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

function sanitizeFilename(input: string) {
  return String(input ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-");
}

function getExtension(filename: string) {
  const parts = filename.split(".");
  if (parts.length < 2) return "";
  return parts[parts.length - 1].toLowerCase();
}

type SignBody = {
  slug?: string;
  filename?: string;
  contentType?: string;
  kind?: "audio" | "cover";
};

export async function POST(req: Request) {
  try {
    const supabase = await supabaseServer();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAllowedAdmin(user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await req.json()) as SignBody;

    const slug = sanitizeSlug(body.slug ?? "");
    const filename = String(body.filename ?? "").trim();
    const contentType = String(body.contentType ?? "").trim();
    const kind = body.kind ?? "audio";

    if (!slug) {
      return NextResponse.json({ error: "Missing slug." }, { status: 400 });
    }

    if (!filename) {
      return NextResponse.json({ error: "Missing filename." }, { status: 400 });
    }

    const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/wav", "audio/flac", "audio/aac", "audio/mp4", "audio/ogg", "audio/x-wav"];
    const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const ALLOWED_AUDIO_EXTS  = ["mp3", "wav", "flac", "aac", "m4a", "ogg"];
    const ALLOWED_IMAGE_EXTS  = ["jpg", "jpeg", "png", "webp", "gif"];

    if (kind === "audio" && !ALLOWED_AUDIO_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: "Only audio uploads are allowed for audio kind." },
        { status: 400 }
      );
    }

    if (kind === "cover" && !ALLOWED_IMAGE_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: "Only image uploads are allowed for cover kind." },
        { status: 400 }
      );
    }

    const ext = getExtension(filename);
    const allowedExts = kind === "cover" ? ALLOWED_IMAGE_EXTS : ALLOWED_AUDIO_EXTS;
    if (ext && !allowedExts.includes(ext)) {
      return NextResponse.json({ error: "File extension not allowed." }, { status: 400 });
    }

    const safeFilename = sanitizeFilename(filename);

    const folder = kind === "cover" ? "covers" : "mixes";
    const fallbackExt = kind === "cover" ? "jpg" : "mp3";

    // Keep uploaded assets grouped by slug so replacing or inspecting files in
    // storage later stays predictable from the CMS side.
    const key = ext
      ? `${folder}/${slug}/${Date.now()}-${safeFilename}`
      : `${folder}/${slug}/${Date.now()}-${safeFilename}.${fallbackExt}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 60 });
    const publicUrl = `${R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`;

    return NextResponse.json({
      ok: true,
      key,
      uploadUrl,
      publicUrl,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to sign upload.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
