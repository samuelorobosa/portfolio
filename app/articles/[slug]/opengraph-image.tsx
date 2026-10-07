import { notFound } from "next/navigation";
import { getArticle, getArticles } from "../../lib/articles";
import { OG_SIZE, renderOgImage } from "../../lib/thoughtCard";

export const alt = "An article by Samuel Amagbakhen";
export const size = OG_SIZE;
export const contentType = "image/png";

// Pre-render at build time so the content and font files are never read
// on the server at request time.
export async function generateStaticParams() {
  return (await getArticles()).map(({ slug }) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  return renderOgImage({
    title: article.title,
    label: "article",
    excerpt: article.excerpt,
    path: "orobosa.xyz/articles",
  });
}
