import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatArticleDate, getArticle, getArticles } from "../../lib/articles";
import { ArrowBack, ArrowForward, MetaSeparator } from "../../components/icons";
import {
  DrawnRule,
  ReadingProgress,
  Reveal,
  RiseText,
} from "../../components/ReadingMotion";
import ShareBar from "../../components/ShareBar";

const SITE_URL = "https://orobosa.xyz";

export const dynamicParams = false;

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
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: `/articles/${slug}`,
      publishedTime: article.date,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = await getArticles();
  const index = articles.findIndex((a) => a.slug === slug);
  const article = articles[index];
  if (!article) notFound();

  const newer = articles[index - 1];
  const older = articles[index + 1];

  return (
    <>
      <ReadingProgress />

      <article className="px-4 sm:px-8 md:px-[52px] py-12 md:py-[84px] border-b border-faint">
        <div className="max-w-[720px] mx-auto">
          <Link
            href="/articles"
            className="group flex w-fit items-center gap-2 text-[12px] font-medium text-muted no-underline hover:text-ink transition-colors duration-150 mb-14"
          >
            <ArrowBack
              size={13}
              className="shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
            />
            Back to articles
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted mb-7">
            <span className="text-[10px] font-extrabold tracking-[0.1em] uppercase text-bg bg-green px-[10px] py-[4px]">
              Article
            </span>
            <MetaSeparator />
            <span>{formatArticleDate(article.date)}</span>
            <MetaSeparator />
            <span>{article.readingMinutes} min read</span>
          </div>

          <h1 className="text-[clamp(38px,6.5vw,76px)] font-extrabold tracking-[-0.05em] leading-[0.98] text-ink mb-9">
            <RiseText text={article.title} />
          </h1>

          <DrawnRule />

          {article.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-9">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold tracking-[0.06em] uppercase border border-faint px-[9px] py-[3px] text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {article.cover && (
            <Reveal className="relative aspect-[1000/420] mt-12 border border-faint overflow-hidden bg-surface">
              <Image
                src={article.cover}
                alt=""
                fill
                sizes="(min-width: 768px) 720px, 100vw"
                className="object-cover"
                priority
              />
            </Reveal>
          )}

          <Reveal className="mt-14">
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: article.html }}
            />
          </Reveal>

          <Reveal className="mt-20 pt-10 border-t border-faint">
            <ShareBar title={article.title} url={`${SITE_URL}/articles/${slug}`} />
          </Reveal>

          {(newer || older) && (
            <nav className="grid sm:grid-cols-2 gap-3 mt-14" aria-label="More articles">
              {older ? (
                <Link
                  href={`/articles/${older.slug}`}
                  className="group flex flex-col gap-2 border border-faint p-5 no-underline transition-colors duration-200 hover:border-green"
                >
                  <span className="flex items-center gap-2 text-[10px] font-bold tracking-[0.12em] uppercase text-muted">
                    <ArrowBack
                      size={12}
                      className="shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
                    />
                    Earlier
                  </span>
                  <span className="text-[18px] font-extrabold tracking-[-0.02em] text-ink transition-colors duration-150 group-hover:text-green">
                    {older.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {newer && (
                <Link
                  href={`/articles/${newer.slug}`}
                  className="group flex flex-col gap-2 sm:items-end sm:text-right border border-faint p-5 no-underline transition-colors duration-200 hover:border-green"
                >
                  <span className="flex items-center gap-2 text-[10px] font-bold tracking-[0.12em] uppercase text-muted">
                    Later
                    <ArrowForward
                      size={12}
                      className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </span>
                  <span className="text-[18px] font-extrabold tracking-[-0.02em] text-ink transition-colors duration-150 group-hover:text-green">
                    {newer.title}
                  </span>
                </Link>
              )}
            </nav>
          )}
        </div>
      </article>
    </>
  );
}
