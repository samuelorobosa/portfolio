"use client";

import { motion } from "motion/react";
import SectionLabel from "./SectionLabel";
import { LinkExternal } from "./icons";

const ease = [0.22, 1, 0.36, 1] as const;

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/samuelorobosa" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/samuel-amagbakhen" },
] as const;

export default function Contact() {
  return (
    <section
      id="contact"
      className="px-4 sm:px-8 md:px-[52px] py-14 sm:py-16 md:py-[80px] border-b border-faint"
    >
      <SectionLabel>Say hello</SectionLabel>

      <motion.p
        className="font-extrabold tracking-[-0.03em] leading-[1.15] text-ink max-w-[540px] mb-9"
        style={{ fontSize: "clamp(26px, 3.6vw, 48px)" }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease }}
      >
        Open to full-time roles,
        <br />
        <span className="font-[300] text-muted">freelance contracts,</span>
        <br />
        and interesting problems.
      </motion.p>

      <motion.div
        className="flex flex-col gap-6"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15, ease }}
      >
        <a
          href="mailto:amagbakhensamuel@gmail.com"
          className="inline-flex items-center gap-[10px] text-[14px] font-semibold text-ink no-underline border-b border-faint pb-1 w-fit transition-colors duration-150 hover:text-green hover:border-green"
        >
          amagbakhensamuel@gmail.com
          <LinkExternal size={12} />
        </a>

        <div className="flex gap-6">
          {SOCIAL_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-normal text-muted no-underline transition-colors duration-150 hover:text-ink"
            >
              {label}
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
