import Link from "next/link";

type Mix = {
  slug: string;
  title: string;
  date: string;
  runtime: string;
  tags: string[];
  note: string;
  featured?: boolean;
};

const mixes: Mix[] = [
  {
    slug: "process-steel-001",
    title: "Process / Steel 001",
    date: "March 2026",
    runtime: "58 min",
    tags: ["melodic techno", "dark", "driving"],
    note: "A late-night session built around tension, movement, and long-form transitions.",
    featured: true,
  },
  {
    slug: "ember-line-session",
    title: "Ember Line Session",
    date: "February 2026",
    runtime: "47 min",
    tags: ["drum & bass", "atmospheric"],
    note: "Fast, clean selections with darker low-end and restrained pacing.",
  },
  {
    slug: "after-hours-study",
    title: "After Hours Study",
    date: "January 2026",
    runtime: "62 min",
    tags: ["minimal", "hypnotic"],
    note: "A slower and more patient mix focused on texture and long transitions.",
  },
  {
    slug: "warehouse-notes-002",
    title: "Warehouse Notes 002",
    date: "December 2025",
    runtime: "54 min",
    tags: ["melodic techno", "industrial"],
    note: "Percussive framework, darker melodic phrasing, and a heavier closing stretch.",
  },
];

const featuredMix = mixes.find((mix) => mix.featured);
const archiveMixes = mixes.filter((mix) => !mix.featured);

export default function ListenPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
      {/* PAGE HEADER */}
      <section className="max-w-3xl">
        <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
          Archive
        </div>

        <h1 className="mt-4 text-[2.6rem] font-semibold leading-[1.01] tracking-tight sm:text-[4rem]">
          <span className="block text-white">Listen.</span>
          <span className="block text-white/65">
            Mixes, recordings, and selected sessions.
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:text-base">
          A curated archive of published mixes and live recordings. Built for
          clarity, pacing, and careful track selection.
        </p>
      </section>

      {/* FEATURED */}
      {featuredMix ? (
        <section className="mt-14 sm:mt-16">
          <div className="mb-5 text-[11px] uppercase tracking-[0.22em] text-white/45">
            Latest
          </div>

          <Link
            href={`/listen/${featuredMix.slug}`}
            className="group block rounded-3xl border border-white/10 bg-black/30 p-6 transition duration-200 hover:border-[var(--accent)] hover:bg-black/40 hover:shadow-[0_0_24px_rgba(225,6,0,0.16)] sm:p-8"
          >
            <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-white/45">
                  <span>{featuredMix.date}</span>
                  <span className="text-white/20">•</span>
                  <span>{featuredMix.runtime}</span>
                </div>

                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {featuredMix.title}
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-[15px]">
                  {featuredMix.note}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/50">
                  {featuredMix.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/10 bg-black/30 px-3 py-[6px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 lg:flex lg:justify-end">
                <div className="flex h-full min-h-[160px] w-full items-end justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:max-w-[240px]">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                      Open
                    </div>
                    <div className="mt-2 text-sm text-white/70">
                      Mix page / tracklist
                    </div>
                  </div>

                  <div className="text-lg text-white/55 transition group-hover:translate-x-1 group-hover:text-white">
                    →
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      ) : null}

      {/* ARCHIVE LIST */}
      <section className="mt-16 sm:mt-20">
        <div className="mb-5 text-[11px] uppercase tracking-[0.22em] text-white/45">
          Archive entries
        </div>

        <div className="grid gap-3">
          {archiveMixes.map((mix) => (
            <Link
              key={mix.slug}
              href={`/listen/${mix.slug}`}
              className="group rounded-2xl border border-white/10 bg-black/30 p-5 transition duration-200 hover:border-[var(--accent)] hover:bg-black/40"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-white/45">
                    <span>{mix.date}</span>
                    <span className="text-white/20">•</span>
                    <span>{mix.runtime}</span>
                  </div>

                  <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">
                    {mix.title}
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">
                    {mix.note}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/50">
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

                <div className="flex items-center gap-3 text-sm text-white/55 transition group-hover:text-white md:pl-6">
                  <span className="uppercase tracking-[0.18em] text-[11px] text-white/40">
                    Open
                  </span>
                  <span className="transition group-hover:translate-x-0.5">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}