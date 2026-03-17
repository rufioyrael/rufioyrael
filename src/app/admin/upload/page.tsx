"use client";

import { useMemo, useState } from "react";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminUploadPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState("");
  const [runtime, setRuntime] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tracklistInput, setTracklistInput] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [coverFileName, setCoverFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

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

  function handleGenerateSlug() {
    setSlug(slugify(title));
  }

  function handleClear() {
    setTitle("");
    setSlug("");
    setDate("");
    setRuntime("");
    setDescription("");
    setTagsInput("");
    setTracklistInput("");
    setFeatured(false);
    setPublished(false);
    setAudioFileName(null);
    setCoverFileName(null);
    setStatus(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) {
      setStatus("Missing title.");
      return;
    }

    if (!resolvedSlug.trim()) {
      setStatus("Missing slug.");
      return;
    }

    if (!date.trim()) {
      setStatus("Missing date.");
      return;
    }

    if (!runtime.trim()) {
      setStatus("Missing runtime.");
      return;
    }

    if (!description.trim()) {
      setStatus("Missing description.");
      return;
    }

    setStatus(
      "Form structure is ready. Backend save/upload wiring is not connected yet."
    );

    // Later, this is where you'll map the form into your Mix payload:
    //
    // const payload = {
    //   slug: resolvedSlug,
    //   title,
    //   date,
    //   runtime,
    //   description,
    //   tags: parsedTags,
    //   tracklist: parsedTracklist,
    //   featured,
    //   published,
    //   // audioUrl and coverImageUrl will come from real uploads later
    // };
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
      <section className="max-w-3xl">
        <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
          Admin
        </div>

        <h1 className="mt-4 text-[2.4rem] font-semibold leading-[1.01] tracking-tight sm:text-[3.5rem]">
          <span className="block text-white">Upload mix.</span>
          <span className="block text-white/65">
            Prepare metadata for the public archive.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:text-base">
          This form is now aligned with the archive and mix-detail page structure.
          Save and upload behavior can be wired after the schema is finalized.
        </p>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* FORM */}
        <div className="lg:col-span-7">
          <div className="panel p-6 sm:p-7">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
              Mix record
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-6">
              {/* CORE IDENTITY */}
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
                    <span className="text-white/65">
                      {resolvedSlug || "—"}
                    </span>
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

              {/* DESCRIPTION */}
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

              {/* TAGS */}
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

              {/* TRACKLIST */}
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
                          <span className="text-sm text-white/70">
                            {track}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </div>

              {/* FILES */}
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
                      onChange={(e) =>
                        setAudioFileName(e.target.files?.[0]?.name ?? null)
                      }
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
                      onChange={(e) =>
                        setCoverFileName(e.target.files?.[0]?.name ?? null)
                      }
                    />
                    {coverFileName || "Choose cover image"}
                  </label>
                </div>
              </div>

              {/* PUBLISHING */}
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

              {/* ACTIONS */}
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] px-5 py-3 text-sm font-medium text-white transition hover:border-[var(--accent)] hover:bg-white/[0.10]"
                >
                  Save structure
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-black/20 px-5 py-3 text-sm text-white/70 transition hover:border-white/20 hover:text-white"
                >
                  Clear form
                </button>
              </div>

              {status ? (
                <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
                  {status}
                </div>
              ) : null}
            </form>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="lg:col-span-5">
          <div className="panel p-6 sm:p-7">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
              Preview
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-5">
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
                  Featured: {featured ? "Yes" : "No"}
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                  Published: {published ? "Yes" : "No"}
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                  Audio: {audioFileName || "Not selected"}
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                  Cover: {coverFileName || "Not selected"}
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-5 text-[11px] uppercase tracking-[0.18em] text-white/45">
              UI aligned with archive model
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}