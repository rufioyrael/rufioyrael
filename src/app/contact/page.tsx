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
        <div className="lg:col-span-7">
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
                href="mailto:rufioyrael@gmail.com"
                className="inline-flex items-center gap-2 rounded-2xl border border-(--accent)/35 bg-(--accent)/14 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:border-(--accent)/55 hover:bg-(--accent)/22 hover:shadow-[0_0_28px_rgba(225,6,0,0.18)]"
              >
                rufioyrael@gmail.com <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right — info sidebar */}
        <div className="lg:col-span-5">
          <div className="panel p-6 space-y-4">
            <p className="text-sm leading-relaxed text-white/65">
              Philadelphia, PA — available for select dates, open to travel.
            </p>
            <p className="text-sm leading-relaxed text-white/65">
              Responses within a few days.
            </p>
            <div className="h-px bg-white/8" />
            <p className="text-xs leading-relaxed text-white/35">
              Please include event date, venue, and a budget range in your
              initial message. Incomplete inquiries may not receive a response.
            </p>
          </div>
        </div>

      </section>

      <section className="mt-10">
        <div className="mb-1 text-[11px] uppercase tracking-[0.22em] text-white/38">
          Open to
        </div>
        <div className="divide-y divide-white/8">
          {INQUIRY_TYPES.map(({ label, detail }) => (
            <div key={label} className="flex items-baseline justify-between gap-6 py-4">
              <span className="text-sm text-white/75">{label}</span>
              <span className="text-right text-xs text-white/38">{detail}</span>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
