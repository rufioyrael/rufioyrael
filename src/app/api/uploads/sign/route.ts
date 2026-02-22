import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client } from "@/lib/r2";

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
    const bucket = process.env.R2_BUCKET!;
    const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL!;

    const body = await req.json();
    const { slug, filename, contentType, adminSecret: providedSecret } = body ?? {};

    if (!providedSecret || providedSecret !== adminSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!slug || !filename || !contentType) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const safeSlug = sanitizeSlug(slug);
    const safeName = String(filename).replace(/[^\w.\-() ]+/g, "_");
    const ext = safeName.includes(".") ? safeName.split(".").pop() : "mp3";

    // keep uploads organized
    const key = `mixes/${safeSlug}/${Date.now()}.${ext}`;

    const s3 = r2Client();

    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      // Public streaming should be handled via bucket public access + custom domain.
      // Do NOT rely on ACLs here; R2 doesn’t behave exactly like AWS for ACLs.
    });

    const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 * 5 }); // 5 minutes
    const publicUrl = `${publicBaseUrl.replace(/\/$/, "")}/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
