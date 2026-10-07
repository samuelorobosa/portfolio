import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Articles used to live at dev.to-style slugs with a random suffix.
  async redirects() {
    return [
      "lazy-loading-with-intersection-observer-api-4oi4",
      "how-to-handle-linkedin-and-twitter-link-previews-23eg",
      "parameters-and-arguments-the-difference-36ko",
      "before-you-start-coding-e2b",
    ].map((old) => ({
      source: `/articles/${old}`,
      destination: `/articles/${old.replace(/-[0-9a-z]+$/, "")}`,
      permanent: true,
    }));
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.scdn.co" },
      { protocol: "https", hostname: "**.spotifycdn.com" },
    ],
  },
};

export default nextConfig;
