/**
 * Load the official Hitokoto sentence bundles directly by URL.
 * No copied dataset is bundled with the site. A page session reuses its download;
 * a new page load revalidates the upstream files (subject to upstream caching).
 * Usage terms: https://sentences-bundle.hitokoto.cn/
 */
export interface QuoteItem {
  id: string;
  quote: string;
  from: string;
  author?: string;
  category: 'movie' | 'novel' | 'philosophy';
}

const categories = { d: 'novel', h: 'movie', k: 'philosophy' } as const;
const origins = [
  'https://sentences-bundle.hitokoto.cn',
  'https://cdn.jsdelivr.net/gh/hitokoto-osc/sentences-bundle@latest',
];
let bundleRequest: Promise<QuoteItem[]> | undefined;

async function loadCategory(key: keyof typeof categories): Promise<QuoteItem[]> {
  for (const origin of origins) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`${origin}/sentences/${key}.json`, {
        signal: controller.signal,
        cache: 'no-cache',
      });
      if (!response.ok) throw new Error(`Sentence bundle HTTP ${response.status}`);
      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid sentence bundle');
      const quotes: QuoteItem[] = [];
      for (const row of data) {
        if (!row || typeof row !== 'object' ||
            typeof row.hitokoto !== 'string' || !row.hitokoto.trim() ||
            typeof row.from !== 'string' || !row.from.trim() ||
            !['string', 'number'].includes(typeof row.id)) continue;
        quotes.push({
          id: `${key}-${row.id}`,
          quote: row.hitokoto.trim(),
          from: row.from.trim(),
          author: typeof row.from_who === 'string' && row.from_who.trim()
            ? row.from_who.trim() : undefined,
          category: categories[key],
        });
      }
      if (!quotes.length) throw new Error('Empty sentence bundle');
      return quotes;
    } catch {
      // Try the other official delivery URL if this host is unavailable.
    } finally {
      clearTimeout(timeout);
    }
  }
  return [];
}

export async function loadQuotes(lang: 'zh' | 'en' = 'zh'): Promise<QuoteItem[]> {
  if (!bundleRequest) {
    bundleRequest = Promise.all(
      (Object.keys(categories) as (keyof typeof categories)[]).map(loadCategory),
    ).then(groups => {
      const seen = new Set<string>();
      const quotes = groups.flat().filter(item => {
        if (seen.has(item.quote)) return false;
        seen.add(item.quote);
        return true;
      });
      if (!quotes.length) throw new Error('Sentence bundles unavailable');
      return quotes;
    }).catch(error => {
      bundleRequest = undefined; // Allow a retry after a network failure.
      throw error;
    });
  }
  const quotes = await bundleRequest;
  // The upstream has no language field. Keep English-page text Latin-script;
  // do not imply that the Chinese dataset has translated equivalents.
  const localized = quotes.filter(item => lang === 'en'
    ? /[a-zA-Z]/.test(item.quote) && !/\p{Script=Han}/u.test(item.quote)
    : /\p{Script=Han}/u.test(item.quote));
  if (!localized.length) throw new Error('No sentences for this language');
  return localized;
}
