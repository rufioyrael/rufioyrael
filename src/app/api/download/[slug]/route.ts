import { NextRequest, NextResponse } from "next/server";
import { getPublishedMixBySlug } from "@/lib/mixes";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const mix = await getPublishedMixBySlug(slug);

  if (!mix || !mix.audioUrl) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const upstream = await fetch(mix.audioUrl);
  if (!upstream.ok) {
    return new NextResponse("Failed to fetch audio", { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "audio/mpeg";
  const safeName = mix.title.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "_");
  const filename = `${safeName}.mp3`;

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
