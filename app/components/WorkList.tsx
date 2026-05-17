"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import SectionLabel from "./SectionLabel";

export interface WorkItem {
  type: string;
  name: string;
  url: string;
  href: string;
  github?: string;
}

export const ALL_WORKS: WorkItem[] = [
  {
    type: "NestJS · TypeScript",
    name: "ChatGrow",
    url: "chatgrow.co",
    href: "https://chatgrow.co",
  },
  {
    type: "React · TypeScript",
    name: "OgaShortlet",
    url: "ogashortlet.com",
    href: "https://ogashortlet.com",
  },
  {
    type: "NestJS · TypeScript",
    name: "Wakami",
    url: "wakamiapp.com",
    href: "https://www.wakamiapp.com",
  },
  {
    type: "React · TypeScript",
    name: "Roqqu",
    url: "roqqu.com",
    href: "https://roqqu.com/",
  },
  {
    type: "Next.js · NestJS · Web3",
    name: "Phlo",
    url: "phlo.valleydao.bio",
    href: "https://phlo.valleydao.bio/",
  },
  {
    type: "Next.js · TypeScript",
    name: "Spine DAO",
    url: "spinedao.com",
    href: "https://www.spinedao.com/",
  },
  {
    type: "Next.js · TypeScript",
    name: "SEO Content AI",
    url: "seocontent.ai",
    href: "https://seocontent.ai/",
  },
  {
    type: "Next.js · TypeScript",
    name: "Hirehuub",
    url: "hirehuub.com",
    href: "https://hirehuub.com",
  },
  {
    type: "Next.js · NestJS",
    name: "Celeron by EN1",
    url: "en1.com",
    href: "https://en1.com",
  },
  {
    type: "Next.js · TypeScript",
    name: "KoboxFinance",
    url: "koboxfinance.com",
    href: "https://www.koboxfinance.com/",
  },
  {
    type: "React · GSAP",
    name: "Niffy's Marketplace",
    url: "niffys-marketplace.vercel.app",
    href: "https://niffys-marketplace.vercel.app/",
    github: "https://github.com/samuelorobosa/niffy-marketplace",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

interface WorkListProps {
  limit?: number;
  title?: string;
}

export default function WorkList({ limit, title = "Selected work" }: WorkListProps) {
  const items = limit ? ALL_WORKS.slice(0, limit) : ALL_WORKS;

  return (
    <section
      id="projects"
      className="px-4 sm:px-8 md:px-[52px] py-10 sm:py-12 md:py-[52px] border-b border-faint"
    >
      <SectionLabel>{title}</SectionLabel>

      <div className="flex flex-col">
        {items.map((item, i) => (
          <motion.a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group py-5 border-t border-faint last:border-b cursor-pointer no-underline block"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.07, duration: 0.45, ease }}
            whileHover={{ x: 4 }}
          >
            {/* Desktop */}
            <div
              className="hidden sm:grid items-center gap-6"
              style={{ gridTemplateColumns: "200px 1fr 200px" }}
            >
              <span className="text-[10px] font-semibold text-muted tracking-[0.06em] uppercase border border-faint px-[9px] py-[3px] w-fit">
                {item.type}
              </span>
              <span className="text-[26px] font-extrabold tracking-[-0.03em] text-ink leading-none transition-colors duration-150 group-hover:text-green">
                {item.name}
              </span>
              <span className="text-[12px] font-normal text-muted text-right flex items-center justify-end gap-[5px]">
                {item.url}
                <ExternalLink className="text-green shrink-0" size={11} aria-hidden />
              </span>
            </div>

            {/* Mobile */}
            <div className="sm:hidden flex flex-col gap-2">
              <span className="text-[10px] font-semibold text-muted tracking-[0.06em] uppercase border border-faint px-[9px] py-[3px] w-fit">
                {item.type}
              </span>
              <span className="text-[22px] font-extrabold tracking-[-0.03em] text-ink leading-none transition-colors duration-150 group-hover:text-green">
                {item.name}
              </span>
              <span className="text-[12px] text-muted flex items-center gap-1">
                {item.url}
                <ExternalLink className="text-green shrink-0" size={11} aria-hidden />
              </span>
            </div>
          </motion.a>
        ))}
      </div>

      {limit && ALL_WORKS.length > limit && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: limit * 0.07 + 0.1, duration: 0.4 }}
        >
          <Link
            href="/projects"
            className="text-[13px] font-medium text-muted no-underline hover:text-ink transition-colors duration-150 flex items-center gap-2 w-fit"
          >
            View all projects
            <span className="text-green">→</span>
          </Link>
        </motion.div>
      )}
    </section>
  );
}
