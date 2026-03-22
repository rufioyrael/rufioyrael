import Link from "next/link";
import { notFound } from "next/navigation";
import MixPlaybackPanel from "@/components/MixPlaybackPanel";
import {
  getPublishedMixBySlug,
  getPublishedMixes,
} from "@/lib/mixes";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const mixes = await getPublishedMixes();

  return mixes.map((mix) => ({
    slug: mix.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const mix = await getPublishedMixBySlug(slug);

  if (!mix) {
    return {
      title: "Mix Not Found | Rufio Yrael",
    };
  }

  return {
    title: `${mix.title} | Rufio Yrael`,
    description: mix.description ?? undefined,
  };
}

export default async function MixDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const mix = await getPublishedMixBySlug(slug);

  if (!mix) {
    notFound();
  }

  const mixes = await getPublishedMixes();
  const mixIndex = mixes.findIndex((item) => item.slug === slug);
  const trackCount = mix.tracklist.length;
  const detailMeta = [mix.date, mix.runtime].filter(Boolean);

  const previousMix = mixIndex > 0 ? mixes[mixIndex - 1] : null;
  const nextMix = mixIndex < mixes.length - 1 ? mixes[mixIndex + 1] : null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
      <div>
        <Link
          href="/listen"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/45 transition hover:text-white/70"
        >
          <span>←</span>
          <span>Back to archive</span>
        </Link>
      </div>

      <section className="mt-8">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-white/45">
            {detailMeta.map((part, index) => (
              <div key={`${part}-${index}`} className="flex items-center gap-3">
                {index > 0 ? <span className="text-white/20">•</span> : null}
                <span>{part}</span>
              </div>
            ))}
          </div>

          <h1 className="mt-4 text-[2.4rem] font-semibold leading-[1.01] tracking-tight sm:text-[3.5rem]">
            <span className="block text-white">{mix.title}</span>
          </h1>

          {mix.description ? (
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:text-base">
              {mix.description}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/50">
            {mix.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/10 bg-black/30 px-3 py-[6px]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 sm:mt-12">
        <div className="mx-auto max-w-5xl">
          {mix.audioUrl ? (
            <MixPlaybackPanel
              src={mix.audioUrl}
              title={mix.title}
              coverImageUrl={mix.coverImageUrl}
              runtime={mix.runtime ?? undefined}
            />
          ) : (
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-5 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.30)] sm:px-6 sm:py-5">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-[var(--accent)]/10 blur-3xl" />
              </div>

              <div className="relative">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.25rem] border border-white/10 bg-black/35 sm:h-24 sm:w-24">
                    <div className="h-8 w-8 rounded-full border border-white/10 bg-white/[0.04]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-base font-semibold tracking-tight text-white sm:text-[1.2rem]">
                      {mix.title}
                    </div>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
                      This archive entry is published, but hosted audio has not
                      been attached yet.
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-white/8 bg-[#131317] px-3 py-3">
                  <div className="h-2 rounded-full bg-[#232329]">
                    <div className="h-2 w-[22%] rounded-full bg-[rgba(164,44,36,0.72)]" />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/40">
                    <span>Awaiting audio</span>
                    <span>{mix.runtime || "Unlisted"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-white/10 pt-5 text-center text-[11px] uppercase tracking-[0.18em] text-white/45">
            Published mix · {trackCount} tracks in sequence
          </div>
        </div>
      </section>

      <section className="mt-16 sm:mt-20">
        <div className="mb-5 text-[11px] uppercase tracking-[0.22em] text-white/45">
          Tracklist
        </div>

        <div className="panel p-6 sm:p-7">
          <ol className="grid gap-3">
            {mix.tracklist.map((track, index) => (
              <li
                key={`${mix.slug}-${index}`}
                className="flex items-start gap-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
              >
                <span className="mt-[1px] w-8 shrink-0 text-[11px] uppercase tracking-[0.18em] text-white/35">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-relaxed text-white/75">
                  {track}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-14 sm:mt-16">
        <div className="grid gap-3 sm:grid-cols-2">
          {previousMix ? (
            <Link
              href={`/listen/${previousMix.slug}`}
              className="group rounded-2xl border border-white/10 bg-black/30 p-5 transition duration-200 hover:border-[var(--accent)] hover:bg-black/40"
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                Previous
              </div>
              <div className="mt-2 text-sm font-medium text-white">
                {previousMix.title}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/55">
                {[previousMix.date, previousMix.runtime]
                  .filter(Boolean)
                  .map((part, index) => (
                    <div
                      key={`${previousMix.slug}-${part}-${index}`}
                      className="flex items-center gap-2"
                    >
                      {index > 0 ? <span className="text-white/25">•</span> : null}
                      <span>{part}</span>
                    </div>
                  ))}
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-white/30">
              <div className="text-[11px] uppercase tracking-[0.18em]">
                Previous
              </div>
              <div className="mt-2 text-sm">No earlier entry</div>
            </div>
          )}

          {nextMix ? (
            <Link
              href={`/listen/${nextMix.slug}`}
              className="group rounded-2xl border border-white/10 bg-black/30 p-5 transition duration-200 hover:border-[var(--accent)] hover:bg-black/40 sm:text-right"
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                Next
              </div>
              <div className="mt-2 text-sm font-medium text-white">
                {nextMix.title}
              </div>
              <div className="mt-1 flex flex-wrap items-center justify-end gap-2 text-xs text-white/55">
                {[nextMix.date, nextMix.runtime]
                  .filter(Boolean)
                  .map((part, index) => (
                    <div
                      key={`${nextMix.slug}-${part}-${index}`}
                      className="flex items-center gap-2"
                    >
                      {index > 0 ? <span className="text-white/25">•</span> : null}
                      <span>{part}</span>
                    </div>
                  ))}
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-white/30 sm:text-right">
              <div className="text-[11px] uppercase tracking-[0.18em]">
                Next
              </div>
              <div className="mt-2 text-sm">No later entry</div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
