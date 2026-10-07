import { cache } from "react";
import { clip, readContentDir, readingMinutes } from "./content";

const KINDS = ["poem", "story", "thought"] as const;
export type ThoughtKind = (typeof KINDS)[number];

export interface Thought {
  slug: string;
  title: string;
  kind: ThoughtKind;
  /** Paragraphs, with the author's line breaks kept inside each one. */
  paragraphs: string[];
  excerpt: string;
  readingMinutes: number;
}

// Files are named "NN-slug.md". The number sets the order (highest first)
// and is dropped from the URL.
export const getThoughts = cache(async (): Promise<Thought[]> => {
  const files = await readContentDir("thoughts");
  return files.reverse().map(({ name, meta, body }) => {
    const slug = name.replace(/^\d+-/, "");
    const paragraphs = body
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    return {
      slug,
      title: meta.title || slug,
      kind: KINDS.find((k) => k === meta.kind) ?? "thought",
      paragraphs,
      readingMinutes: readingMinutes(body),
      excerpt: clip(paragraphs[0]?.split("\n")[0] ?? "", 140),
    };
  });
});

export async function getThought(slug: string): Promise<Thought | null> {
  return (await getThoughts()).find((t) => t.slug === slug) ?? null;
}
