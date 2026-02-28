"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  setStatus(null);

  if (!email) return setStatus("Missing email.");
  if (!password) return setStatus("Missing password.");

  setBusy(true);
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();

    if (!res.ok) {
      setStatus(json?.error ?? "Login failed.");
      return;
    }

    const next = params.get("next") || "/admin/upload";
    router.replace(next);
    router.refresh(); // helps middleware-based gating immediately reflect
  } catch (err: any) {
    setStatus(err?.message ?? "Login failed.");
  } finally {
    setBusy(false);
  }
}

  return (
    <div className="mx-auto max-w-md py-20">
      <h1 className="text-3xl font-semibold mb-6">Admin Login</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          name="email"
          className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          name="password"
          className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none"
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button
          className="w-full rounded-xl bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
          disabled={busy}
          type="submit"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        {status ? (
          <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white/75">
            {status}
          </div>
        ) : null}
      </form>
    </div>
  );
}
