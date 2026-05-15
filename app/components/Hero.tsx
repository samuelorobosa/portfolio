"use client";

import Link from "next/link";
import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease, delay },
  }),
};

export default function Hero() {
  return (
    <section className="px-4 sm:px-8 md:px-[52px] pt-14 sm:pt-16 md:pt-[88px] pb-12 sm:pb-14 md:pb-[72px] border-b border-faint">
      <motion.div
        className="flex items-center gap-[10px] text-[11px] font-semibold tracking-[0.1em] uppercase text-muted mb-8"
        initial="hidden"
        animate="show"
        custom={0}
        variants={fadeUp}
      >
        <span className="inline-block w-5 h-px bg-muted" />
        Lagos, Nigeria
      </motion.div>

      <h1
        className="font-extrabold tracking-[-0.03em] leading-[0.97] text-ink max-w-[820px] mb-10"
        style={{ fontSize: "clamp(42px, 6.4vw, 84px)" }}
      >
        <motion.span
          className="block"
          initial="hidden"
          animate="show"
          custom={0.06}
          variants={fadeUp}
        >
          Full-stack
        </motion.span>
        <motion.span
          className="block font-[200] text-muted"
          initial="hidden"
          animate="show"
          custom={0.14}
          variants={fadeUp}
        >
          developer
        </motion.span>
        <motion.span
          className="block"
          initial="hidden"
          animate="show"
          custom={0.22}
          variants={fadeUp}
        >
          who <span className="text-green">ships.</span>
        </motion.span>
      </h1>

      <motion.p
        className="text-[15px] sm:text-base font-normal leading-[1.75] text-mid max-w-[480px] mb-11"
        initial="hidden"
        animate="show"
        custom={0.32}
        variants={fadeUp}
      >
        Experienced across frontend and backend development. I build
        well-designed interfaces, dependable backend systems, and scalable,
        intelligent applications.
      </motion.p>

      <motion.div
        className="flex flex-wrap gap-3 items-center"
        initial="hidden"
        animate="show"
        custom={0.42}
        variants={fadeUp}
      >
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 bg-ink text-bg text-[12px] font-bold px-[22px] py-3 no-underline transition-opacity hover:opacity-80"
        >
          View Projects →
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-transparent text-mid text-[12px] font-medium px-[22px] py-3 border border-faint no-underline transition-colors duration-150 hover:text-ink hover:border-[#444]"
        >
          Get In Touch
        </Link>
      </motion.div>
    </section>
  );
}
