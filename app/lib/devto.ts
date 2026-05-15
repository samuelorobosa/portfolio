export interface Article {
  id: number;
  title: string;
  slug: string;
  url: string;
  canonical_url: string;
  description: string;
  published_at: string;
  tag_list: string[];
  reading_time_minutes: number;
  cover_image: string | null;
  public_reactions_count: number;
  body_html?: string;
  user: { username: string };
}

// The list endpoint (/articles/me) returns tag_list as string[].
// The individual endpoint (/articles/{username}/{slug}) returns it as a
// comma-separated string. This normalises both to string[].
function normaliseTags(raw: string | string[] | undefined): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return raw.split(",").map((t) => t.trim()).filter(Boolean);
}

function normalise(article: Record<string, unknown>): Article {
  return {
    ...article,
    tag_list: normaliseTags(
      article.tag_list as string | string[] | undefined
    ),
  } as Article;
}

export async function getArticles(): Promise<Article[]> {
  const key = process.env.DEV_TO_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch("https://dev.to/api/articles/me", {
      headers: { "api-key": key },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data: Record<string, unknown>[] = await res.json();
    return data.map(normalise);
  } catch {
    return [];
  }
}

export async function getArticle(slug: string): Promise<Article | null> {
  const username = process.env.DEV_TO_USERNAME;
  if (!username) return null;
  try {
    const res = await fetch(
      `https://dev.to/api/articles/${username}/${slug}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data: Record<string, unknown> = await res.json();
    return normalise(data);
  } catch {
    return null;
  }
}
