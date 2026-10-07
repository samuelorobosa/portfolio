import { notFound } from "next/navigation";
import { OG_SIZE, renderOgImage } from "../../lib/thoughtCard";
import { getThought, getThoughts } from "../../lib/thoughts";

export const alt = "A piece of writing by Samuel Amagbakhen";
export const size = OG_SIZE;
export const contentType = "image/png";

// Pre-render at build time so the content and font files are never read
// on the server at request time.
export async function generateStaticParams() {
  return (await getThoughts()).map(({ slug }) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const thought = await getThought(slug);
  if (!thought) notFound();
  return renderOgImage({
    title: thought.title,
    label: thought.kind,
    excerpt: thought.excerpt,
    path: "orobosa.xyz/thoughts",
  });
}
