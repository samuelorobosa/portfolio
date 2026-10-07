import { unstable_cache } from "next/cache";

// Spotify matches redirect URIs exactly and rejects "localhost", so the
// one-time login has to run on this origin.
export const SPOTIFY_REDIRECT_URI = "http://127.0.0.1:3000/api/spotify/callback";
export const SPOTIFY_SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-top-read",
].join(" ");
export const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

const API = "https://api.spotify.com/v1";

export const TIME_RANGES = ["short_term", "medium_term", "long_term"] as const;
export type TimeRange = (typeof TIME_RANGES)[number];

export interface Track {
  id: string;
  title: string;
  artists: string;
  album: string;
  image: string | null;
  url: string;
  durationMs: number;
}

export interface Artist {
  id: string;
  name: string;
  image: string | null;
  url: string;
}

export interface ArtistShare {
  name: string;
  count: number;
}

export interface ListeningStats {
  trackCount: number;
  totalMs: number;
  longest: { title: string; durationMs: number } | null;
}

export interface ListeningProfile {
  artists: Artist[];
  tracks: Track[];
  /** Artists ranked by how many of the top tracks they appear on. */
  shares: ArtistShare[];
  stats: ListeningStats;
}

export type ListeningProfiles = Record<TimeRange, ListeningProfile>;

export interface NowPlaying {
  isPlaying: boolean;
  track: Track;
  /** Epoch ms the current track started, so clients can tick progress locally. */
  startedAt?: number;
  playedAt?: string;
}

interface SpotifyImage {
  url: string;
  width: number | null;
}

interface SpotifyArtist {
  id: string;
  name: string;
  images?: SpotifyImage[];
  external_urls: { spotify: string };
}

interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  artists: { name: string }[];
  album: { name: string; images: SpotifyImage[] };
  external_urls: { spotify: string };
}

export function spotifyBasicAuth(): string | null {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) return null;
  return `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  const auth = spotifyBasicAuth();
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!auth || !refreshToken) return null;
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: auth,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data: { access_token: string; expires_in: number } = await res.json();
  cachedToken = {
    value: data.access_token,
    // Refresh a minute early so a token never expires mid-request.
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.value;
}

async function spotifyGet(path: string): Promise<Response | null> {
  const token = await getAccessToken();
  if (!token) return null;
  return fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}

// Spotify lists images largest first; take the smallest one that still
// covers the rendered size.
function pickImage(images: SpotifyImage[] | undefined, minWidth: number) {
  if (!images?.length) return null;
  const fits = images.filter((img) => (img.width ?? 0) >= minWidth);
  return (fits.at(-1) ?? images[0]).url;
}

function toTrack(track: SpotifyTrack): Track {
  return {
    id: track.id,
    title: track.name,
    artists: track.artists.map((a) => a.name).join(", "),
    album: track.album.name,
    image: pickImage(track.album.images, 300),
    url: track.external_urls.spotify,
    durationMs: track.duration_ms,
  };
}

function toArtist(artist: SpotifyArtist): Artist {
  return {
    id: artist.id,
    name: artist.name,
    image: pickImage(artist.images, 320),
    url: artist.external_urls.spotify,
  };
}

// Spotify no longer returns genres or popularity, so the listening picture
// is derived from the top tracks themselves.
function countArtists(tracks: SpotifyTrack[]): ArtistShare[] {
  const counts = new Map<string, number>();
  for (const track of tracks) {
    for (const { name } of track.artists) {
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

async function getTopItems<T>(
  type: "artists" | "tracks",
  range: TimeRange,
  limit: number
): Promise<T[]> {
  const res = await spotifyGet(
    `/me/top/${type}?time_range=${range}&limit=${limit}`
  );
  // Throw rather than return empty so unstable_cache never stores a failure.
  if (!res?.ok) throw new Error(`Spotify top ${type} failed`);
  const data: { items: T[] } = await res.json();
  return data.items;
}

async function fetchProfile(range: TimeRange): Promise<ListeningProfile> {
  const [artists, tracks] = await Promise.all([
    getTopItems<SpotifyArtist>("artists", range, 9),
    getTopItems<SpotifyTrack>("tracks", range, 50),
  ]);
  const longest = tracks.reduce<SpotifyTrack | null>(
    (max, t) => (!max || t.duration_ms > max.duration_ms ? t : max),
    null
  );
  return {
    artists: artists.map(toArtist),
    tracks: tracks.slice(0, 10).map(toTrack),
    shares: countArtists(tracks),
    stats: {
      trackCount: tracks.length,
      totalMs: tracks.reduce((sum, t) => sum + t.duration_ms, 0),
      longest: longest && { title: longest.name, durationMs: longest.duration_ms },
    },
  };
}

const getCachedProfiles = unstable_cache(
  async (): Promise<ListeningProfiles> => {
    const [short_term, medium_term, long_term] = await Promise.all(
      TIME_RANGES.map(fetchProfile)
    );
    return { short_term, medium_term, long_term };
  },
  ["spotify-listening-profiles-v2"],
  { revalidate: 3600 }
);

export async function getListeningProfiles(): Promise<ListeningProfiles | null> {
  if (!spotifyBasicAuth() || !process.env.SPOTIFY_REFRESH_TOKEN) return null;
  try {
    return await getCachedProfiles();
  } catch {
    return null;
  }
}

export async function getNowPlaying(): Promise<NowPlaying | null> {
  try {
    const current = await spotifyGet("/me/player/currently-playing");
    if (!current) return null;
    // 204 means nothing is playing; item is null for podcasts and ads.
    if (current.status === 200) {
      const data: {
        is_playing: boolean;
        progress_ms: number | null;
        item: SpotifyTrack | null;
      } = await current.json();
      if (data.is_playing && data.item?.album) {
        return {
          isPlaying: true,
          track: toTrack(data.item),
          startedAt: Date.now() - (data.progress_ms ?? 0),
        };
      }
    }

    const recent = await spotifyGet("/me/player/recently-played?limit=1");
    if (!recent?.ok) return null;
    const data: { items: { track: SpotifyTrack; played_at: string }[] } =
      await recent.json();
    const last = data.items[0];
    if (!last) return null;
    return {
      isPlaying: false,
      track: toTrack(last.track),
      playedAt: last.played_at,
    };
  } catch {
    return null;
  }
}
