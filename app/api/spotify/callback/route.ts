import type { NextRequest } from "next/server";
import {
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_TOKEN_URL,
  spotifyBasicAuth,
} from "../../../lib/spotify";

function text(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }

  const params = request.nextUrl.searchParams;
  const error = params.get("error");
  if (error) return text(`Spotify refused the login: ${error}`, 400);

  const code = params.get("code");
  const state = params.get("state");
  const expected = request.cookies.get("spotify_auth_state")?.value;
  if (!code || !state || state !== expected) {
    return text("State mismatch. Start again at /api/spotify/login.", 400);
  }

  const auth = spotifyBasicAuth();
  if (!auth) {
    return text(
      "Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local, restart the dev server, then start again at /api/spotify/login.",
      500
    );
  }

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: auth,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    return text(`Token exchange failed (${res.status}): ${await res.text()}`, 502);
  }

  const data: { refresh_token: string } = await res.json();
  return text(
    `Add this line to .env.local, then restart the dev server:\n\nSPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`
  );
}
