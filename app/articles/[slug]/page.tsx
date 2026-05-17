import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getArticles } from "../../lib/devto";
import { ArrowBack, LinkExternal, MetaSeparator } from "../../components/icons";

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      ...(article.cover_image && { images: [article.cover_image] }),
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const date = new Date(article.published_at).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const tags = article.tag_list?.slice(0, 4) ?? [];

  return (
    <article className="px-4 sm:px-8 md:px-[52px] py-12 md:py-[68px] border-b border-faint">
      <Link
        href="/articles"
        className="inline-flex items-center gap-2 text-[12px] font-medium text-muted no-underline hover:text-ink transition-colors duration-150 mb-12 block"
      >
        <ArrowBack size={13} />
        Back to articles
      </Link>

      <div className="max-w-[720px]">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted mb-8">
          <span>{date}</span>
          {article.reading_time_minutes > 0 && (
            <>
              <MetaSeparator />
              <span>{article.reading_time_minutes} min read</span>
            </>
          )}
          {article.public_reactions_count > 0 && (
            <>
              <MetaSeparator />
              <span>{article.public_reactions_count} reactions</span>
            </>
          )}
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold tracking-[0.06em] uppercase border border-faint px-[9px] py-[3px] text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1
          className="font-extrabold tracking-[-0.03em] leading-[1.05] text-ink mb-12"
          style={{ fontSize: "clamp(28px, 4.5vw, 52px)" }}
        >
          {article.title}
        </h1>

        {/* Cover image */}
        {article.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full rounded-none border border-faint mb-12"
          />
        )}

        {/* Body */}
        {article.body_html && (
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: article.body_html }}
          />
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-faint flex items-center justify-between flex-wrap gap-4">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-[12px] font-medium text-muted no-underline hover:text-ink transition-colors duration-150"
          >
            <ArrowBack size={13} />
            Back to articles
          </Link>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-medium text-muted no-underline hover:text-green transition-colors duration-150 flex items-center gap-1"
          >
            View on dev.to
            <LinkExternal size={16} />
          </a>
        </div>
      </div>
    </article>
  );
}
