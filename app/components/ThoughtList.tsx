"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Thought } from "../lib/thoughts";
import { ArrowForward } from "./icons";

const ease = [0.22, 1, 0.36, 1] as const;

interface Props {
  thoughts: Pick<Thought, "slug" | "title" | "kind" | "excerpt" | "readingMinutes">[];
}

export default function ThoughtList({ thoughts }: Props) {
  return (
    <div className="flex flex-col">
      {thoughts.map((thought, i) => (
        <motion.div
          key={thought.slug}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: i * 0.07, duration: 0.45, ease }}
          whileHover={{ x: 8 }}
        >
          <Link
            href={`/thoughts/${thought.slug}`}
            className="group relative grid sm:grid-cols-[180px_1fr_24px] items-start gap-3 sm:gap-6 py-7 border-t border-faint last:border-b no-underline"
          >
            {/* Accent line that draws across the top of the row on hover */}
            <span className="absolute left-0 -top-px h-px w-full bg-green origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />

            <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 sm:mt-1">
              <span className="text-[10px] font-semibold text-muted tracking-[0.06em] uppercase border border-faint px-[9px] py-[3px] w-fit transition-colors duration-200 group-hover:text-bg group-hover:bg-green group-hover:border-green">
                {thought.kind}
              </span>
              <span className="text-[11px] text-muted">
                {thought.readingMinutes} min read
              </span>
            </div>

            <div className="flex flex-col gap-2 min-w-0">
              <h2 className="text-[24px] sm:text-[30px] font-extrabold tracking-[-0.035em] text-ink leading-[1.1] transition-colors duration-150 group-hover:text-green">
                {thought.title}
              </h2>
              <p className="text-[15px] font-light leading-[1.7] text-muted max-w-[580px]">
                {thought.excerpt}
              </p>
            </div>

            <ArrowForward
              className="hidden sm:block text-green shrink-0 mt-3 transition-transform duration-200 group-hover:translate-x-1"
              size={16}
            />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
