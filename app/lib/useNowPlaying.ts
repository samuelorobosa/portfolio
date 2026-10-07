"use client";

import { useEffect, useState } from "react";
import type { NowPlaying } from "./spotify";

const POLL_MS = 30_000;

export function useNowPlaying(): NowPlaying | null {
  const [data, setData] = useState<NowPlaying | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/spotify/now-playing");
        if (!res.ok) return;
        const next: NowPlaying | null = await res.json();
        if (!cancelled) setData(next);
      } catch {
        // Keep showing the last known track.
      }
    }

    load();
    const timer = setInterval(load, POLL_MS);
    document.addEventListener("visibilitychange", load);
    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", load);
    };
  }, []);

  return data;
}
