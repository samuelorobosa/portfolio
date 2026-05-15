"use client";

import { motion } from "motion/react";

const TAGS = [
  "Python",
  "FastAPI",
  "Go",
  "React",
  "Next.js",
  "TypeScript",
  "NestJS",
  "Node.js",
  "Express.js",
  "Solidity",
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export default function StackBar() {
  return (
    <div className="flex items-center gap-4 sm:gap-5 px-4 sm:px-8 md:px-[52px] py-[14px] border-b border-faint">
      <motion.span
        className="text-[10px] font-bold tracking-[0.12em] uppercase text-green whitespace-nowrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5, ease }}
      >
        Stack
      </motion.span>
      <div className="w-px h-3 bg-faint shrink-0" />
      <motion.div
        className="flex gap-[6px] flex-wrap"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.04, delayChildren: 0.55 } },
        }}
      >
        {TAGS.map((tag) => (
          <motion.span
            key={tag}
            variants={{
              hidden: { opacity: 0, scale: 0.88 },
              show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease } },
            }}
            className="text-[11px] font-medium text-muted bg-surface border border-faint px-[10px] py-[3px]"
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
