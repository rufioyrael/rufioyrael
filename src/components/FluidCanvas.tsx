"use client";

import { useEffect, useRef } from "react";

// ── Shaders ────────────────────────────────────────────────────────────────

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Domain-warped fBm — Inigo Quilez technique.
// Two levels of warping (q → r → f) produce the organic liquid-swirl depth.
const FRAG = `
precision highp float;
uniform float u_t;
uniform vec2  u_res;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}

float snoise(vec2 p) {
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  vec2 o = step(a.yx, a.xy);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
  vec3 n = h*h*h*h * vec3(dot(a, hash2(i)), dot(b, hash2(i+o)), dot(c, hash2(i+1.0)));
  return dot(n, vec3(70.0));
}

float fbm(vec2 p) {
  float v   = 0.0;
  float amp = 0.5;
  mat2  rot = mat2(0.80, 0.60, -0.60, 0.80); // ~37° rotation per octave
  for (int i = 0; i < 5; i++) {
    v  += amp * snoise(p);
    p   = rot * p * 2.0 + vec2(100.3, 5.71);
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;

  // Aspect-correct, centred coordinates
  vec2 p  = (uv - 0.5) * 2.0;
  p.x    *= u_res.x / u_res.y;
  p      *= 1.25;

  float t = u_t * 0.038; // very slow drift — ~26 s per noise period

  // Layer 1: first warp field
  vec2 q = vec2(
    fbm(p + vec2(0.00, 0.00) + t),
    fbm(p + vec2(5.20, 1.30) + t * 0.78)
  );

  // Layer 2: warp the warp for deeper swirl
  vec2 r = vec2(
    fbm(p + 3.5 * q + vec2(1.70, 9.20) + t * 0.20),
    fbm(p + 3.5 * q + vec2(8.30, 2.80) + t * 0.17)
  );

  // Final field value
  float f = fbm(p + 4.0 * r + t * 0.08);
  f = clamp(f * 0.5 + 0.5, 0.0, 1.0); // remap [-1,1] → [0,1]

  // ── Ember-dark liquid palette ────────────────────────────────────────────
  // Biased heavily toward near-black; ember highlights appear only at peaks.
  vec3 c0 = vec3(0.018, 0.008, 0.008); // near-black
  vec3 c1 = vec3(0.058, 0.022, 0.018); // dark charcoal-red
  vec3 c2 = vec3(0.135, 0.042, 0.032); // dark burgundy
  vec3 c3 = vec3(0.400, 0.082, 0.052); // mid ember
  vec3 c4 = vec3(0.860, 0.155, 0.062); // bright ember highlight

  vec3 col = mix(c0, c1, smoothstep(0.00, 0.42, f));
  col      = mix(col, c2, smoothstep(0.38, 0.60, f));
  col      = mix(col, c3, smoothstep(0.57, 0.80, f));
  col      = mix(col, c4, smoothstep(0.77, 1.00, f));

  // Subtle vignette — darkens edges so centre content stays legible
  float vign = 1.0 - smoothstep(0.45, 1.15, length(uv - 0.5) * 2.0);
  col *= 0.18 + 0.82 * vign;

  gl_FragColor = vec4(col, 1.0);
}
`;

// ── Helpers ────────────────────────────────────────────────────────────────

function makeShader(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function FluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return; // fallback: static CSS bg is still fine

    const prog = gl.createProgram()!;
    gl.attachShader(prog, makeShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, makeShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Fullscreen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uT   = gl.getUniformLocation(prog, "u_t");
    const uRes = gl.getUniformLocation(prog, "u_res");

    let w = 0, h = 0, raf = 0, start = 0;

    function resize() {
      // Cap DPR at 1.5 — fluid shader is expensive per-pixel
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const nw = Math.round(window.innerWidth  * dpr);
      const nh = Math.round(window.innerHeight * dpr);
      if (nw === w && nh === h) return;
      w = nw; h = nh;
      canvas.width  = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    }

    function draw(ts: number) {
      if (!start) start = ts;
      gl.uniform1f(uT, (ts - start) * 0.001); // seconds
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    }

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
