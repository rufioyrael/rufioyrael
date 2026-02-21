"use client";

import { useMemo, useRef, useState } from "react";
import type { TracklistItem } from "@/lib/types";

function fmt(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export default function AudioPlayer({
  src,
  tracklist,
}: {
  src: string;
  tracklist?: TracklistItem[] | null;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState(0);
  const [dur, setDur] = useState<number | null>(null);

  const sorted = useMemo(() => {
    if (!tracklist?.length) return [];
    return [...tracklist].sort((a, b) => (a.startSec ?? 0) - (b.startSec ?? 0));
  }, [tracklist]);

  function seek(sec?: number) {
    if (sec == null) return;
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = sec;
    el.play().catch(() => {});
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <audio
        ref={audioRef}
        controls
        preload="metadata"
        src={src}
        className="w-full"
        onTimeUpdate={() => setCurrent(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDur(audioRef.current?.duration ?? null)}
      />

      <div className="mt-3 flex items-center justify-between text-xs text-white/60">
        <span>{fmt(current)}</span>
        <span>{dur ? fmt(dur) : "--:--"}</span>
      </div>

      {sorted.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-xs uppercase tracking-widest text-white/60">Tracklist</div>
          <div className="max-h-72 overflow-auto rounded-xl border border-white/10">
            {sorted.map((t, idx) => (
              <button
                key={`${t.artist}-${t.track}-${idx}`}
                className="flex w-full items-center justify-between gap-4 border-b border-white/10 px-3 py-2 text-left hover:bg-white/5"
                onClick={() => seek(t.startSec)}
                type="button"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm text-white/85">
                    {t.artist} — {t.track}
                  </div>
                  {t.note ? <div className="truncate text-xs text-white/50">{t.note}</div> : null}
                </div>
                <div className="shrink-0 text-xs text-white/60">
                  {t.startSec != null ? fmt(t.startSec) : ""}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
