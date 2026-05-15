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

export async function getArticles(): Promise<Article[]> {
  const key = process.env.DEV_TO_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch("https://dev.to/api/articles/me", {
      headers: { "api-key": key },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
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
    return res.json();
  } catch {
    return null;
  }
}
