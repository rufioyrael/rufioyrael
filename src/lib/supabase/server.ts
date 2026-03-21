import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // no-op for read-only server fetching in pages
        },
      },
    }
  );
}

// Backward-compatible alias for older API routes that still import supabaseServer
export async function supabaseServer() {
  return getSupabaseServerClient();
}