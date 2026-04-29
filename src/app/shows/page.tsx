import Link from "next/link";

export default function ShowsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14 sm:py-20">

      <section className="max-w-3xl">
        <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
          Shows
        </div>
        <h1 className="mt-4 text-[2.6rem] font-semibold leading-[1.01] tracking-tight sm:text-[4rem]">
          <span className="block text-white">Live dates.</span>
          <span className="block text-white/60">Upcoming and past shows.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-[15px] leading-relaxed text-white/65 sm:text-base">
          Upcoming bookings and past appearances. Select dates — available for
          club nights and events.
        </p>
      </section>

      <section className="mt-14 sm:mt-16">
        <div className="panel px-8 py-12 text-center">
          <div className="text-[11px] uppercase tracking-[0.22em] text-white/35">
            No upcoming shows listed
          </div>
          <p className="mt-3 text-sm text-white/45">
            Check back soon or reach out for booking enquiries.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-(--accent)/35 bg-(--accent)/14 px-5 py-2.5 text-sm font-medium text-white transition duration-200 hover:border-(--accent)/55 hover:bg-(--accent)/22"
          >
            Booking enquiries →
          </Link>
        </div>
      </section>

    </main>
  );
}
