import { marked } from "marked";
import { cache } from "react";
import { clip, readContentDir, readingMinutes } from "./content";

export interface Article {
  slug: string;
  title: string;
  /** ISO date, e.g. "2022-05-01". */
  date: string;
  tags: string[];
  cover: string | null;
  excerpt: string;
  readingMinutes: number;
  html: string;
}

// First block of real prose, with Markdown syntax stripped.
function excerptOf(body: string) {
  const block = body
    .split(/\n\s*\n/)
    // A heading may sit directly on top of its paragraph.
    .map((b) => b.trim().replace(/^#+.*(\n|$)/, "").trim())
    .find((b) => b && !/^(!\[|<|\d+\.|[-*] )/.test(b));
  const text = (block ?? "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*`_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return clip(text, 160);
}

export const getArticles = cache(async (): Promise<Article[]> => {
  const files = await readContentDir("articles");
  return files
    .map(({ name, meta, body }) => ({
      slug: name,
      title: meta.title || name,
      date: meta.date ?? "",
      tags: (meta.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
      cover: meta.cover || null,
      excerpt: excerptOf(body),
      readingMinutes: readingMinutes(body),
      html: marked.parse(body, { async: false }),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
});

export async function getArticle(slug: string): Promise<Article | null> {
  return (await getArticles()).find((a) => a.slug === slug) ?? null;
}

export function formatArticleDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
