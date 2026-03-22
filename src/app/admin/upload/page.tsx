"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AdminMixRow = {
  id: string;
  slug: string;
  title: string;
  date_label: string | null;
  runtime: string | null;
  description: string | null;
  tags: string[] | null;
  tracklist: string[] | null;
  published: boolean;
  featured: boolean;
  audio_url: string | null;
  cover_image_url: string | null;
  created_at: string;
};

type StatusState = {
  tone: "success" | "error" | "info";
  message: string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminUploadPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">(
    "all"
  );
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState("");
  const [runtime, setRuntime] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tracklistInput, setTracklistInput] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverFileName, setCoverFileName] = useState<string | null>(null);
  const [existingAudioUrl, setExistingAudioUrl] = useState<string | null>(null);
  const [existingCoverImageUrl, setExistingCoverImageUrl] = useState<string | null>(null);

  const [status, setStatus] = useState<StatusState | null>(null);
  const [busy, setBusy] = useState(false);

  const [mixes, setMixes] = useState<AdminMixRow[]>([]);
  const [loadingMixes, setLoadingMixes] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const parsedTags = useMemo(() => {
    return tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }, [tagsInput]);

  const parsedTracklist = useMemo(() => {
    return tracklistInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }, [tracklistInput]);

  const resolvedSlug = slug || slugify(title);
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const visibleMixes = mixes.filter((mix) => {
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "published"
          ? mix.published
          : !mix.published;

    const matchesSearch = normalizedSearch
      ? [mix.title, mix.slug, mix.date_label ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch)
      : true;

    return matchesStatus && matchesSearch;
  });

  async function loadMixes() {
    // Refresh the embedded admin index after each write so the page behaves
    // like a lightweight CMS without introducing extra state libraries.
    setLoadingMixes(true);
    try {
      const res = await fetch("/api/mixes", {
        method: "GET",
        cache: "no-store",
      });

      const json = await res.json();

      if (!res.ok) {
        setStatus({
          tone: "error",
          message: json?.error ?? "Failed to load mixes.",
        });
        return;
      }

      setMixes(Array.isArray(json?.mixes) ? json.mixes : []);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load mixes.";
      setStatus({ tone: "error", message });
    } finally {
      setLoadingMixes(false);
    }
  }

  useEffect(() => {
    loadMixes();
  }, []);

  function handleGenerateSlug() {
    setSlug(slugify(title));
  }

  function handleClear() {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setDate("");
    setRuntime("");
    setDescription("");
    setTagsInput("");
    setTracklistInput("");
    setFeatured(false);
    setPublished(false);

    setAudioFile(null);
    setAudioFileName(null);

    setCoverFile(null);
    setCoverFileName(null);
    setExistingAudioUrl(null);
    setExistingCoverImageUrl(null);
  }

  function handleEditMix(mix: AdminMixRow) {
    // Load the selected row back into the same form so the admin page behaves
    // like a single-screen CMS instead of splitting create/edit flows apart.
    setEditingId(mix.id);
    setTitle(mix.title);
    setSlug(mix.slug);
    setDate(mix.date_label ?? "");
    setRuntime(mix.runtime ?? "");
    setDescription(mix.description ?? "");
    setTagsInput((mix.tags ?? []).join(", "));
    setTracklistInput((mix.tracklist ?? []).join("\n"));
    setFeatured(mix.featured);
    setPublished(mix.published);
    setAudioFile(null);
    setAudioFileName(null);
    setCoverFile(null);
    setCoverFileName(null);
    setExistingAudioUrl(mix.audio_url);
    setExistingCoverImageUrl(mix.cover_image_url);
    setStatus({
      tone: "info",
      message: `Editing "${mix.title}". Update fields and save to apply changes.`,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function signAndUpload(file: File, kind: "audio" | "cover") {
    const signRes = await fetch("/api/uploads/sign", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        slug: resolvedSlug,
        filename: file.name,
        contentType: file.type,
        kind,
      }),
    });

    const signJson = await signRes.json();

    if (!signRes.ok) {
      throw new Error(signJson?.error ?? `Failed to sign ${kind} upload.`);
    }

    // Upload goes directly from the browser to R2 after the server signs the key.
    const putRes = await fetch(signJson.uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });

    if (!putRes.ok) {
      throw new Error(`Failed to upload ${kind} file to storage.`);
    }

    return signJson.publicUrl as string;
  }

  async function uploadAudio(): Promise<string | null> {
    if (!audioFile) return null;
    return signAndUpload(audioFile, "audio");
  }

  async function uploadCover(): Promise<string | null> {
    if (!coverFile) return null;
    return signAndUpload(coverFile, "cover");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);

    if (!title.trim()) return setStatus({ tone: "error", message: "Missing title." });
    if (!resolvedSlug.trim()) return setStatus({ tone: "error", message: "Missing slug." });
    if (!date.trim()) return setStatus({ tone: "error", message: "Missing date." });
    if (!runtime.trim()) return setStatus({ tone: "error", message: "Missing runtime." });
    if (!description.trim()) {
      return setStatus({ tone: "error", message: "Missing description." });
    }

    setBusy(true);

    try {
      const [uploadedAudioUrl, uploadedCoverImageUrl] = await Promise.all([
        uploadAudio(),
        uploadCover(),
      ]);
      // Preserve existing asset URLs during edits unless the admin explicitly
      // chooses replacement files in this session.
      const audioUrl = uploadedAudioUrl ?? existingAudioUrl;
      const coverImageUrl = uploadedCoverImageUrl ?? existingCoverImageUrl;

      const res = await fetch("/api/mixes", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          slug: resolvedSlug,
          title,
          dateLabel: date,
          runtime,
          description,
          tags: parsedTags,
          tracklist: parsedTracklist,
          featured,
          published,
          audioUrl,
          coverImageUrl,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setStatus({
          tone: "error",
          message: json?.error ?? "Failed to save mix.",
        });
        return;
      }

      setStatus({
        tone: "success",
        message: editingId
          ? `Updated mix: ${json?.mix?.title ?? title} (${json?.mix?.slug ?? resolvedSlug})`
          : `Saved mix: ${json?.mix?.title ?? title} (${json?.mix?.slug ?? resolvedSlug})`,
      });

      handleClear();
      await loadMixes();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save mix.";
      setStatus({ tone: "error", message });
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteMix(id: string, title: string) {
    const confirmed = window.confirm(
      `Delete "${title}"?\n\nThis removes the mix record from the site.`
    );

    if (!confirmed) return;

    setDeletingId(id);
    setStatus(null);

    try {
      const res = await fetch("/api/mixes", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const json = await res.json();

      if (!res.ok) {
        setStatus({
          tone: "error",
          message: json?.error ?? "Failed to delete mix.",
        });
        return;
      }

      if (editingId === id) {
        handleClear();
      }

      setStatus({ tone: "success", message: `Deleted mix: ${title}` });
      await loadMixes();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete mix.";
      setStatus({ tone: "error", message });
    } finally {
      setDeletingId(null);
    }
  }

  async function handleQuickUpdate(
    mix: AdminMixRow,
    changes: Partial<Pick<AdminMixRow, "published" | "featured">>
  ) {
    // Reuse the same PATCH route as full edits so quick actions and the main
    // editor stay aligned on validation and saved field shape.
    setUpdatingId(mix.id);
    setStatus(null);

    try {
      const nextPublished = changes.published ?? mix.published;
      const nextFeatured = changes.featured ?? mix.featured;

      const res = await fetch("/api/mixes", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: mix.id,
          slug: mix.slug,
          title: mix.title,
          dateLabel: mix.date_label ?? "",
          runtime: mix.runtime ?? "",
          description: mix.description ?? "",
          tags: mix.tags ?? [],
          tracklist: mix.tracklist ?? [],
          published: nextPublished,
          featured: nextFeatured,
          audioUrl: mix.audio_url,
          coverImageUrl: mix.cover_image_url,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setStatus({
          tone: "error",
          message: json?.error ?? "Failed to update mix state.",
        });
        return;
      }

      setMixes((current) =>
        current.map((item) =>
          item.id === mix.id
            ? {
                ...item,
                published: nextPublished,
                featured: nextFeatured,
              }
            : item
        )
      );

      if (editingId === mix.id) {
        setPublished(nextPublished);
        setFeatured(nextFeatured);
      }

      setStatus({
        tone: "success",
        message: `Updated ${mix.title}: ${
          nextPublished ? "published" : "draft"
        }${nextFeatured ? " · featured" : ""}`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update mix state.";
      setStatus({ tone: "error", message });
    } finally {
      setUpdatingId(null);
    }
  }

  const formHeading = editingId ? "Edit mix" : "Upload mix";
  const formSubheading = editingId
    ? "Update an existing archive entry without leaving this page."
    : "Prepare metadata for the public archive.";
  const submitLabel = busy
    ? editingId
      ? "Updating…"
      : "Saving…"
    : editingId
      ? "Update mix"
      : "Save mix";

  return (
    <main className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
      <section className="max-w-3xl">
        <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
          Admin
        </div>

        <h1 className="mt-4 text-[2.4rem] font-semibold leading-[1.01] tracking-tight sm:text-[3.5rem]">
          <span className="block text-white">{formHeading}.</span>
          <span className="block text-white/65">
            {formSubheading}
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:text-base">
          This form saves mix metadata to Supabase and uploads selected media to
          R2.
        </p>
      </section>

      {status ? (
        <section className="mt-8">
          <div
            className={[
              "rounded-2xl border px-5 py-4 text-sm",
              status.tone === "success"
                ? "border-[var(--accent)]/25 bg-[var(--accent)]/8 text-white/82"
                : status.tone === "error"
                  ? "border-[rgba(255,255,255,0.14)] bg-[rgba(120,22,18,0.22)] text-white/82"
                  : "border-white/10 bg-black/20 text-white/72",
            ].join(" ")}
          >
            {status.message}
          </div>
        </section>
      ) : null}

      <section className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7">
          <div className="panel p-6 sm:p-7">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
              {editingId ? "Editing record" : "Mix record"}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-white/45">
                    Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Process / Steel 001"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-white/45">
                      Slug
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateSlug}
                      className="text-[11px] uppercase tracking-[0.18em] text-white/45 transition hover:text-white/70"
                    >
                      Generate from title
                    </button>
                  </div>

                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="process-steel-001"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/20"
                  />

                  <div className="mt-2 text-xs text-white/40">
                    Effective slug:{" "}
                    <span className="text-white/65">{resolvedSlug || "—"}</span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-white/45">
                    Date
                  </label>
                  <input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="March 2026"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-white/45">
                    Runtime
                  </label>
                  <input
                    value={runtime}
                    onChange={(e) => setRuntime(e.target.value)}
                    placeholder="58 min"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-white/45">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A late-night session built around tension, movement, and long-form transitions..."
                  rows={5}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/25 focus:border-white/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-white/45">
                  Tags (comma separated)
                </label>
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="melodic techno, dark, driving"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/20"
                />

                {parsedTags.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {parsedTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/10 bg-black/30 px-3 py-[6px] text-[11px] uppercase tracking-[0.18em] text-white/55"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-white/45">
                  Tracklist (one track per line)
                </label>
                <textarea
                  value={tracklistInput}
                  onChange={(e) => setTracklistInput(e.target.value)}
                  placeholder={`Intro / Unreleased
Artist Name — First Track
Artist Name — Second Track`}
                  rows={8}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/25 focus:border-white/20"
                />

                {parsedTracklist.length > 0 ? (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-white/45">
                      Parsed tracklist
                    </div>

                    <ol className="grid gap-2">
                      {parsedTracklist.map((track, index) => (
                        <li
                          key={`${track}-${index}`}
                          className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                        >
                          <span className="mt-[1px] w-7 shrink-0 text-[11px] uppercase tracking-[0.18em] text-white/35">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm text-white/70">{track}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-white/45">
                    Audio file
                  </label>
                  <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20 px-4 py-6 text-sm text-white/50 transition hover:border-white/20 hover:text-white/70">
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setAudioFile(file);
                        setAudioFileName(file?.name ?? null);
                      }}
                    />
                    {audioFileName || "Choose audio file"}
                  </label>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-white/45">
                    Cover image
                  </label>
                  <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20 px-4 py-6 text-sm text-white/50 transition hover:border-white/20 hover:text-white/70">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setCoverFile(file);
                        setCoverFileName(file?.name ?? null);
                      }}
                    />
                    {coverFileName || "Choose cover image"}
                  </label>
                </div>
              </div>

              <div>
                <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-white/45">
                  Publishing
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/75">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="h-4 w-4 accent-white"
                    />
                    Featured
                  </label>

                  <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/75">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="h-4 w-4 accent-white"
                    />
                    Published
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] px-5 py-3 text-sm font-medium text-white transition hover:border-[var(--accent)] hover:bg-white/[0.10] disabled:opacity-60"
                >
                  {submitLabel}
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  disabled={busy}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-black/20 px-5 py-3 text-sm text-white/70 transition hover:border-white/20 hover:text-white disabled:opacity-60"
                >
                  {editingId ? "Cancel edit" : "Clear form"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="panel p-6 sm:p-7">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
              Preview
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-5">
              {coverFileName ? (
                <div className="mb-5 flex h-44 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-sm text-white/45">
                  {coverFileName}
                </div>
              ) : (
                <div className="mb-5 flex h-44 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-sm text-white/30">
                  Cover preview placeholder
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-white/45">
                <span>{date || "Date"}</span>
                <span className="text-white/20">•</span>
                <span>{runtime || "Runtime"}</span>
              </div>

              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">
                {title || "Mix title"}
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-white/65">
                {description || "Description preview will appear here."}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {parsedTags.length > 0 ? (
                  parsedTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/10 bg-black/30 px-3 py-[6px] text-[11px] uppercase tracking-[0.18em] text-white/50"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-white/35">No tags yet</span>
                )}
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/45">
                Slug: {resolvedSlug || "—"}
              </div>

              <div className="mt-6 grid gap-2 text-[11px] uppercase tracking-[0.18em] text-white/40">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                  Mode: {editingId ? "Editing existing" : "Creating new"}
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                  Featured: {featured ? "Yes" : "No"}
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                  Published: {published ? "Yes" : "No"}
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                  Audio:{" "}
                  {audioFileName
                    ? `${audioFileName} (new)`
                    : existingAudioUrl
                      ? "Existing file attached"
                      : "Not selected"}
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                  Cover:{" "}
                  {coverFileName
                    ? `${coverFileName} (new)`
                    : existingCoverImageUrl
                      ? "Existing image attached"
                      : "Not selected"}
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-5 text-[11px] uppercase tracking-[0.18em] text-white/45">
              Saving metadata to the live archive
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="panel p-6 sm:p-7">
          <div className="flex flex-col gap-5">
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                Existing mixes
              </div>
              <div className="mt-2 text-xl font-semibold tracking-tight text-white">
                Manage archive entries
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search title, slug, or date"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/20 sm:max-w-sm"
                />

                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["all", "All"],
                      ["published", "Published"],
                      ["draft", "Drafts"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setStatusFilter(value)}
                      className={[
                        "rounded-xl border px-4 py-2 text-sm transition",
                        statusFilter === value
                          ? "border-[var(--accent)]/35 bg-[var(--accent)]/10 text-white"
                          : "border-white/10 bg-black/20 text-white/70 hover:border-white/20 hover:text-white",
                      ].join(" ")}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={loadMixes}
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/70 transition hover:border-white/20 hover:text-white"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-white/38">
            <span>{mixes.length} total</span>
            <span className="text-white/20">•</span>
            <span>{visibleMixes.length} visible</span>
            <span className="text-white/20">•</span>
            <span>{mixes.filter((mix) => mix.published).length} published</span>
          </div>

          <div className="mt-6 grid gap-3">
            {loadingMixes ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/45">
                Loading mixes…
              </div>
            ) : mixes.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/45">
                No mixes yet.
              </div>
            ) : visibleMixes.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/45">
                No mixes match the current filters.
              </div>
            ) : (
              visibleMixes.map((mix) => (
                <div
                  key={mix.id}
                  className={[
                    "rounded-2xl border bg-black/20 p-5 transition",
                    editingId === mix.id
                      ? "border-[var(--accent)]/30 shadow-[0_0_0_1px_rgba(225,6,0,0.12)]"
                      : "border-white/10",
                  ].join(" ")}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/40">
                        {[mix.date_label || "No date", mix.runtime || "No runtime"].map(
                          (part, index) => (
                            <div
                              key={`${mix.id}-${part}-${index}`}
                              className="flex items-center gap-2"
                            >
                              {index > 0 ? (
                                <span className="text-white/20">•</span>
                              ) : null}
                              <span>{part}</span>
                            </div>
                          )
                        )}
                      </div>

                      <div className="mt-3 text-lg font-medium text-white">
                        {mix.title}
                      </div>

                    <div className="mt-2 text-xs text-white/45">
                      /listen/{mix.slug}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleQuickUpdate(mix, {
                            published: !mix.published,
                          })
                        }
                        disabled={updatingId === mix.id || deletingId === mix.id}
                        className={[
                          "rounded-xl border px-3 py-2 text-[11px] uppercase tracking-[0.18em] transition disabled:opacity-60",
                          mix.published
                            ? "border-[var(--accent)]/25 bg-[var(--accent)]/8 text-white/78 hover:border-[var(--accent)]/40"
                            : "border-white/10 bg-black/20 text-white/65 hover:border-white/20 hover:text-white",
                        ].join(" ")}
                      >
                        {updatingId === mix.id && !mix.published
                          ? "Updating…"
                          : mix.published
                            ? "Unpublish"
                            : "Publish"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleQuickUpdate(mix, {
                            featured: !mix.featured,
                          })
                        }
                        disabled={updatingId === mix.id || deletingId === mix.id}
                        className={[
                          "rounded-xl border px-3 py-2 text-[11px] uppercase tracking-[0.18em] transition disabled:opacity-60",
                          mix.featured
                            ? "border-[var(--accent)]/25 bg-[var(--accent)]/8 text-white/78 hover:border-[var(--accent)]/40"
                            : "border-white/10 bg-black/20 text-white/65 hover:border-white/20 hover:text-white",
                        ].join(" ")}
                      >
                        {updatingId === mix.id && !mix.featured
                          ? "Updating…"
                          : mix.featured
                            ? "Unfeature"
                            : "Feature"}
                      </button>

                      <Link
                        href={`/listen/${mix.slug}`}
                        target="_blank"
                        className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white/65 transition hover:border-white/20 hover:text-white"
                      >
                        Open
                      </Link>
                    </div>

                      <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em]">
                        <span className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-[6px] text-white/50">
                          {mix.published ? "Published" : "Draft"}
                        </span>

                        {mix.featured ? (
                          <span className="rounded-md border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-[6px] text-white/70">
                            Featured
                          </span>
                        ) : null}

                        {mix.audio_url ? (
                          <span className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-[6px] text-white/50">
                            Audio
                          </span>
                        ) : null}

                        {mix.cover_image_url ? (
                          <span className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-[6px] text-white/50">
                            Cover
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditMix(mix)}
                        disabled={busy || updatingId === mix.id}
                        className="rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/70 transition hover:border-white/20 hover:text-white disabled:opacity-60"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMix(mix.id, mix.title)}
                        disabled={deletingId === mix.id || updatingId === mix.id}
                        className="rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/70 transition hover:border-white/20 hover:text-white disabled:opacity-60"
                      >
                        {deletingId === mix.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
