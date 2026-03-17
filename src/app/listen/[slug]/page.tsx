import Link from "next/link";
import { notFound } from "next/navigation";
import { mixes } from "@/lib/mixes";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return mixes.map((mix) => ({
    slug: mix.slug,
  }));
}

export function generateMetadata({ params }: PageProps) {
  return params.then(({ slug }) => {
    const mix = mixes.find((item) => item.slug === slug);

    if (!mix) {
      return {
        title: "Mix Not Found | Rufio Yrael",
      };
    }

    return {
      title: `${mix.title} | Rufio Yrael`,
      description: mix.description,
    };
  });
}

export default async function MixDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const mixIndex = mixes.findIndex((item) => item.slug === slug);

  if (mixIndex === -1) {
    notFound();
  }

  const mix = mixes[mixIndex];
  const previousMix = mixIndex > 0 ? mixes[mixIndex - 1] : null;
  const nextMix = mixIndex < mixes.length - 1 ? mixes[mixIndex + 1] : null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
      {/* TOP LINK */}
      <div>
        <Link
          href="/listen"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/45 transition hover:text-white/70"
        >
          <span>←</span>
          <span>Back to archive</span>
        </Link>
      </div>

      {/* HERO */}
      <section className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-white/45">
            <span>{mix.date}</span>
            <span className="text-white/20">•</span>
            <span>{mix.runtime}</span>
          </div>

          <h1 className="mt-4 text-[2.4rem] font-semibold leading-[1.01] tracking-tight sm:text-[3.5rem]">
            <span className="block text-white">{mix.title}</span>
          </h1>

          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:text-base">
            {mix.description}
          </p>

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

        {/* PLAYER PANEL */}
        <div className="lg:col-span-5">
          <div className="panel p-6 sm:p-7">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
              Playback
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="flex gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                  <div className="h-8 w-8 rounded-full border border-white/10 bg-black/40" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-white">
                    {mix.title}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/45">
                    Rufio Yrael
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    Playback module placeholder for your hosted mix audio.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                  aria-label="Play preview"
                >
                  ▶
                </button>

                <div className="flex-1">
                  <div className="h-2 rounded-full bg-white/[0.06]">
                    <div className="h-2 w-[22%] rounded-full bg-white/[0.22]" />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/40">
                    <span>00:00</span>
                    <span>{mix.runtime}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px] uppercase tracking-[0.18em] text-white/40">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                  Mix
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                  Tracklist
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                  Archive
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/45">
                Live audio integration coming soon
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-5 text-[11px] uppercase tracking-[0.18em] text-white/45">
              Published mix · Tracklist below
            </div>
          </div>
        </div>
      </section>

      {/* TRACKLIST */}
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

      {/* NAVIGATION */}
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
              <div className="mt-1 text-xs text-white/55">
                {previousMix.date} · {previousMix.runtime}
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
              <div className="mt-1 text-xs text-white/55">
                {nextMix.date} · {nextMix.runtime}
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