import { readdir, readFile } from "fs/promises";
import path from "path";

export interface ContentFile {
  /** File name without the ".md" extension. */
  name: string;
  meta: Record<string, string>;
  body: string;
}

// Each piece of writing is a Markdown file under content/<dir>, opening
// with a small "key: value" header between "---" lines.
export async function readContentDir(dir: string): Promise<ContentFile[]> {
  const root = path.join(process.cwd(), "content", dir);
  let files: string[];
  try {
    files = (await readdir(root)).filter((f) => f.endsWith(".md")).sort();
  } catch {
    return [];
  }

  return Promise.all(
    files.map(async (file) => {
      const raw = await readFile(path.join(root, file), "utf8");
      const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
      const meta: Record<string, string> = {};
      for (const line of match?.[1].split("\n") ?? []) {
        const colon = line.indexOf(":");
        if (colon > 0) meta[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
      }
      return { name: file.replace(/\.md$/, ""), meta, body: (match?.[2] ?? raw).trim() };
    })
  );
}

export function readingMinutes(text: string) {
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}

export function clip(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}
