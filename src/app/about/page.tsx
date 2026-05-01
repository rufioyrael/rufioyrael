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

      <section className="mt-14 max-w-2xl space-y-10 sm:mt-16">

        <div>
          <div className="mb-5 text-[11px] uppercase tracking-[0.22em] text-white/45">
            Background
          </div>
          <div className="space-y-4 text-[15px] leading-relaxed text-white/65">
            <p>
              Rufio Yrael came up through the Philadelphia underground at a time when
              getting into a rave still meant following a flyer taped to a lamppost or
              a tip passed through a forum that no longer exists. The Philly scene of
              the early-to-late 2000s was split between basement parties that ran on
              word of mouth and a club culture that was slowly absorbing everything
              around it — and the tension between those two worlds shaped how this
              project thinks about sound. Not polish. Not performance. Weight.
            </p>
            <p>
              The genres came later — melodic techno, drum &amp; bass, dark minimal,
              ambient texture, sometimes trance — but the instinct was always the same
              one from those early rooms: that a set is a document of intent, and you
              can hear when someone built it versus when they just showed up.
            </p>
          </div>
        </div>

        <div>
          <div className="mb-5 text-[11px] uppercase tracking-[0.22em] text-white/45">
            Approach
          </div>
          <p className="text-[15px] leading-relaxed text-white/65">
            The archive is two things at once. Some releases are live recordings from
            parties and raves — sets built for rooms, for crowds, for a specific night.
            Others are the Twitch streams: a monthly or weekly live mixing session
            working through the top 100 tracks in a chosen genre, in real time, no
            edits. Both get the same treatment — sequenced, labeled, presented without
            decoration. The setting changes. The standard doesn&apos;t.
          </p>
        </div>

        <p className="pt-4 text-sm text-white/38">
          Philadelphia, PA — available for select dates, open to travel.{" "}
          Direct inquiries via the{" "}
          <a href="/contact" className="underline underline-offset-2 hover:text-white/60 transition">
            contact page
          </a>
          .
        </p>

      </section>

    </main>
  );
}
