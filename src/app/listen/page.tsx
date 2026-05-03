import Image from "next/image";
import Link from "next/link";
import { getPublishedMixes, type Mix } from "@/lib/mixes";

// ── Shared card components ─────────────────────────────────────────────────

function FeaturedCard({ mix }: { mix: Mix }) {
  const meta = [mix.date, mix.runtime].filter(Boolean);

  return (
    <Link
      href={`/listen/${mix.slug}`}
      className="group relative block overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 p-6 transition duration-300 hover:border-[var(--accent)] hover:bg-black/50 hover:shadow-[0_0_32px_rgba(225,6,0,0.14)] sm:p-7 lg:p-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
        <div className="absolute -right-16 top-8 h-36 w-36 rounded-full bg-[var(--accent)]/12 blur-3xl transition duration-300 group-hover:bg-[var(--accent)]/18" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_32%,transparent_65%,rgba(225,6,0,0.08))]" />
      </div>

      <div className="relative mb-3 flex justify-start lg:mb-0 lg:justify-end">
        <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-white/45">
          <span className="rounded-full border border-[var(--accent)]/25 bg-[var(--accent)]/10 px-3 py-1 text-white/78">
            Featured
          </span>
          {meta.map((part, index) => (
            <div key={`${part}-${index}`} className="flex items-center gap-3">
              {index > 0 ? <span className="text-white/20">•</span> : null}
              <span>{part}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative grid gap-6 lg:grid-cols-12 lg:items-start">
        <div className={mix.coverImageUrl ? "lg:col-span-7" : "lg:col-span-12"}>
          <h2 className="max-w-3xl text-[2rem] font-semibold leading-[0.98] tracking-tight text-white sm:text-[3rem] lg:pt-[2px]">
            {mix.title}
          </h2>

          {mix.description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-[15px]">
              {mix.description}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/50">
            {mix.tags.map((tag) => (
              <span key={tag} className="rounded-md border border-white/10 bg-black/30 px-3 py-[6px]">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/38">Runtime</div>
              <div className="mt-2 text-sm text-white/82">{mix.runtime || "Unlisted"}</div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/38">Track count</div>
              <div className="mt-2 text-sm text-white/82">{mix.tracklist.length || "TBA"}</div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/38">Archive</div>
              <div className="mt-2 text-sm text-white/82">Highlighted release</div>
            </div>
          </div>
        </div>

        {mix.coverImageUrl ? (
          <div className="lg:col-span-5 lg:flex lg:justify-end">
            <div className="relative w-full max-w-[340px] lg:max-w-[360px]">
              <div className="absolute inset-x-8 bottom-0 top-8 rounded-full bg-[var(--accent)]/14 blur-3xl transition duration-300 group-hover:bg-[var(--accent)]/18" />
              <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.34)]">
                <div className="overflow-hidden rounded-[1.1rem] border border-white/8 bg-black/40">
                  <Image
                    src={mix.coverImageUrl}
                    alt={`${mix.title} cover`}
                    width={720}
                    height={720}
                    unoptimized
                    className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between px-1 text-[10px] uppercase tracking-[0.22em] text-white/40">
                  <span>Archive select</span>
                  <span>{mix.date}</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Link>
  );
}

function ArchiveRow({ mix }: { mix: Mix }) {
  return (
    <Link
      href={`/listen/${mix.slug}`}
      className="group rounded-2xl border border-white/10 bg-black/30 p-5 transition duration-200 hover:border-[var(--accent)] hover:bg-black/40"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 gap-4">
          {mix.coverImageUrl ? (
            <div className="hidden sm:block">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                <Image
                  src={mix.coverImageUrl}
                  alt={`${mix.title} cover`}
                  width={160}
                  height={160}
                  unoptimized
                  className="h-20 w-20 object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
            </div>
          ) : null}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-white/45">
              {[mix.date, mix.runtime].filter(Boolean).map((part, index) => (
                <div key={`${mix.slug}-${part}-${index}`} className="flex items-center gap-3">
                  {index > 0 ? <span className="text-white/20">•</span> : null}
                  <span>{part}</span>
                </div>
              ))}
            </div>

            <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">{mix.title}</h3>

            {mix.description ? (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">{mix.description}</p>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/50">
              {mix.tags.map((tag) => (
                <span key={tag} className="rounded-md border border-white/10 bg-black/30 px-3 py-[6px]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-white/55 transition group-hover:text-white md:pl-6">
          <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">Open</span>
          <span className="transition group-hover:translate-x-0.5">→</span>
        </div>
      </div>
    </Link>
  );
}

function Section({
  heading,
  subheading,
  featured,
  archive,
}: {
  heading: string;
  subheading: string;
  featured: Mix | null;
  archive: Mix[];
}) {
  if (!featured && archive.length === 0) return null;

  return (
    <section className="mt-16 sm:mt-20">
      <div className="mb-8 border-t border-white/10 pt-6">
        <h2 className="text-[1.6rem] font-semibold tracking-tight text-white sm:text-[2rem]">
          {heading}
        </h2>
        <p className="mt-2 text-sm text-white/50">{subheading}</p>
      </div>

      {featured ? (
        <div>
          <div className="mb-5 text-[11px] uppercase tracking-[0.22em] text-white/45">
            Featured release
          </div>
          <FeaturedCard mix={featured} />
        </div>
      ) : null}

      {archive.length > 0 ? (
        <div className={featured ? "mt-12" : ""}>
          <div className="mb-5 flex items-end justify-between border-t border-white/10 pt-6">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
              Archive entries
            </div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/35">
              {archive.length} {archive.length === 1 ? "entry" : "entries"}
            </div>
          </div>
          <div className="grid gap-3">
            {archive.map((mix) => (
              <ArchiveRow key={mix.slug} mix={mix} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function ListenPage() {
  const mixes = await getPublishedMixes();

  const liveSets = mixes.filter((m) => m.type === "live-set");
  const twitchStreams = mixes.filter((m) => m.type === "twitch-stream");

  const lsFeatured = liveSets.find((m) => m.featured) ?? liveSets[0] ?? null;
  const lsArchive = lsFeatured ? liveSets.filter((m) => m.slug !== lsFeatured.slug) : liveSets;

  const tsFeatured = twitchStreams.find((m) => m.featured) ?? twitchStreams[0] ?? null;
  const tsArchive = tsFeatured ? twitchStreams.filter((m) => m.slug !== tsFeatured.slug) : twitchStreams;

  return (
    <main className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
      <section className="max-w-3xl">
        <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">Archive</div>
        <h1 className="mt-4 text-[2.6rem] font-semibold leading-[1.01] tracking-tight sm:text-[4rem]">
          <span className="block text-white">Listen.</span>
          <span className="block text-white/65">Mixes, recordings, and selected sessions.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:text-base">
          The full archive. Unedited.
        </p>
      </section>

      <Section
        heading="Live Sets"
        subheading="Parties, raves, and club nights. Recorded as played."
        featured={lsFeatured}
        archive={lsArchive}
      />

      <Section
        heading="Twitch Streams"
        subheading="Monthly live sessions. Top 100 tracks in a chosen genre, mixed in real time."
        featured={tsFeatured}
        archive={tsArchive}
      />
    </main>
  );
}
