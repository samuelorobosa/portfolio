"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { SectionBullet } from "./icons";

const NAV_LINKS = [
  { label: "projects", href: "/projects" },
  { label: "articles", href: "/articles" },
  { label: "contact", href: "/contact" },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="px-4 sm:px-8 md:px-[52px] py-5 border-b border-faint">
      <div className="flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <Link
            href="/"
            aria-label="Samuel Amagbakhen — home"
            className="text-[22px] font-extrabold tracking-[-0.04em] text-ink no-underline leading-none"
          >
            SA
          </Link>
        </motion.div>

        <div className="flex items-center gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="flex items-center gap-[7px] px-3 py-[5px] rounded-full text-[11px] font-semibold text-green tracking-[0.01em]"
            style={{
              background: "rgba(130,199,154,0.07)",
              border: "1px solid rgba(130,199,154,0.2)",
            }}
          >
            <span style={{ animation: "blink 2.2s infinite" }}>
              <SectionBullet />
            </span>
            <span className="hidden sm:inline">available for work</span>
          </motion.div>

          {/* Desktop links */}
          <motion.ul
            className="hidden md:flex gap-7 list-none m-0 p-0"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
            }}
          >
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <motion.li
                  key={label}
                  variants={{
                    hidden: { opacity: 0, y: -6 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
                  }}
                >
                  <Link
                    href={href}
                    className={`text-[13px] font-normal no-underline transition-colors duration-150 hover:text-ink ${
                      active ? "text-ink" : "text-muted"
                    }`}
                  >
                    {label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="block h-px bg-ink mt-0.5"
                      />
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </div>

      {/* Mobile links row */}
      <div className="flex md:hidden gap-5 mt-4">
        {NAV_LINKS.map(({ label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`text-[12px] font-normal no-underline transition-colors duration-150 hover:text-ink ${
                active ? "text-ink" : "text-muted"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
