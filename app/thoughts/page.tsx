import type { Metadata } from "next";
import { getThoughts } from "../lib/thoughts";
import SectionLabel from "../components/SectionLabel";
import ThoughtList from "../components/ThoughtList";

export const metadata: Metadata = {
  title: "Thoughts",
  description:
    "Poems, short stories, and loose thoughts by Samuel Amagbakhen.",
};

export default async function ThoughtsPage() {
  const thoughts = await getThoughts();

  return (
    <section className="px-4 sm:px-8 md:px-[52px] py-10 sm:py-12 md:py-[52px] border-b border-faint">
      <SectionLabel>Thoughts</SectionLabel>

      <p className="text-[18px] font-light leading-[1.72] text-mid max-w-[520px] mb-10">
        Poems, short stories, and things I couldn&apos;t stop thinking about.
        Nothing here is about code, mostly.
      </p>

      <ThoughtList
        thoughts={thoughts.map(({ slug, title, kind, excerpt, readingMinutes }) => ({
          slug,
          title,
          kind,
          excerpt,
          readingMinutes,
        }))}
      />
    </section>
  );
}
