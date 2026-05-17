"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Article } from "../lib/devto";
import { LinkExternal, MetaSeparator } from "./icons";

const ease = [0.22, 1, 0.36, 1] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface Props {
  articles: Article[];
}

export default function ArticleList({ articles }: Props) {
  return (
    <div className="flex flex-col">
      {articles.map((article, i) => {
        const tags = article.tag_list?.slice(0, 3) ?? [];
        return (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.07, duration: 0.45, ease }}
          >
            <Link
              href={`/articles/${article.slug}`}
              className="group block py-6 border-t border-faint last:border-b no-underline"
            >
              {/* Desktop */}
              <div
                className="hidden sm:grid items-start gap-6"
                style={{ gridTemplateColumns: "180px 1fr 24px" }}
              >
                <div className="flex flex-col gap-1 pt-1">
                  <span className="text-[11px] font-normal text-muted">
                    {formatDate(article.published_at)}
                  </span>
                  {article.reading_time_minutes > 0 && (
                    <span className="text-[11px] text-muted">
                      {article.reading_time_minutes} min read
                    </span>
                  )}
                  {article.public_reactions_count > 0 && (
                    <span className="text-[11px] text-muted">
                      {article.public_reactions_count} reactions
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <h2 className="text-[24px] font-extrabold tracking-[-0.03em] text-ink leading-tight transition-colors duration-150 group-hover:text-green">
                    {article.title}
                  </h2>
                  {tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold text-muted tracking-[0.06em] uppercase border border-faint px-[9px] py-[3px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <LinkExternal className="text-green shrink-0 pt-1" size={16} />
              </div>

              {/* Mobile */}
              <div className="sm:hidden flex flex-col gap-2">
                <span className="text-[11px] text-muted flex items-center gap-1.5 flex-wrap">
                  {formatDate(article.published_at)}
                  {article.reading_time_minutes > 0 && (
                    <>
                      <MetaSeparator />
                      <span>{article.reading_time_minutes} min read</span>
                    </>
                  )}
                </span>
                <h2 className="text-[22px] font-extrabold tracking-[-0.03em] text-ink leading-none transition-colors duration-150 group-hover:text-green">
                  {article.title}
                </h2>
                {tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold text-muted tracking-[0.06em] uppercase border border-faint px-[9px] py-[3px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
