import Link from "next/link";

const SONIC_REFS = [
  "Architectural techno",
  "Broken beat structures",
  "Melodic darkness",
  "Sub-bass design",
  "Long-form sequencing",
  "Industrial texture",
];

const GENRES = ["Melodic Techno", "Drum & Bass", "Dark / Minimal"];

const PRESS_QUOTES = [
  { quote: "Placeholder press quote or testimonial. Something brief, specific, and credible goes here.", source: "Publication or source, year" },
  { quote: "Placeholder press quote or testimonial. Something brief, specific, and credible goes here.", source: "Publication or source, year" },
  { quote: "Placeholder press quote or testimonial. Something brief, specific, and credible goes here.", source: "Publication or source, year" },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14 sm:py-20">

      <section className="max-w-3xl">
        <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
          About
        </div>
        <h1 className="mt-4 text-[2.6rem] font-semibold leading-[1.01] tracking-tight sm:text-[4rem]">
          <span className="block text-white">Rufio Yrael.</span>
          <span className="block text-white/60">Process &amp; Steel.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-[15px] leading-relaxed text-white/65 sm:text-base">
          Philadelphia-based DJ and selector. Working at the intersection of melodic
          techno, drum &amp; bass, and dark minimal — focused on structure, pacing,
          and the space between tracks.
        </p>
      </section>

      <section className="mt-14 grid gap-10 sm:mt-16 lg:grid-cols-12 lg:items-start">

        <div className="space-y-10 lg:col-span-7">

          <div>
            <div className="mb-5 text-[11px] uppercase tracking-[0.22em] text-white/45">
              Background
            </div>
            <div className="space-y-4 text-[15px] leading-relaxed text-white/65">
              <p>
                Placeholder — short origin paragraph. Where the project started,
                what scene or city shaped the early sound, and the moment it became
                deliberate rather than casual.
              </p>
              <p>
                Placeholder — second paragraph. How the sound evolved, what drew
                it toward longer-form mixing, and the principle that now guides
                every release: every mix should feel constructed, not assembled.
              </p>
            </div>
          </div>

          <div>
            <div className="mb-5 text-[11px] uppercase tracking-[0.22em] text-white/45">
              Approach
            </div>
            <p className="text-[15px] leading-relaxed text-white/65">
              Placeholder — one focused paragraph on philosophy. Mixes sequenced
              for listening, not for a room. Each release treated as a document —
              properly labeled, tracklisted, presented without decoration. The
              interface disappears so the music doesn't.
            </p>
          </div>

          <div>
            <div className="mb-5 text-[11px] uppercase tracking-[0.22em] text-white/45">
              Sonic references
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {SONIC_REFS.map((ref) => (
                <div
                  key={ref}
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent)/55" />
                  <span className="text-sm text-white/62">{ref}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="lg:col-span-5">
          <div className="panel overflow-hidden">

            <div className="space-y-5 px-6 py-6">
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">
                Info
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.20em] text-white/32">Location</div>
                <div className="mt-1.5 text-sm text-white/75">Philadelphia, PA</div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.20em] text-white/32">Genres</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {GENRES.map((g) => (
                    <span
                      key={g}
                      className="rounded-md border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/50"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.20em] text-white/32">Availability</div>
                <div className="mt-1.5 text-sm text-white/75">
                  Select dates — inquire for schedule
                </div>
              </div>
            </div>

            <div className="h-px bg-white/8" />

            <div className="px-6 py-6">
              <div className="mb-1 text-[11px] uppercase tracking-[0.22em] text-white/38">
                Booking
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Available for club nights, events, and select collaborations.
                Direct inquiries only.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-(--accent)/35 bg-(--accent)/14 px-5 py-2.5 text-sm font-medium text-white transition duration-200 hover:border-(--accent)/55 hover:bg-(--accent)/22"
              >
                Get in touch →
              </Link>
            </div>

          </div>
        </div>

      </section>

      <section className="mt-16 sm:mt-20">
        <div className="mb-5 text-[11px] uppercase tracking-[0.22em] text-white/45">
          Press
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRESS_QUOTES.map(({ quote, source }) => (
            <div key={source} className="panel p-6">
              <p className="text-sm leading-relaxed text-white/55 italic">"{quote}"</p>
              <div className="mt-4 text-[11px] uppercase tracking-[0.18em] text-white/30">
                {source}
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
