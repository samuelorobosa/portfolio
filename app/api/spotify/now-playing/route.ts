import { getNowPlaying } from "../../../lib/spotify";

export const dynamic = "force-dynamic";

export async function GET() {
  const nowPlaying = await getNowPlaying();
  return Response.json(nowPlaying, {
    // Let the CDN absorb polling so visitors never hit Spotify directly.
    headers: {
      "Cache-Control": "public, s-maxage=20, stale-while-revalidate=40",
    },
  });
}
