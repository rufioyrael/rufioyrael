import { notFound } from "next/navigation";
import { supabaseAnon } from "@/lib/supabase";
import type { Mix } from "@/lib/types";
import AudioPlayer from "@/components/AudioPlayer";

export const dynamic = "force-dynamic";

export default async function MixDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const sb = supabaseAnon();
  const { data, error } = await sb
    .from("mixes")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) return notFound();

  const mix = data as Mix;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-widest text-white/60">
          {new Date(mix.date).toLocaleDateString()} • {mix.tags?.join(" • ") ?? ""}
        </div>
        <h1 className="text-3xl font-semibold">{mix.title}</h1>
        {mix.description ? <p className="max-w-2xl text-white/70">{mix.description}</p> : null}
      </div>

      <AudioPlayer src={mix.audio_url} tracklist={(mix.tracklist ?? []) as any} />

      <div className="flex flex-wrap gap-3">
        <a
          className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/85 hover:border-white/30"
          href="https://soundcloud.com"
          target="_blank"
          rel="noreferrer"
        >
          SoundCloud
        </a>
        <a
          className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/85 hover:border-white/30"
          href="https://spotify.com"
          target="_blank"
          rel="noreferrer"
        >
          Spotify
        </a>
        <a
          className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/85 hover:border-white/30"
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>
        <a
          className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/85 hover:border-white/30"
          href="https://youtube.com"
          target="_blank"
          rel="noreferrer"
        >
          YouTube
        </a>
      </div>
    </div>
  );
}
