import Link from "next/link";
import { supabaseAnon } from "@/lib/supabase";
import type { Mix } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ListenPage() {
  const sb = supabaseAnon();
  const { data, error } = await sb
    .from("mixes")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false });

  const mixes = (data ?? []) as Mix[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Listen</h1>
        <p className="mt-1 text-white/60">Latest mixes and drops.</p>
      </div>


      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          Failed to load mixes: {error.message}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mixes.map((m) => (
          <Link
            key={m.id}
            href={`/listen/${m.slug}`}
            className="group rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/20"
          >
            <div className="text-xs uppercase tracking-widest text-white/60">
              {new Date(m.date).toLocaleDateString()}
            </div>
            <div className="mt-2 text-lg text-white/90 group-hover:text-white">{m.title}</div>
            {m.tags?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {m.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-black/30 px-2 py-1 text-xs text-white/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </Link>
        ))}
      </div>

      {mixes.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
          No mixes yet. Use the Admin Upload link to add your first one.
        </div>
      ) : null}
    </div>
  );
}
