"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useNowPlaying } from "../lib/useNowPlaying";
import Equaliser from "./Equaliser";
import { ArrowForward } from "./icons";

const ease = [0.22, 1, 0.36, 1] as const;

// Quiet one-line version for the home page; the full deck lives on /music.
export default function NowPlayingStrip() {
  const data = useNowPlaying();
  if (!data) return null;
  const { track, isPlaying } = data;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease }}
      className="border-b border-faint"
    >
      <Link
        href="/music"
        className="group flex items-center gap-3 px-4 sm:px-8 md:px-[52px] py-4 no-underline"
      >
        <span className="flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] uppercase text-muted shrink-0">
          {isPlaying ? (
            <>
              <Equaliser />
              <span className="text-green">Now playing</span>
            </>
          ) : (
            "Last played"
          )}
        </span>

        <span className="relative size-6 shrink-0 bg-surface overflow-hidden">
          {track.image && (
            <Image src={track.image} alt="" fill unoptimized className="object-cover" />
          )}
        </span>

        <span className="text-[13px] text-mid truncate min-w-0 flex-1">
          <span className="font-semibold text-ink transition-colors duration-150 group-hover:text-green">
            {track.title}
          </span>{" "}
          · {track.artists}
        </span>

        <span className="hidden sm:flex items-center gap-2 text-[12px] text-muted shrink-0 transition-colors duration-150 group-hover:text-ink">
          music
          <ArrowForward size={12} />
        </span>
      </Link>
    </motion.div>
  );
}
