import type { Metadata } from "next";
import { getArticles } from "../lib/devto";
import ArticleList from "../components/ArticleList";
import SectionLabel from "../components/SectionLabel";

export const metadata: Metadata = {
  title: "Articles",
  description: "Writing on software engineering, architecture, and the web by Samuel Amagbakhen.",
};

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <section className="px-4 sm:px-8 md:px-[52px] py-10 sm:py-12 md:py-[52px] border-b border-faint">
      <SectionLabel>Articles</SectionLabel>

      {articles.length === 0 ? (
        <p className="text-[18px] font-light leading-[1.72] text-mid max-w-[520px]">
          Writing is coming. Topics will include system design, frontend
          architecture, and building things on-chain.
        </p>
      ) : (
        <ArticleList articles={articles} />
      )}
    </section>
  );
}
