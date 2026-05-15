"use client";

import { motion } from "motion/react";
import SectionLabel from "./SectionLabel";

const META = [
  { key: "Based", value: "Lagos, Nigeria", highlight: false },
  { key: "Focus", value: "Full-stack · Backend · Web3", highlight: false },
  { key: "Status", value: "Open to roles & freelance", highlight: true },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export default function About() {
  return (
    <section
      id="about"
      className="px-4 sm:px-8 md:px-[52px] py-12 sm:py-14 md:py-[68px] border-b border-faint"
    >
      <motion.div
        className="max-w-[640px]"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease }}
      >
        <SectionLabel>About</SectionLabel>

        <p className="text-[17px] sm:text-[18px] font-light leading-[1.72] tracking-[-0.01em] text-mid mb-8">
          I&apos;m Samuel, a software developer from Lagos with a love for{" "}
          <strong className="font-bold text-ink">clean code</strong> and
          well-reasoned architecture. I move between Python, Go, TypeScript, and
          Solidity depending on what the problem demands.{" "}
          <strong className="font-bold text-ink">
            I care about the details other people skip.
          </strong>
        </p>

        <div className="border-t border-faint pt-6 flex flex-col gap-3">
          {META.map(({ key, value, highlight }, i) => (
            <motion.div
              key={key}
              className="flex gap-4 items-baseline"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4, ease }}
            >
              <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted min-w-[68px]">
                {key}
              </span>
              <span
                className={
                  highlight
                    ? "text-[13px] font-semibold text-green"
                    : "text-[13px] font-normal text-mid"
                }
              >
                {value}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
