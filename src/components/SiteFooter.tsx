export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-10 text-sm text-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4">
        <div className="flex flex-wrap gap-4">
          <a className="hover:text-white" href="https://www.twitch.tv/rufio_yrael" target="_blank" rel="noreferrer">
            Twitch
          </a>
          <a className="hover:text-white" href="https://www.instagram.com/rufioyrael/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a className="hover:text-white" href="https://soundcloud.com/rufioyraelphl" target="_blank" rel="noreferrer">
            SoundCloud
          </a>
        </div>
        <div className="text-white/40">© {new Date().getFullYear()} Rufio Yrael</div>
      </div>
    </footer>
  );
}
