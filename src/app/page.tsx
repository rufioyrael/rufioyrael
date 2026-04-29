import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
      <section className="grid gap-10 lg:grid-cols-12 lg:items-center">

        {/* LEFT — identity + CTAs */}
        <div className="lg:col-span-7 lg:pr-8">

          <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">
            Philadelphia · Underground Electronic
          </div>

          <h1 className="mt-5 text-[2.6rem] font-semibold leading-[1.01] tracking-tight sm:text-[4rem]">
            <span className="block text-white">Process &amp; Steel.</span>
            <span className="block text-white/60">Underground sound, carefully built.</span>
          </h1>

          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-white/65 sm:text-base">
            DJ mixes, tracklists, and live recordings — presented with restraint.
            Minimal interface. Maximum intention.
          </p>

          {/* Genre labels — decorative, not interactive */}
          <div className="mt-7 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
            <span className="rounded-md border border-white/10 bg-black/30 px-3 py-1.5">
              melodic techno
            </span>
            <span className="rounded-md border border-white/10 bg-black/30 px-3 py-1.5">
              drum &amp; bass
            </span>
            <span className="rounded-md border border-white/10 bg-black/30 px-3 py-1.5">
              dark / minimal
            </span>
          </div>

          {/* Primary + secondary CTA */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/listen"
              className="inline-flex items-center gap-2 rounded-2xl border border-(--accent)/35 bg-(--accent)/14 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:border-(--accent)/55 hover:bg-(--accent)/22 hover:shadow-[0_0_28px_rgba(225,6,0,0.18)]"
            >
              Open Archive <span aria-hidden>→</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/4 px-6 py-3 text-sm font-medium text-white/75 transition duration-200 hover:border-white/22 hover:text-white"
            >
              Bookings / Collabs
            </Link>
          </div>

        </div>

        {/* RIGHT — quick nav panel */}
        <div className="lg:col-span-5">
          <div className="panel overflow-hidden">

            <Link
              href="/listen"
              className="group flex items-center justify-between px-6 py-5 transition duration-150 hover:bg-white/3"
            >
              <div>
                <div className="text-sm font-medium text-white">Archive</div>
                <div className="mt-0.5 text-xs text-white/48">Mixes, sessions &amp; recordings</div>
              </div>
              <span className="text-white/35 transition duration-150 group-hover:translate-x-0.5 group-hover:text-white/65">→</span>
            </Link>

            <div className="h-px bg-white/8" />

            <Link
              href="/about"
              className="group flex items-center justify-between px-6 py-5 transition duration-150 hover:bg-white/3"
            >
              <div>
                <div className="text-sm font-medium text-white">About</div>
                <div className="mt-0.5 text-xs text-white/48">Intent and influences</div>
              </div>
              <span className="text-white/35 transition duration-150 group-hover:translate-x-0.5 group-hover:text-white/65">→</span>
            </Link>

            <div className="h-px bg-white/8" />

            <Link
              href="/contact"
              className="group flex items-center justify-between px-6 py-5 transition duration-150 hover:bg-white/3"
            >
              <div>
                <div className="text-sm font-medium text-white">Contact</div>
                <div className="mt-0.5 text-xs text-white/48">Bookings and collabs</div>
              </div>
              <span className="text-white/35 transition duration-150 group-hover:translate-x-0.5 group-hover:text-white/65">→</span>
            </Link>

            <div className="h-px bg-white/8" />

            <div className="px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-white/28">
              Philadelphia · Available for select dates
            </div>

          </div>
        </div>

      </section>
    </main>
  );
}
