"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Download, Link2, Share2 } from "lucide-react";

interface Props {
  title: string;
  url: string;
  /** Portrait image of the piece to download, when one exists. */
  cardHref?: string;
}

const BUTTON =
  "flex items-center gap-2 border border-faint px-4 py-[10px] text-[12px] font-semibold text-mid no-underline cursor-pointer transition-colors duration-150 hover:border-green hover:text-green";

const press = { whileHover: { y: -3 }, whileTap: { scale: 0.94 } } as const;

export default function ShareBar({ title, url, cardHref }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked; the address bar still has the link.
    }
  }

  async function share() {
    if (!navigator.share) return copy();
    try {
      await navigator.share({ title, url });
    } catch {
      // Share sheet dismissed.
    }
  }

  const text = encodeURIComponent(`${title} — ${url}`);

  return (
    <div className="flex flex-col gap-5">
      <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-muted">
        Share this piece
      </span>

      <div className="flex flex-wrap gap-2">
        <motion.button type="button" onClick={share} className={BUTTON} {...press}>
          <Share2 size={14} aria-hidden />
          Share
        </motion.button>

        <motion.button
          type="button"
          onClick={copy}
          className={`${BUTTON} ${copied ? "border-green text-green" : ""}`}
          {...press}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "done" : "idle"}
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {copied ? <Check size={14} aria-hidden /> : <Link2 size={14} aria-hidden />}
              {copied ? "Copied" : "Copy link"}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <motion.a
          href={`https://wa.me/?text=${text}`}
          target="_blank"
          rel="noopener noreferrer"
          className={BUTTON}
          {...press}
        >
          WhatsApp
        </motion.a>

        <motion.a
          href={`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={BUTTON}
          {...press}
        >
          X
        </motion.a>

        {cardHref && (
          <motion.a href={cardHref} download className={BUTTON} {...press}>
            <Download size={14} aria-hidden />
            Save as image
          </motion.a>
        )}
      </div>
    </div>
  );
}
