import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
      {/* HERO */}
      <section className="grid gap-10 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7">
          <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
            Process &amp; Steel.
            <span className="block text-white/70">
              Underground sound, carefully built.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
            DJ mixes, tracklists, and live recordings — presented with restraint.
            Minimal interface. Maximum intention.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3 text-xs text-white/50">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 transition duration-200 hover:border-[var(--accent)] hover:bg-white/[0.07] hover:text-white/80">
              melodic techno
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 transition duration-200 hover:border-[var(--accent)] hover:bg-white/[0.07] hover:text-white/80">
              drum &amp; bass
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 transition duration-200 hover:border-[var(--accent)] hover:bg-white/[0.07] hover:text-white/80">
              dark / minimal
            </span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-5">
          <div className="panel p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-white/50">
                  Latest
                </div>
                <div className="mt-2 text-lg font-semibold">
                  New mixes &amp; recordings
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  Head to the Listen page for the full archive. Tracklists included.
                </p>
              </div>

              <div className="hidden sm:block">
                <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5" />
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <Link
                href="/listen"
                className="group rounded-2xl border border-white/10 bg-black/30 p-4 transition duration-200 hover:border-[var(--accent)] hover:bg-black/40 hover:shadow-[0_0_20px_rgba(225,6,0,0.18)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium">Browse the archive</div>
                    <div className="mt-1 text-xs text-white/55">
                      Published mixes, tags, and notes
                    </div>
                  </div>
                  <div className="text-sm text-white/60 transition group-hover:translate-x-0.5 group-hover:text-white">
                    →
                  </div>
                </div>
              </Link>

              <Link
                href="/about"
                className="group rounded-2xl border border-white/10 bg-black/30 p-4 transition duration-200 hover:border-[var(--accent)] hover:bg-black/40 hover:shadow-[0_0_20px_rgba(225,6,0,0.18)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium">About Rufio</div>
                    <div className="mt-1 text-xs text-white/55">
                      Intent, sound design, influences
                    </div>
                  </div>
                  <div className="text-sm text-white/60 transition group-hover:translate-x-0.5 group-hover:text-white">
                    →
                  </div>
                </div>
              </Link>

              <Link
                href="/contact"
                className="group rounded-2xl border border-white/10 bg-black/30 p-4 transition duration-200 hover:border-[var(--accent)] hover:bg-black/40 hover:shadow-[0_0_20px_rgba(225,6,0,0.18)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium">Bookings / collabs</div>
                    <div className="mt-1 text-xs text-white/55">
                      Reach out directly
                    </div>
                  </div>
                  <div className="text-sm text-white/60 transition group-hover:translate-x-0.5 group-hover:text-white">
                    →
                  </div>
                </div>
              </Link>
            </div>

            <div className="mt-6 border-t border-white/10 pt-5 text-xs text-white/50">
              <span className="text-white/60">Philadelphia</span> • Available for select dates
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
            className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] px-5 py-3 text-sm font-medium text-white transition duration-200 hover:border-[var(--accent)] hover:bg-white/10 hover:shadow-[0_0_24px_var(--accentSoft)]"
          >
            Open Listen →
          </Link>
        </div>
      </section>
    </main>
  );
}