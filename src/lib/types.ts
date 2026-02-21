export type TracklistItem = {
  startSec?: number;
  artist: string;
  track: string;
  note?: string;
};

export type Mix = {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  date: string;
  audio_url: string;
  cover_url?: string | null;
  tags?: string[] | null;
  description?: string | null;
  tracklist?: TracklistItem[] | null;
  duration_sec?: number | null;
};
