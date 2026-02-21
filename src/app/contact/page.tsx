export default function ContactPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Contact / Book</h1>
      <p className="text-white/70">Bookings, collabs, and inquiries.</p>

      <a
        className="inline-block rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:bg-white/90"
        href="mailto:booking@rufioyrael.com"
      >
        Email booking@rufioyrael.com
      </a>
    </div>
  );
}
