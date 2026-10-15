import { isAdultKeyword } from './age-floor';

/** Same Pages Functions the website News plates use. */
const SITE = 'https://cognation-3md.pages.dev';

export type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  summary: string;
};

export type NewsEdition = 'nationwide' | 'international';

function decode(s: string): string {
  return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

export async function fetchNews(
  edition: NewsEdition,
): Promise<{ ok: true; items: NewsItem[] } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${SITE}/api/news/${edition}`);
    const json = (await res.json()) as { ok?: boolean; error?: string; items?: NewsItem[] };
    if (!json.ok) return { ok: false, error: json.error || `News unavailable (${res.status})` };
    const items = (json.items ?? [])
      .map((it) => ({
        title: decode(String(it.title || '')),
        link: decode(String(it.link || '')),
        pubDate: String(it.pubDate || ''),
        source: String(it.source || ''),
        summary: decode(String(it.summary || '')),
      }))
      .filter((it) => it.title && !isAdultKeyword(`${it.title} ${it.summary}`));
    return { ok: true, items };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'News unavailable' };
  }
}
