import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client } from "@/lib/r2";
import { supabaseServer } from "@/lib/supabase/server";

function sanitizeSlug(input: string) {
  return String(input ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isProd() {
  // Vercel sets VERCEL_ENV; locally it's usually undefined
  return process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
}

function adminApiEnabled() {
  // In prod, keep admin APIs off unless you explicitly enable
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
  // Never expose this endpoint via GET
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
    const bucket = process.env.R2_BUCKET!;
    const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL!;

    const body = await req.json().catch(() => ({}));
    const slug = sanitizeSlug(body?.slug);
    const filename = String(body?.filename ?? "").trim();
    const contentType = String(body?.contentType ?? "").trim();

    if (!slug || !filename || !contentType) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!contentType.startsWith("audio/")) {
      return NextResponse.json({ error: "Invalid contentType" }, { status: 400 });
    }

    const safeName = filename.replace(/[^\w.\-() ]+/g, "_");
    const ext = (safeName.split(".").pop() || "mp3").toLowerCase().replace(/[^a-z0-9]/g, "");
    const finalExt = ext || "mp3";

    const key = `mixes/${slug}/${Date.now()}.${finalExt}`;

    const s3 = r2Client();
    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 * 5 });
    const publicUrl = `${publicBaseUrl.replace(/\/$/, "")}/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
