import { NextResponse } from "next/server";

export async function GET() {
  // Block health endpoint in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ok =
    !!process.env.R2_ACCOUNT_ID &&
    !!process.env.R2_ACCESS_KEY_ID &&
    !!process.env.R2_SECRET_ACCESS_KEY &&
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  return NextResponse.json({
    ok,
    hasR2: !!process.env.R2_ACCOUNT_ID,
    hasSupabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  });
}
