"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "splash_shown";
const TEXT_DELAY  = 60;   // ms before text starts fading in
const FADE_OUT_AT = 2200; // ms before overlay starts fading out
const UNMOUNT_AT  = 2900; // ms before component is removed

type Phase = "blocking" | "showing" | "fading" | "done";

export default function SplashScreen() {
  const [phase,     setPhase]     = useState<Phase>("blocking");
  const [textReady, setTextReady] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) {
      setPhase("done");
      return;
    }

    setPhase("showing");

    const t1 = setTimeout(() => setTextReady(true),   TEXT_DELAY);
    const t2 = setTimeout(() => setPhase("fading"),   FADE_OUT_AT);
    const t3 = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, UNMOUNT_AT);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black"
      style={{
        opacity:    phase === "fading" ? 0 : 1,
        transition: phase === "fading" ? "opacity 700ms ease" : "none",
      }}
      aria-hidden="true"
    >
      {phase !== "blocking" ? (
        <span
          className="select-none text-center text-[1.6rem] font-semibold uppercase tracking-[0.28em] text-white sm:text-[3rem] sm:tracking-[0.45em]"
          style={{
            opacity:    textReady ? 1 : 0,
            transition: "opacity 450ms ease",
          }}
        >
          Rufio Yrael
        </span>
      ) : null}
    </div>
  );
}
