import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="tracking-widest text-sm uppercase text-white/90">
          Rufio Yrael
        </Link>
        <nav className="flex items-center gap-5 text-sm text-white/70">
          <Link className="hover:text-white" href="/listen">Listen</Link>
          <Link className="hover:text-white" href="/shows">Shows</Link>
          <Link className="hover:text-white" href="/about">About</Link>
          <Link
            className="rounded-full border border-white/15 px-3 py-1 hover:border-white/30 hover:text-white"
            href="/contact"
          >
            Contact / Book
          </Link>
        </nav>
      </div>
    </header>
  );
}
