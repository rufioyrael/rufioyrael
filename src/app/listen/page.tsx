import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

type Mix = {
  slug: string;
  title: string;
  audio_url: string;
  date: string | null;
  tags: string[] | null;
  description: string | null;
  cover_url: string | null;
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export default async function ListenPage() {
  const sb = supabaseAdmin();

  const { data, error } = await sb
    .from("mixes")
    .select("slug,title,audio_url,date,tags,description,cover_url,published")
    .eq("published", true)
    .order("date", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-14">
        <div className="panel p-6">
          <div className="text-sm text-white/70">Failed to load mixes.</div>
          <div className="mt-2 text-xs text-white/50">{error.message}</div>
        </div>
      </main>
    );
  }

  const mixes = (data ?? []) as Mix[];

  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-white/50">Listen</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Mix archive
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
            Published mixes with tracklists + notes. Minimal noise, proper metadata.
          </p>
        </div>
      </div>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mixes.map((m) => (
          <Link
            key={m.slug}
            href={`/listen/${m.slug}`}
            className="group panel overflow-hidden p-0 transition hover:border-white/20 hover:bg-white/5"
          >
            {/* cover */}
            <div className="relative aspect-[16/10] border-b border-white/10 bg-black/30">
              {m.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.cover_url}
                  alt={m.title}
                  className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                />
              ) : (
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-[radial-gradient(600px_220px_at_20%_30%,rgba(225,6,0,0.16),transparent_60%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(520px_240px_at_80%_40%,rgba(255,255,255,0.06),transparent_65%)]" />
                </div>
              )}
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/70 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                {formatDate(m.date) || "Mix"}
              </div>
            </div>

            {/* content */}
            <div className="p-5">
              <div className="text-base font-semibold leading-snug text-white/90">
                {m.title}
              </div>

              {m.description ? (
                <div className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/60">
                  {m.description}
                </div>
              ) : (
                <div className="mt-2 text-sm text-white/45">No description.</div>
              )}

              {Array.isArray(m.tags) && m.tags.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {m.tags.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/65"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-white/45">Open mix</span>
                <span className="text-sm text-white/60 transition group-hover:text-white">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {!mixes.length ? (
        <div className="mt-10 panel p-6 text-sm text-white/70">
          No mixes published yet.
        </div>
      ) : null}
    </main>
  );
}
