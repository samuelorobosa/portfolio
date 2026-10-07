"use client";

import { motion, useScroll, useSpring } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Thin bar pinned to the top of the viewport that fills as you read. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-50 h-[3px] bg-green origin-left"
      style={{ scaleX }}
      aria-hidden
    />
  );
}

/** Title whose words rise out of a mask one after another. */
export function RiseText({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom pb-[0.1em] mr-[0.22em]"
        >
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.75, ease }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </>
  );
}

/** Rule that draws itself in under the title. */
export function DrawnRule() {
  return (
    <motion.div
      className="h-[4px] w-24 bg-green origin-left"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay: 0.5, duration: 0.7, ease }}
      aria-hidden
    />
  );
}

/** Fades content up as it scrolls into view. */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, ease }}
    >
      {children}
    </motion.div>
  );
}
