"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function formatTime(value: number | null) {
  if (value == null || Number.isNaN(value)) {
    return "--:--";
  }

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
  coverImageUrl,
  runtime,
}: MixPlaybackPanelProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    // Mirror native audio state into React so the custom transport stays in
    // sync without replacing the browser's playback engine.
    const syncTime = () => setCurrentTime(audio.currentTime || 0);
    const syncDuration = () => {
      const nextDuration = Number.isFinite(audio.duration)
        ? audio.duration
        : null;
      setDuration(nextDuration);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

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

  async function togglePlayback() {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }

      return;
    }

    audio.pause();
  }

  function seekTo(nextValue: number) {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = nextValue;
    setCurrentTime(nextValue);
  }

  function seekBy(delta: number) {
    const audio = audioRef.current;

    if (!audio) return;

    const max = Number.isFinite(audio.duration) ? audio.duration : currentTime;
    const nextValue = Math.min(Math.max(audio.currentTime + delta, 0), max);
    seekTo(nextValue);
  }

  const progressMax = duration ?? 0;
  const safeCurrentTime = Math.min(currentTime, progressMax || currentTime);
  const progressPercent =
    progressMax > 0 ? (safeCurrentTime / progressMax) * 100 : 0;
  // Build the small metadata row dynamically so null runtime values do not
  // leave behind empty separators in the UI.
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <div className="absolute inset-2 rounded-full bg-[var(--accent)]/18 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.03]">
              {coverImageUrl ? (
                <Image
                  src={coverImageUrl}
                  alt={`${title} cover`}
                  width={192}
                  height={192}
                  unoptimized
                  className="h-20 w-20 object-cover sm:h-24 sm:w-24"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center bg-black/40 sm:h-24 sm:w-24">
                  <div className="h-8 w-8 rounded-full border border-white/10 bg-white/[0.04]" />
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
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
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={togglePlayback}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-sm text-white transition hover:border-[var(--accent)]/35 hover:bg-white/[0.10]"
              aria-label={isPlaying ? "Pause mix" : "Play mix"}
            >
              {isPlaying ? "II" : "▶"}
            </button>

            <button
              type="button"
              onClick={() => seekBy(-15)}
              className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white/62 transition hover:border-white/18 hover:text-white"
            >
              -15
            </button>

            <button
              type="button"
              onClick={() => seekBy(15)}
              className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white/62 transition hover:border-white/18 hover:text-white"
            >
              +15
            </button>

            <div className="text-[11px] uppercase tracking-[0.18em] text-white/38">
              {isPlaying ? "Now playing" : "Ready"}
            </div>
          </div>

          <div>
            <div className="relative h-12 overflow-hidden rounded-xl border border-white/8 bg-[#131317] px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              <div
                className="absolute inset-y-0 left-0 bg-[linear-gradient(90deg,rgba(123,18,14,0.55),rgba(225,6,0,0.16),transparent)] transition-[width] duration-200"
                style={{ width: `${progressPercent}%` }}
              />
              <div className="relative flex h-full items-center gap-1.5">
                {Array.from({ length: 36 }).map((_, index) => {
                  const pattern = [22, 30, 42, 58, 38, 26, 52, 46, 34, 24];
                  const height = pattern[index % pattern.length];
                  const isActive = progressPercent > (index / 35) * 100;

                  return (
                    <span
                      key={index}
                      className={[
                        "block flex-1 rounded-full transition-colors duration-200",
                        isActive ? "bg-[rgba(164,44,36,0.9)]" : "bg-[#232329]",
                      ].join(" ")}
                      style={{ height: `${height}%` }}
                    />
                  );
                })}
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={progressMax || 0}
              step={1}
              value={safeCurrentTime}
              onChange={(event) => seekTo(Number(event.target.value))}
              className="mt-2 w-full accent-[rgb(164,44,36)]"
              aria-label="Playback progress"
            />

            <div className="mt-1.5 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/42">
              <span>{formatTime(safeCurrentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
