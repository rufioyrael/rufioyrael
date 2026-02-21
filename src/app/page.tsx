import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="max-w-2xl space-y-4">
          <div className="text-xs uppercase tracking-[0.35em] text-white/60">Melodic Techno • DnB • Underground</div>
          <h1 className="text-4xl font-semibold tracking-tight">Rufio Yrael</h1>
          <p className="text-white/70">
            Fan-first hub for mixes, drops, and show dates. Hit play, follow, and stay locked in.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/listen"
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:bg-white/90"
            >
              Listen
            </Link>
            <a
              href="https://soundcloud.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/85 hover:border-white/30"
            >
              Follow on SoundCloud
            </a>
            <a
              href="https://spotify.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/85 hover:border-white/30"
            >
              Follow on Spotify
            </a>
          </div>

          <div className="flex flex-wrap gap-3 pt-2 text-sm">
            <a className="text-white/70 hover:text-white" href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <span className="text-white/30">•</span>
            <a className="text-white/70 hover:text-white" href="https://youtube.com" target="_blank" rel="noreferrer">
              YouTube
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-widest text-white/60">Next up</div>
          <div className="mt-2 text-white/80">Shows page coming next.</div>
          <Link className="mt-4 inline-block text-sm text-white/70 hover:text-white" href="/shows">
            View shows →
          </Link>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-widest text-white/60">For industry</div>
          <div className="mt-2 text-white/80">Booking & press kit.</div>
          <Link className="mt-4 inline-block text-sm text-white/70 hover:text-white" href="/contact">
            Contact / Book →
          </Link>
        </div>
      </section>
    </div>
  );
}
