import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getThought, getThoughts } from "../../lib/thoughts";
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
  const thoughts = await getThoughts();
  return thoughts.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const thought = await getThought(slug);
  if (!thought) return {};
  return {
    title: thought.title,
    description: thought.excerpt,
    openGraph: {
      type: "article",
      title: thought.title,
      description: thought.excerpt,
      url: `/thoughts/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: thought.title,
      description: thought.excerpt,
    },
  };
}

// Renders **bold** spans; everything else is shown exactly as written.
function withBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-extrabold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

const DROP_CAP =
  "first-letter:float-left first-letter:mr-3 first-letter:mt-[0.08em] first-letter:text-[4.1em] first-letter:leading-[0.78] first-letter:font-extrabold first-letter:text-green";

export default async function ThoughtPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const thoughts = await getThoughts();
  const index = thoughts.findIndex((t) => t.slug === slug);
  const thought = thoughts[index];
  if (!thought) notFound();

  const isPoem = thought.kind === "poem";
  const body = thought.paragraphs;
  // A short closing line gets set as a pull-quote.
  const closer =
    !isPoem && body.length >= 3 && body[body.length - 1].length <= 160
      ? body.length - 1
      : -1;

  const newer = thoughts[index - 1];
  const older = thoughts[index + 1];

  return (
    <>
      <ReadingProgress />

      <article className="px-4 sm:px-8 md:px-[52px] py-12 md:py-[84px] border-b border-faint">
        <div className="max-w-[680px] mx-auto">
          <Link
            href="/thoughts"
            className="group flex w-fit items-center gap-2 text-[12px] font-medium text-muted no-underline hover:text-ink transition-colors duration-150 mb-14"
          >
            <ArrowBack
              size={13}
              className="shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
            />
            Back to thoughts
          </Link>

          <div className="flex items-center gap-3 text-[11px] text-muted mb-7">
            <span className="text-[10px] font-extrabold tracking-[0.1em] uppercase text-bg bg-green px-[10px] py-[4px]">
              {thought.kind}
            </span>
            <MetaSeparator />
            <span>{thought.readingMinutes} min read</span>
          </div>

          <h1 className="text-[clamp(44px,8vw,92px)] font-extrabold tracking-[-0.05em] leading-[0.95] text-ink mb-9">
            <RiseText text={thought.title} />
          </h1>

          <DrawnRule />

          <div
            className={`flex flex-col mt-14 font-light text-mid ${
              isPoem
                ? "gap-10 text-[21px] sm:text-[25px] leading-[1.95] text-ink"
                : "gap-11 text-[19px] sm:text-[21px] leading-[2.05]"
            }`}
          >
            {body.map((paragraph, i) => (
              <Reveal key={i}>
                {i === closer ? (
                  <p className="whitespace-pre-line border-l-[3px] border-green pl-6 sm:pl-8 my-4 text-[26px] sm:text-[34px] font-extrabold tracking-[-0.03em] leading-[1.25] text-ink">
                    {withBold(paragraph)}
                  </p>
                ) : (
                  <p
                    className={`whitespace-pre-line ${
                      i === 0 && !isPoem
                        ? `text-[22px] sm:text-[25px] leading-[1.8] font-normal text-ink ${
                            /^[A-Za-z]/.test(paragraph) ? DROP_CAP : ""
                          }`
                        : ""
                    }`}
                  >
                    {withBold(paragraph)}
                  </p>
                )}
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-20 pt-10 border-t border-faint">
            <ShareBar
              title={thought.title}
              url={`${SITE_URL}/thoughts/${slug}`}
              cardHref={`/thoughts/${slug}/card`}
            />
          </Reveal>

          {(newer || older) && (
            <nav className="grid sm:grid-cols-2 gap-3 mt-14" aria-label="More thoughts">
              {older ? (
                <Link
                  href={`/thoughts/${older.slug}`}
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
                  href={`/thoughts/${newer.slug}`}
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
