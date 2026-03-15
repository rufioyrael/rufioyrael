import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
      {/* HERO */}
      <section className="grid gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7">

              <h1 className="text-[2.6rem] font-semibold leading-[1.01] tracking-tight sm:text-[4rem]">
                <span className="block text-white">
                  Process &amp; Steel.
                </span>
                <span className="block text-white/65">
                  Underground sound, carefully built.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-white/70 sm:text-base">
                DJ mixes, tracklists, and live recordings — presented with restraint.
                Minimal interface. Maximum intention.
              </p>

          <div className="mt-10 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/50">
            <span className="rounded-md border border-white/10 bg-black/30 px-3 py-[6px] transition duration-200 hover:border-[var(--accent)] hover:text-white/80">
              melodic techno
            </span>

            <span className="rounded-md border border-white/10 bg-black/30 px-3 py-[6px] transition duration-200 hover:border-[var(--accent)] hover:text-white/80">
              drum &amp; bass
            </span>

            <span className="rounded-md border border-white/10 bg-black/30 px-3 py-[6px] transition duration-200 hover:border-[var(--accent)] hover:text-white/80">
              dark / minimal
            </span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-5">
          <div className="panel p-7 sm:p-8">

            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                Archive
              </div>

              <div className="mt-3 text-xl font-semibold tracking-tight">
                Mixes & recordings
              </div>

              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65">
                Explore the catalog of published mixes, notes, and tracklists.
              </p>
            </div>

            <div className="mt-8 grid gap-3">

              <Link
                href="/listen"
                className="group rounded-xl border border-white/10 bg-black/30 p-4 transition duration-200 hover:border-[var(--accent)] hover:bg-black/40"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium">
                      Browse the archive
                    </div>
                    <div className="mt-1 text-xs text-white/55">
                      Published mixes and sessions
                    </div>
                  </div>

                  <div className="text-sm text-white/55 transition group-hover:translate-x-0.5 group-hover:text-white">
                    →
                  </div>
                </div>
              </Link>

              <Link
                href="/about"
                className="group rounded-xl border border-white/10 bg-black/30 p-4 transition duration-200 hover:border-[var(--accent)] hover:bg-black/40"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium">
                      About Rufio
                    </div>
                    <div className="mt-1 text-xs text-white/55">
                      Intent and influences
                    </div>
                  </div>

                  <div className="text-sm text-white/55 transition group-hover:translate-x-0.5 group-hover:text-white">
                    →
                  </div>
                </div>
              </Link>

              <Link
                href="/contact"
                className="group rounded-xl border border-white/10 bg-black/30 p-4 transition duration-200 hover:border-[var(--accent)] hover:bg-black/40"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium">
                      Bookings / collabs
                    </div>
                    <div className="mt-1 text-xs text-white/55">
                      Reach out directly
                    </div>
                  </div>

                  <div className="text-sm text-white/55 transition group-hover:translate-x-0.5 group-hover:text-white">
                    →
                  </div>
                </div>
              </Link>

            </div>

            <div className="mt-8 border-t border-white/10 pt-5 text-[11px] uppercase tracking-[0.18em] text-white/45">
              Philadelphia · Available for select dates
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER STRIP */}
      <section className="mt-14 sm:mt-20">
        <div className="panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-medium">Start with a mix</div>
            <div className="mt-1 text-xs text-white/60">
              Clean presentation, proper metadata, no noise.
            </div>
          </div>

          <Link
            href="/listen"
            className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] px-5 py-3 text-sm font-medium text-white transition duration-200 hover:border-[var(--accent)] hover:bg-white/[0.10] hover:shadow-[0_0_24px_var(--accentSoft)]"
          >
            Open Listen →
          </Link>
        </div>
      </section>
    </main>
  );
}