import { renderShareCard } from "../../../lib/thoughtCard";
import { getThought, getThoughts } from "../../../lib/thoughts";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const thoughts = await getThoughts();
  return thoughts.map((t) => ({ slug: t.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const thought = await getThought(slug);
  if (!thought) return new Response(null, { status: 404 });
  return renderShareCard(thought);
}
