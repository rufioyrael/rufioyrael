"use client";

import { useEffect, useRef, useState } from "react";

function formatTime(value: number | null) {
  if (value == null || Number.isNaN(value)) return "--:--";
  const totalSeconds = Math.max(0, Math.floor(value));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

type MixPlaybackPanelProps = {
  src: string;
  title: string;
  coverImageUrl?: string | null;
  runtime?: string;
};

export default function MixPlaybackPanel({
  src,
  title,
  runtime,
}: MixPlaybackPanelProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncTime = () => setCurrentTime(audio.currentTime || 0);
    const syncDuration = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : null);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => { setIsPlaying(false); setCurrentTime(0); };

    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    syncTime();
    syncDuration();

    return () => {
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try { await audio.play(); } catch { setIsPlaying(false); }
    } else {
      audio.pause();
    }
  };

  const seekTo = (nextValue: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = nextValue;
    setCurrentTime(nextValue);
  };

  const seekBy = (delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const max = Number.isFinite(audio.duration) ? audio.duration : currentTime;
    seekTo(Math.min(Math.max(audio.currentTime + delta, 0), max));
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || !progressMax) return;
    seekTo(((e.clientX - rect.left) / rect.width) * progressMax);
  };

  const progressMax = duration ?? 0;
  const safeCurrentTime = Math.min(currentTime, progressMax || currentTime);
  const progressPercent = progressMax > 0 ? (safeCurrentTime / progressMax) * 100 : 0;
  const metaParts = ["Rufio Yrael", runtime].filter(Boolean);

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] px-5 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:px-6 sm:py-5">
      <audio ref={audioRef} preload="metadata" src={src}>
        Your browser does not support the audio element.
      </audio>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-[var(--accent)]/12 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      </div>

      <div className="relative">
        {/* Title + metadata */}
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-white sm:text-[1.2rem]">
            {title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-white/42">
            {metaParts.map((part, index) => (
              <div key={`${part}-${index}`} className="flex items-center gap-3">
                {index > 0 ? <span className="text-white/20">•</span> : null}
                <span>{part}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/58">
            Direct playback from the archive with a quieter, more deliberate
            listening surface.
          </p>
        </div>

        {/* Transport controls */}
        <div className="mt-6 flex items-center gap-6">
          <button
            type="button"
            onClick={() => seekBy(-15)}
            className="text-[11px] uppercase tracking-[0.18em] text-white/45 transition hover:text-white"
            aria-label="Skip back 15 seconds"
          >
            −15
          </button>

          <button
            type="button"
            onClick={togglePlayback}
            className="text-xl text-white/80 transition hover:text-white"
            aria-label={isPlaying ? "Pause mix" : "Play mix"}
          >
            {isPlaying ? "II" : "▶"}
          </button>

          <button
            type="button"
            onClick={() => seekBy(15)}
            className="text-[11px] uppercase tracking-[0.18em] text-white/45 transition hover:text-white"
            aria-label="Skip forward 15 seconds"
          >
            +15
          </button>
        </div>

        {/* Progress line + dot */}
        <div
          ref={trackRef}
          className="relative mt-8 cursor-pointer py-3"
          onClick={handleTrackClick}
          role="slider"
          aria-label="Playback progress"
          aria-valuenow={Math.round(safeCurrentTime)}
          aria-valuemin={0}
          aria-valuemax={Math.round(progressMax)}
        >
          {/* Full track line */}
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/15" />
          {/* Played portion */}
          <div
            className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-white/50 transition-[width] duration-100"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Playhead dot */}
          <div
            className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-[left] duration-100"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        {/* Timestamps */}
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/38">
          <span>{formatTime(safeCurrentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
