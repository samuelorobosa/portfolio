"use client";

import { useState } from "react";
import Image from "next/image";
import { MotionConfig, motion } from "motion/react";
import type { ListeningProfiles, TimeRange } from "../lib/spotify";
import Equaliser from "./Equaliser";

const RANGE_LABELS: Record<TimeRange, string> = {
  short_term: "4 weeks",
  medium_term: "6 months",
  long_term: "Past year",
};

const RANGES = Object.keys(RANGE_LABELS) as TimeRange[];

const VU_SEGMENTS = 20;

const ease = [0.22, 1, 0.36, 1] as const;

const stagger = (each: number) => ({
  hidden: {},
  show: { transition: { staggerChildren: each } },
});

const tile = {
  hidden: { opacity: 0, scale: 0.8, rotate: -4 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 140, damping: 15 },
  },
} as const;

const row = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease } },
} as const;

function formatRuntime(ms: number) {
  const minutes = Math.round(ms / 60_000);
  const hours = Math.floor(minutes / 60);
  return hours ? `${hours}h ${String(minutes % 60).padStart(2, "0")}m` : `${minutes}m`;
}

function formatDuration(ms: number) {
  const totalSeconds = Math.round(ms / 1000);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${Math.floor(totalSeconds / 60)}:${seconds}`;
}

interface Props {
  profiles: ListeningProfiles;
}

export default function MusicProfile({ profiles }: Props) {
  const [range, setRange] = useState<TimeRange>("short_term");
  const { artists, tracks, shares, stats } = profiles[range];
  const maxShare = shares[0]?.count ?? 1;
  // The mosaic only tiles cleanly with 9 or 5 artists (#1 takes four cells).
  const mosaic = artists.slice(0, artists.length >= 9 ? 9 : artists.length >= 5 ? 5 : artists.length);
  const statTiles = [
    { label: `Top ${stats.trackCount} runtime`, value: formatRuntime(stats.totalMs) },
    {
      label: "Average track",
      value: formatDuration(stats.trackCount ? stats.totalMs / stats.trackCount : 0),
    },
    {
      label: stats.longest ? `Longest: ${stats.longest.title}` : "Longest",
      value: formatDuration(stats.longest?.durationMs ?? 0),
    },
  ];

  return (
    <MotionConfig reducedMotion="user">
      {/* Ticker of the artists on rotation; duplicated once for a seamless loop */}
      {artists.length > 0 && (
        <div className="overflow-hidden border-b border-faint py-5 sm:py-7" aria-hidden>
          <div key={range} className="marquee flex w-max">
            {[...artists, ...artists].map((artist, i) => (
              <span
                key={i}
                className={`flex items-center gap-8 sm:gap-12 pr-8 sm:pr-12 text-[clamp(44px,9vw,120px)] font-extrabold tracking-[-0.05em] leading-none uppercase whitespace-nowrap ${
                  i % 2 ? "text-outline" : "text-ink"
                }`}
              >
                {artist.name}
                <span className="text-green text-[0.4em] [-webkit-text-stroke:0]">
                  ✦
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      <section className="px-4 sm:px-8 md:px-[52px] py-10 sm:py-12 md:py-[52px] border-b border-faint">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6 mb-10">
          <h1 className="text-[clamp(52px,10vw,132px)] font-extrabold tracking-[-0.06em] leading-[0.85] text-ink">
            On <span className="text-outline">repeat</span>
            <span className="text-green">.</span>
          </h1>

          <div className="flex gap-2" role="group" aria-label="Time range">
            {RANGES.map((key) => {
              const active = key === range;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setRange(key)}
                  className={`relative text-[11px] font-bold tracking-[0.08em] uppercase px-4 py-2 cursor-pointer transition-colors duration-200 ${
                    active ? "text-bg" : "text-muted hover:text-ink"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="range-pill"
                      className="absolute inset-0 bg-green"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{RANGE_LABELS[key]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div key={range} className="flex flex-col gap-14 md:gap-[72px]">
          {/* Artist mosaic: #1 takes a 2×2 tile */}
          {mosaic.length > 0 && (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-2"
              variants={stagger(0.06)}
              initial="hidden"
              animate="show"
            >
              {mosaic.map((artist, i) => (
                <motion.a
                  key={artist.id}
                  href={artist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={tile}
                  whileHover={{ scale: 1.04, rotate: i % 2 ? 1.5 : -1.5, zIndex: 1 }}
                  className={`group relative aspect-square overflow-hidden bg-surface border border-faint no-underline transition-colors duration-200 hover:border-green ${
                    i === 0 ? "col-span-2 row-span-2" : ""
                  }`}
                >
                  {artist.image && (
                    <Image
                      src={artist.image}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/30" />

                  <span
                    className={`absolute top-2 left-3 font-extrabold tracking-[-0.05em] leading-none text-outline transition-colors duration-200 group-hover:text-green group-hover:[-webkit-text-stroke:0] ${
                      i === 0 ? "text-[clamp(64px,11vw,140px)]" : "text-[clamp(32px,4.5vw,56px)]"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {i === 0 && (
                    <span className="absolute top-4 right-4 flex items-center gap-2 bg-bg/80 px-3 py-[6px] text-[10px] font-bold tracking-[0.1em] uppercase text-green">
                      <Equaliser />
                      Most played
                    </span>
                  )}

                  <span
                    className={`absolute inset-x-0 bottom-0 p-3 sm:p-4 font-extrabold tracking-[-0.03em] text-ink leading-[1.05] ${
                      i === 0
                        ? "text-[clamp(28px,5vw,60px)] sm:p-6"
                        : "text-[15px] sm:text-[18px] truncate"
                    }`}
                  >
                    {artist.name}
                  </span>
                </motion.a>
              ))}
            </motion.div>
          )}

          {stats.trackCount > 0 && (
            <motion.dl
              className="grid sm:grid-cols-3 gap-x-8 gap-y-8 border-y border-faint py-8 m-0"
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
            >
              {statTiles.map(({ label, value }) => (
                <motion.div key={label} variants={row} className="flex flex-col-reverse gap-2 min-w-0">
                  <dt className="text-[11px] font-bold tracking-[0.14em] uppercase text-muted truncate">
                    {label}
                  </dt>
                  <dd className="m-0 text-[clamp(44px,6vw,84px)] font-extrabold tracking-[-0.05em] leading-none text-ink tabular-nums">
                    {value}
                  </dd>
                </motion.div>
              ))}
            </motion.dl>
          )}

          <div className="grid md:grid-cols-2 gap-14 md:gap-[52px]">
            {tracks.length > 0 && (
              <div className="min-w-0">
                <h2 className="text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-5">
                  Top tracks
                </h2>
                <motion.ol
                  className="flex flex-col list-none m-0 p-0"
                  variants={stagger(0.05)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                >
                  {tracks.map((track, i) => (
                    <motion.li key={track.id} variants={row} whileHover={{ x: 8 }}>
                      <a
                        href={track.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 py-3 border-t border-faint no-underline"
                      >
                        <span className="w-9 shrink-0 flex items-center">
                          <span className="text-[26px] font-extrabold tracking-[-0.05em] leading-none text-outline tabular-nums group-hover:hidden">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <Equaliser className="h-[18px] hidden group-hover:flex" />
                        </span>
                        <div className="record-on-hover relative size-12 shrink-0 bg-surface overflow-hidden">
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
                        <div className="flex flex-col gap-[3px] min-w-0 flex-1">
                          <span className="text-[16px] font-extrabold tracking-[-0.02em] text-ink truncate transition-colors duration-150 group-hover:text-green">
                            {track.title}
                          </span>
                          <span className="text-[12px] text-muted truncate">
                            {track.artists}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted tabular-nums shrink-0">
                          {formatDuration(track.durationMs)}
                        </span>
                      </a>
                    </motion.li>
                  ))}
                </motion.ol>
              </div>
            )}

            {/* VU meters: lit segments scale with tracks per artist */}
            {shares.length > 0 && (
              <div className="min-w-0">
                <h2 className="text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-5">
                  Who fills my top {stats.trackCount}
                </h2>
                <ul className="flex flex-col gap-5 list-none m-0 p-0 border-t border-faint pt-6">
                  {shares.map((share, g) => {
                    const lit = Math.max(
                      1,
                      Math.round((share.count / maxShare) * VU_SEGMENTS)
                    );
                    return (
                      <li key={share.name} className="flex flex-col gap-2">
                        <div className="flex justify-between items-baseline gap-4">
                          <span className="text-[15px] font-extrabold tracking-[-0.01em] uppercase text-ink truncate">
                            {share.name}
                          </span>
                          <span className="text-[11px] text-muted tabular-nums shrink-0">
                            {share.count} {share.count === 1 ? "track" : "tracks"}
                          </span>
                        </div>
                        <div className="flex gap-[3px] h-4" aria-hidden>
                          {Array.from({ length: VU_SEGMENTS }, (_, s) =>
                            s < lit ? (
                              <span
                                key={s}
                                className="vu-seg flex-1 bg-green origin-bottom"
                                style={{
                                  opacity: 0.4 + (0.6 * (s + 1)) / lit,
                                  animationDelay: `${g * 70 + s * 28}ms`,
                                }}
                              />
                            ) : (
                              <span key={s} className="flex-1 bg-faint" />
                            )
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <p className="text-[11px] text-muted">
            Data from{" "}
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mid hover:text-ink transition-colors duration-150"
            >
              Spotify
            </a>
            , refreshed hourly.
          </p>
        </div>
      </section>
    </MotionConfig>
  );
}
