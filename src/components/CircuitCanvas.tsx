"use client";

import { useEffect, useRef } from "react";

const { round, random, PI } = Math;
const TAU = PI * 2;
const rand = (n: number) => n * random();

const DIRS: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

const COUNT    = 30;
const BASE_SPD = 0.9;
const RNG_SPD  = 1.4;
const SEG_MIN  = 45;
const SEG_MAX  = 120;
const BASE_HUE = 2;
const RNG_HUE  = 20;
const LINE_W   = 0.8;
const NODE_R   = 1.5;
const FADE     = 0.09;

type Tracer = {
  x: number; y: number;
  px: number; py: number;
  dx: number; dy: number;
  speed: number;
  segDist: number; segLen: number;
  hue: number;
  life: number; ttl: number;
};

function spawn(w: number, h: number): Tracer {
  const [dx, dy] = DIRS[Math.floor(random() * 4)];
  const x = rand(w);
  const y = rand(h);
  return {
    x, y, px: x, py: y,
    dx, dy,
    speed: BASE_SPD + rand(RNG_SPD),
    segDist: 0,
    segLen: SEG_MIN + rand(SEG_MAX - SEG_MIN),
    hue: BASE_HUE + rand(RNG_HUE),
    life: 0,
    ttl: 200 + rand(320),
  };
}

export default function CircuitCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ca = document.createElement("canvas");
    const cb = document.createElement("canvas");
    cb.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;";
    container.appendChild(cb);

    const ctxA = ca.getContext("2d")!;
    const ctxB = cb.getContext("2d")!;

    // Glow filter set once; toggled to "none" only for the sharp pass
    ctxB.filter = "blur(5px)";

    let tracers: Tracer[] = [];
    let w = 0, h = 0, raf = 0;

    function resize() {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      if (nw === w && nh === h) return;
      w = nw; h = nh;
      ca.width = w; ca.height = h;
      cb.width = w; cb.height = h;
      // Re-seed so tracers don't wander off a blank canvas after resize
      for (const t of tracers) Object.assign(t, spawn(w, h));
    }

    function step() {
      // Hoist constant state out of the per-tracer loop
      ctxA.lineWidth = LINE_W;
      ctxA.lineCap = "square";

      for (const t of tracers) {
        t.life++;

        // Fade-in over first 35% of life, fade-out over remaining 65%
        const peak = t.ttl * 0.35;
        const alpha =
          t.life < peak
            ? t.life / peak
            : Math.max(0, (t.ttl - t.life) / (t.ttl - peak));

        t.px = t.x;
        t.py = t.y;
        t.x += t.dx * t.speed;
        t.y += t.dy * t.speed;
        t.segDist += t.speed;

        ctxA.strokeStyle = `hsla(${t.hue},85%,62%,${alpha * 0.42})`;
        ctxA.beginPath();
        ctxA.moveTo(t.px, t.py);
        ctxA.lineTo(t.x, t.y);
        ctxA.stroke();

        if (t.segDist >= t.segLen) {
          // Snap to integer pixel for clean corners
          t.x = round(t.x);
          t.y = round(t.y);

          ctxA.fillStyle = `hsla(${t.hue},90%,72%,${alpha * 0.60})`;
          ctxA.beginPath();
          ctxA.arc(t.x, t.y, NODE_R, 0, TAU);
          ctxA.fill();

          if (t.dx !== 0) {
            t.dy = random() > 0.5 ? 1 : -1;
            t.dx = 0;
          } else {
            t.dx = random() > 0.5 ? 1 : -1;
            t.dy = 0;
          }

          t.segDist = 0;
          t.segLen = SEG_MIN + rand(SEG_MAX - SEG_MIN);
        }

        if (t.x < -8 || t.x > w + 8 || t.y < -8 || t.y > h + 8 || t.life > t.ttl) {
          Object.assign(t, spawn(w, h));
        }
      }
    }

    function render() {
      // Fade trails without a dark fill — portrait stays visible
      ctxA.globalCompositeOperation = "destination-out";
      ctxA.fillStyle = `rgba(0,0,0,${FADE})`;
      ctxA.fillRect(0, 0, w, h);
      ctxA.globalCompositeOperation = "source-over";

      // Clear display canvas each frame so no dark layer accumulates
      ctxB.clearRect(0, 0, w, h);

      // Glow pass (filter already "blur(5px)" from init)
      ctxB.globalAlpha = 0.6;
      ctxB.drawImage(ca, 0, 0);

      // Sharp pass
      ctxB.filter = "none";
      ctxB.globalAlpha = 1;
      ctxB.drawImage(ca, 0, 0);
      ctxB.filter = "blur(5px)";
    }

    function draw() {
      step();
      render();
      raf = requestAnimationFrame(draw);
    }

    resize();
    tracers = Array.from({ length: COUNT }, () => spawn(w, h));
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      if (container.contains(cb)) container.removeChild(cb);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-45"
      aria-hidden="true"
    />
  );
}
