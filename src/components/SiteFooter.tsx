export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-10 text-sm text-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4">
        <div className="flex flex-wrap gap-4">
          <a className="hover:text-white" href="https://soundcloud.com" target="_blank" rel="noreferrer">
            SoundCloud
          </a>
          <a className="hover:text-white" href="https://spotify.com" target="_blank" rel="noreferrer">
            Spotify
          </a>
          <a className="hover:text-white" href="https://instagram.com" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a className="hover:text-white" href="https://youtube.com" target="_blank" rel="noreferrer">
            YouTube
          </a>
          <span className="text-white/30">•</span>
          <a className="hover:text-white" href="/epk">EPK</a>
        </div>
        <div className="text-white/40">© {new Date().getFullYear()} Rufio Yrael</div>
      </div>
    </footer>
  );
}
