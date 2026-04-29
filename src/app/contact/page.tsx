const INQUIRY_TYPES = [
  { label: "Club nights", detail: "DJ sets, open-to-close, and back-to-back" },
  { label: "Events & festivals", detail: "Outdoor and indoor bookings" },
  { label: "Residencies", detail: "Ongoing or recurring dates" },
  { label: "Collaborations", detail: "Label projects, mix series, creative work" },
];

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14 sm:py-20">

      <section className="max-w-3xl">
        <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
          Contact
        </div>
        <h1 className="mt-4 text-[2.6rem] font-semibold leading-[1.01] tracking-tight sm:text-[4rem]">
          <span className="block text-white">Get in touch.</span>
          <span className="block text-white/60">Direct. No middleman.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-[15px] leading-relaxed text-white/65 sm:text-base">
          Bookings, collabs, and serious inquiries only. All messages go directly
          — responses within a few days.
        </p>
      </section>

      <section className="mt-14 grid gap-10 sm:mt-16 lg:grid-cols-12 lg:items-start">

        {/* Left — primary contact */}
        <div className="space-y-8 lg:col-span-7">

          <div className="panel overflow-hidden">
            <div className="space-y-1 px-6 pt-6 pb-2">
              <div className="text-[10px] uppercase tracking-[0.20em] text-white/32">
                Primary contact
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                The single point of contact for all booking and project inquiries.
                Include event date, venue, and budget in your first message.
              </p>
            </div>
            <div className="px-6 py-6">
              <a
                href="mailto:booking@rufioyrael.com"
                className="inline-flex items-center gap-2 rounded-2xl border border-(--accent)/35 bg-(--accent)/14 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:border-(--accent)/55 hover:bg-(--accent)/22 hover:shadow-[0_0_28px_rgba(225,6,0,0.18)]"
              >
                booking@rufioyrael.com <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          <div>
            <div className="mb-4 text-[11px] uppercase tracking-[0.22em] text-white/38">
              Open to
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {INQUIRY_TYPES.map(({ label, detail }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/2 px-4 py-4"
                >
                  <span className="mt-0.75 h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent)/55" />
                  <div>
                    <div className="text-sm text-white/80">{label}</div>
                    <div className="mt-0.5 text-xs text-white/40">{detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right — info sidebar */}
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
                <div className="text-[10px] uppercase tracking-[0.20em] text-white/32">Availability</div>
                <div className="mt-1.5 text-sm text-white/75">Select dates — inquire for schedule</div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.20em] text-white/32">Response time</div>
                <div className="mt-1.5 text-sm text-white/75">Within a few days</div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.20em] text-white/32">Travel</div>
                <div className="mt-1.5 text-sm text-white/75">Available regionally and beyond</div>
              </div>
            </div>

            <div className="h-px bg-white/8" />

            <div className="px-6 py-5">
              <p className="text-xs leading-relaxed text-white/35">
                Please include event date, venue, and a budget range in your
                initial message. Incomplete inquiries may not receive a response.
              </p>
            </div>

          </div>
        </div>

      </section>

    </main>
  );
}
