"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminUploadClient() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [tracklistJson, setTracklistJson] = useState("[]");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const autoSlug = useMemo(() => slugify(title), [title]);

 
  async function onLogout() {
    setStatus(null);
    setBusy(true);

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error(await res.text());

      window.location.href = "/login";
    } catch (e: any) {
      setStatus(e?.message ?? "Logout failed.");
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit() {
    if (!title) return setStatus("Missing title.");
    const finalSlug = slugify(slug || autoSlug);
    if (!finalSlug) return setStatus("Missing slug.");
    if (!file) return setStatus("Pick an audio file.");

    setBusy(true);
    setStatus("Signing upload…");

    try {
      // 1) get presigned URL
      const signRes = await fetch("/api/uploads/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: finalSlug,
          filename: file.name,
          contentType: file.type || "audio/mpeg",
        }),
      });

      if (!signRes.ok) throw new Error(await signRes.text());
      const { uploadUrl, publicUrl } = await signRes.json();

      // 2) upload directly to R2
      setStatus("Uploading to R2…");
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "audio/mpeg" },
        body: file,
      });
      if (!putRes.ok) throw new Error("R2 upload failed.");

      // 3) save mix record
      setStatus("Saving mix record…");
      let tracklist: any = [];
      try {
        tracklist = JSON.parse(tracklistJson || "[]");
      } catch {
        throw new Error("Tracklist JSON is invalid.");
      }

      const tagsArr = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const saveRes = await fetch("/api/mixes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: finalSlug,
          title,
          audio_url: publicUrl,
          tags: tagsArr,
          description,
          tracklist,
          published: true,
        }),
      });

      if (!saveRes.ok) throw new Error(await saveRes.text());

      setStatus(`Done ✅ Published at /listen/${finalSlug}`);
    } catch (e: any) {
      setStatus(e?.message ?? "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Admin Upload</h1>
          <p className="mt-1 text-white/60">
            Uploads audio to R2 and publishes a mix record.
          </p>
        </div>

          <button
            type="button"
            onClick={onLogout}
            disabled={busy}
            className="btn-ghost px-3 py-2 text-sm disabled:opacity-60"
            >
            Logout
          </button>
      </div>

      <div className="panel space-y-4 p-6">

        <label className="block">
          <div className="mb-1 text-xs uppercase tracking-widest text-white/60">
            Title
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/25"
            placeholder="Rufio Yrael — Night Drive Mix 001"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <div className="mb-1 text-xs uppercase tracking-widest text-white/60">
              Slug
            </div>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/25"
              placeholder={autoSlug}
            />
            <div className="mt-1 text-xs text-white/40">
              Leave blank to use: {autoSlug}
            </div>
          </label>

          <label className="block">
            <div className="mb-1 text-xs uppercase tracking-widest text-white/60">
              Tags (comma)
            </div>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/25"
              placeholder="melodic, dnb, dark"
            />
          </label>
        </div>

        <label className="block">
          <div className="mb-1 text-xs uppercase tracking-widest text-white/60">
            Description
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-24 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/25"
            placeholder="Short vibe notes…"
          />
        </label>

        <label className="block">
          <div className="mb-1 text-xs uppercase tracking-widest text-white/60">
            Tracklist (JSON)
          </div>
          <textarea
            value={tracklistJson}
            onChange={(e) => setTracklistJson(e.target.value)}
            className="h-36 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-white outline-none focus:border-white/25"
          />
          <div className="mt-1 text-xs text-white/40">
            Format: [{"{"}"startSec":0,"artist":"…","track":"…"{ "}"}]
          </div>
        </label>

        <label className="block">
          <div className="mb-1 text-xs uppercase tracking-widest text-white/60">
            Audio file
          </div>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-white/70"
          />
        </label>

        <button
          onClick={onSubmit}
          disabled={busy}
          className="btn-primary w-full px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {busy ? "Working…" : "Upload & Publish"}
        </button>

        {status ? (
          <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white/75">
            {status}
          </div>
        ) : null}
      </div>
    </div>
  );
}
