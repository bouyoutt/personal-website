/**
 * Load the official Hitokoto sentence bundles directly by URL.
 * No copied dataset is bundled with the site. A page session reuses its download;
 * a repeat visit reuses a small browser cache for up to 24 hours.
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
const requests = new Map<string, Promise<QuoteItem[]>>();
const CACHE_TTL = 24 * 60 * 60 * 1000;
const cacheKey = (lang: string) => `hitokoto-quotes-v1-${lang}`;

function isQuote(item: unknown): item is QuoteItem {
  if (!item || typeof item !== 'object') return false;
  const row = item as QuoteItem;
  return typeof row.id === 'string' && typeof row.quote === 'string' && !!row.quote.trim()
    && typeof row.from === 'string' && !!row.from.trim()
    && (row.author === undefined || typeof row.author === 'string')
    && ['movie', 'novel', 'philosophy'].includes(row.category);
}

function readCache(lang: string): QuoteItem[] | undefined {
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey(lang)) || 'null');
    if (cached && typeof cached.savedAt === 'number'
      && Date.now() >= cached.savedAt && Date.now() - cached.savedAt < CACHE_TTL
      && Array.isArray(cached.quotes) && cached.quotes.length && cached.quotes.every(isQuote)) {
      return cached.quotes;
    }
  } catch { /* Storage can be unavailable in private browsing. */ }
}

function saveCache(lang: string, quotes: QuoteItem[]) {
  try {
    // Interleave categories so the capped cache retains each available category.
    const groups = Object.values(categories).map(category => quotes.filter(item => item.category === category));
    const sample: QuoteItem[] = [];
    for (let i = 0; sample.length < 150 && groups.some(group => i < group.length); i++) {
      for (const group of groups) if (group[i] && sample.length < 150) sample.push(group[i]);
    }
    localStorage.setItem(cacheKey(lang), JSON.stringify({ savedAt: Date.now(), quotes: sample }));
  } catch { /* A storage failure must not prevent showing downloaded quotes. */ }
}

async function loadCategory(key: keyof typeof categories): Promise<QuoteItem[]> {
  for (const origin of origins) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`${origin}/sentences/${key}.json`, {
        signal: controller.signal,
        cache: 'default',
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
  const existing = requests.get(lang);
  if (existing) return existing;
  const cached = readCache(lang);
  if (cached) return cached;

  const tasks = (Object.keys(categories) as (keyof typeof categories)[]).map(async key => {
    const items = (await loadCategory(key)).filter(item => lang === 'en'
      ? /[a-zA-Z]/.test(item.quote) && !/\p{Script=Han}/u.test(item.quote)
      : /\p{Script=Han}/u.test(item.quote));
    if (!items.length) throw new Error('No sentences for this language');
    return items;
  });

  // Display the first usable category without waiting for the slowest host/file.
  const first = Promise.any(tasks).then(items => {
    saveCache(lang, items);
    return items;
  }).catch(error => {
    requests.delete(lang);
    throw error;
  });
  requests.set(lang, first);

  // Let the other categories finish in the background for subsequent switches/visits.
  void Promise.allSettled(tasks).then(results => {
    const seen = new Set<string>();
    const all = results.flatMap(result => result.status === 'fulfilled' ? result.value : [])
      .filter(item => {
        if (seen.has(item.quote)) return false;
        seen.add(item.quote);
        return true;
      });
    if (all.length) {
      requests.set(lang, Promise.resolve(all));
      saveCache(lang, all);
    }
  });
  return first;
}
