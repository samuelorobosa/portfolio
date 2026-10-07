"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useNowPlaying } from "../lib/useNowPlaying";
import Equaliser from "./Equaliser";
import { LinkExternal } from "./icons";
import SectionLabel from "./SectionLabel";

const ease = [0.22, 1, 0.36, 1] as const;

// Backdrop equaliser: deterministic per-bar timing so it looks random
// without differing between renders.
const BACKDROP_BARS = Array.from({ length: 48 }, (_, i) => ({
  duration: 0.7 + ((i * 37) % 10) / 10,
  delay: -((i * 53) % 17) / 10,
}));

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${Math.floor(totalSeconds / 60)}:${seconds}`;
}

function Progress({ startedAt, durationMs }: { startedAt: number; durationMs: number }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const elapsed = Math.min(Math.max(now - startedAt, 0), durationMs);

  return (
    <div className="flex items-center gap-3 text-[11px] text-muted tabular-nums max-w-[420px]">
      <span>{formatTime(elapsed)}</span>
      <div className="h-[3px] flex-1 bg-faint overflow-hidden">
        <div
          className="h-full bg-green origin-left transition-transform duration-1000 ease-linear"
          style={{ transform: `scaleX(${elapsed / durationMs})` }}
        />
      </div>
      <span>{formatTime(durationMs)}</span>
    </div>
  );
}

export default function NowPlaying() {
  const data = useNowPlaying();

  if (!data) return null;
  const { track, isPlaying, startedAt } = data;

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative isolate overflow-hidden px-4 sm:px-8 md:px-[52px] py-10 sm:py-12 md:py-[52px] border-b border-faint">
        {/* Ambient glow pulled from the album art */}
        <AnimatePresence>
          {track.image && (
            <motion.div
              key={track.image}
              className="pointer-events-none absolute -inset-24 -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: isPlaying ? 0.32 : 0.14 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              aria-hidden
            >
              <Image
                src={track.image}
                alt=""
                fill
                unoptimized
                className="object-cover blur-[90px] saturate-150"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isPlaying && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 flex items-end gap-[3px] h-28 opacity-[0.09]"
            aria-hidden
          >
            {BACKDROP_BARS.map(({ duration, delay }, i) => (
              <span
                key={i}
                className="eq-bar flex-1 h-full bg-green origin-bottom"
                style={{
                  animationDuration: `${duration}s`,
                  animationDelay: `${delay}s`,
                }}
              />
            ))}
          </div>
        )}

        <SectionLabel>Listening</SectionLabel>

        <motion.a
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-10 no-underline"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          {/* Sleeve with the record sliding out */}
          <div className="relative size-40 sm:size-52 shrink-0 mr-20 sm:mr-24">
            <motion.div
              className="absolute inset-[3%]"
              animate={{ x: isPlaying ? "48%" : "14%" }}
              transition={{ type: "spring", stiffness: 70, damping: 14 }}
            >
              <div
                className="vinyl relative size-full rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
                data-paused={!isPlaying}
              >
                <div className="absolute inset-[31%] rounded-full overflow-hidden bg-surface">
                  {track.image && (
                    <Image
                      src={track.image}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="absolute inset-[48%] rounded-full bg-bg" />
              </div>
            </motion.div>

            <AnimatePresence mode="popLayout">
              <motion.div
                key={track.id}
                className="absolute inset-0 bg-surface overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
                initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotate: 6 }}
                transition={{ type: "spring", stiffness: 120, damping: 16 }}
                whileHover={{ rotate: -3, scale: 1.03 }}
              >
                {track.image && (
                  <Image
                    src={track.image}
                    alt={`${track.album} cover`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-4 min-w-0 flex-1">
            <span className="flex items-center gap-[10px] text-[11px] font-bold tracking-[0.14em] uppercase text-muted">
              {isPlaying ? (
                <>
                  <Equaliser className="h-[14px]" />
                  <span className="text-green">Now playing</span>
                </>
              ) : (
                "Last played"
              )}
            </span>

            {/* Title words rise out of a mask whenever the track changes */}
            <h2
              key={`title-${track.id}`}
              className="text-[clamp(34px,6.4vw,84px)] font-extrabold tracking-[-0.045em] leading-[0.95] text-ink transition-colors duration-200 group-hover:text-green"
            >
              {track.title.split(" ").map((word, i) => (
                <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em] mr-[0.22em]">
                  <motion.span
                    className="inline-block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.7, ease }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h2>

            <span className="flex items-center gap-2 text-[15px] sm:text-[17px] font-medium text-mid">
              {track.artists}
              <LinkExternal className="text-green shrink-0" size={13} />
            </span>

            {isPlaying && startedAt !== undefined && (
              <Progress
                key={`progress-${track.id}`}
                startedAt={startedAt}
                durationMs={track.durationMs}
              />
            )}
          </div>
        </motion.a>

      </section>
    </MotionConfig>
  );
}
