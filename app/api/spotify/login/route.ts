import { NextResponse, type NextRequest } from "next/server";
import { SPOTIFY_REDIRECT_URI, SPOTIFY_SCOPES } from "../../../lib/spotify";

// One-time local login used to mint SPOTIFY_REFRESH_TOKEN. Never exposed in
// production.
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) {
    return new Response("Set SPOTIFY_CLIENT_ID in .env.local first.", {
      status: 500,
    });
  }

  // The state cookie must be set on the same origin Spotify redirects back to.
  const redirect = new URL(SPOTIFY_REDIRECT_URI);
  if (request.headers.get("host") !== redirect.host) {
    return NextResponse.redirect(`${redirect.origin}/api/spotify/login`);
  }

  const state = crypto.randomUUID();
  const authorize = new URL("https://accounts.spotify.com/authorize");
  authorize.search = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: SPOTIFY_SCOPES,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state,
  }).toString();

  const response = NextResponse.redirect(authorize);
  response.cookies.set("spotify_auth_state", state, {
    httpOnly: true,
    maxAge: 600,
    path: "/api/spotify",
  });
  return response;
}
