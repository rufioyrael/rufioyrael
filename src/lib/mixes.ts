export type Mix = {
  slug: string;
  title: string;
  date: string;
  runtime: string;
  tags: string[];
  description: string;
  tracklist: string[];
  featured?: boolean;
};

export const mixes: Mix[] = [
  {
    slug: "process-steel-001",
    title: "Process / Steel 001",
    date: "March 2026",
    runtime: "58 min",
    tags: ["melodic techno", "dark", "driving"],
    description:
      "A late-night session built around tension, movement, and long-form transitions.",
    tracklist: [
      "Intro / Unreleased",
      "Artist Name — First Track",
      "Artist Name — Second Track",
      "Artist Name — Third Track",
      "Artist Name — Fourth Track",
      "Artist Name — Fifth Track",
      "Closing Track / ID",
    ],
    featured: true,
  },
  {
    slug: "ember-line-session",
    title: "Ember Line Session",
    date: "February 2026",
    runtime: "47 min",
    tags: ["drum & bass", "atmospheric"],
    description:
      "Fast, clean selections with darker low-end and restrained pacing.",
    tracklist: [
      "Intro Pad / ID",
      "Artist Name — Track One",
      "Artist Name — Track Two",
      "Artist Name — Track Three",
      "Artist Name — Track Four",
      "Artist Name — Track Five",
    ],
  },
  {
    slug: "after-hours-study",
    title: "After Hours Study",
    date: "January 2026",
    runtime: "62 min",
    tags: ["minimal", "hypnotic"],
    description:
      "A slower, more patient mix focused on texture and long transitions.",
    tracklist: [
      "Opening Tone / ID",
      "Artist Name — Track One",
      "Artist Name — Track Two",
      "Artist Name — Track Three",
      "Artist Name — Track Four",
      "Artist Name — Track Five",
      "Artist Name — Track Six",
    ],
  },
  {
    slug: "warehouse-notes-002",
    title: "Warehouse Notes 002",
    date: "December 2025",
    runtime: "54 min",
    tags: ["melodic techno", "industrial"],
    description:
      "Percussive framework with darker melodic phrasing and a heavier closing stretch.",
    tracklist: [
      "Intro Sequence / ID",
      "Artist Name — Track One",
      "Artist Name — Track Two",
      "Artist Name — Track Three",
      "Artist Name — Track Four",
      "Artist Name — Track Five",
      "Finale / ID",
    ],
  },
];