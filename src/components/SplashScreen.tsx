"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "splash_shown";
const TEXT_DELAY  = 60;   // ms before text starts fading in
const FADE_OUT_AT = 1500; // ms before overlay starts fading out
const UNMOUNT_AT  = 2200; // ms before component is removed

export default function SplashScreen() {
  const [visible,     setVisible]     = useState(false);
  const [textReady,   setTextReady]   = useState(false);
  const [fadingOut,   setFadingOut]   = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    setVisible(true);

    const t1 = setTimeout(() => setTextReady(true),  TEXT_DELAY);
    const t2 = setTimeout(() => setFadingOut(true),  FADE_OUT_AT);
    const t3 = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, UNMOUNT_AT);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      style={{
        opacity:    fadingOut ? 0 : 1,
        transition: fadingOut ? "opacity 700ms ease" : "none",
      }}
      aria-hidden="true"
    >
      <span
        className="select-none text-[1.9rem] font-semibold uppercase tracking-[0.45em] text-white sm:text-[3rem]"
        style={{
          opacity:    textReady ? 1 : 0,
          transition: "opacity 450ms ease",
        }}
      >
        Rufio Yrael
      </span>
    </div>
  );
}
