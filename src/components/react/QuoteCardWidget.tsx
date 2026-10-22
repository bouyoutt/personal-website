import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Quote, Clapperboard, BookOpen, Lightbulb, ExternalLink } from 'lucide-react';
import { loadQuotes, type QuoteItem } from '../../content/quotesData';

const AUTO_REFRESH_INTERVAL = 60; // 60秒自动刷新

interface Props {
  lang?: 'zh' | 'en';
}

export default function QuoteCardWidget({ lang = 'zh' }: Props) {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoadState('loading');
    setQuotes([]);
    loadQuotes(lang).then(items => {
      if (cancelled) return;
      setQuotes(items);
      setLoadState('ready');
    }).catch(() => {
      if (!cancelled) setLoadState('error');
    });
    return () => { cancelled = true; };
  }, [lang, loadAttempt]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(AUTO_REFRESH_INTERVAL);
  const [resetKey, setResetKey] = useState(0);

  const switchQuote = useCallback(() => {
    // Reuse the full category set once background downloads have completed.
    void loadQuotes(lang).then(setQuotes).catch(() => {});
    if (!quotes.length) return;
    setIsRotating(true);
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentIndex((prev) => {
        let next;
        do {
          next = Math.floor(Math.random() * quotes.length);
        } while (quotes.length > 1 && next === prev);
        return next;
      });
      setIsAnimating(false);
    }, 220);

    setTimeout(() => {
      setIsRotating(false);
    }, 600);
  }, [quotes.length, lang]);

  // 初始化时随机挑选一句，避免每次刷新都是第一句
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentIndex(randomIndex);
    setTimeLeft(AUTO_REFRESH_INTERVAL);
    setResetKey((prev) => prev + 1);
  }, [lang, quotes.length]);

  // 60s 倒计时自动刷新下句
  useEffect(() => {
    if (loadState !== 'ready') return;
    if (timeLeft <= 0) {
      switchQuote();
      setTimeLeft(AUTO_REFRESH_INTERVAL);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, resetKey, switchQuote, loadState]);

  const handleNextQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loadState === 'error') {
      setLoadAttempt(prev => prev + 1);
      return;
    }
    if (loadState !== 'ready' || isAnimating) return;

    switchQuote();
    setTimeLeft(AUTO_REFRESH_INTERVAL);
    setResetKey((prev) => prev + 1);
  };

  const current = quotes[currentIndex] || quotes[0];

  const getCategoryConfig = (category: QuoteItem['category']) => {
    switch (category) {
      case 'movie':
        return {
          icon: Clapperboard,
          label: lang === 'zh' ? '影视台词' : 'Cinema',
          color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        };
      case 'novel':
        return {
          icon: BookOpen,
          label: lang === 'zh' ? '文学小说' : 'Literature',
          color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        };
      case 'philosophy':
        return {
          icon: Lightbulb,
          label: lang === 'zh' ? '哲学与思考' : 'Philosophy',
          color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
        };
    }
  };

  const categoryConfig = getCategoryConfig(current?.category ?? 'novel');
  const CategoryIcon = categoryConfig.icon;

  return (
    <div className="relative flex h-full w-full flex-col justify-between select-none">
      {/* 倒计时微进度条 (60s 周期) */}
      <div className="pointer-events-none absolute -top-2 left-0 right-0 h-[2px] bg-muted/20 overflow-hidden">
        <div
          className="h-full bg-primary/40 transition-[width] duration-1000 ease-linear"
          style={{ width: `${(timeLeft / AUTO_REFRESH_INTERVAL) * 100}%` }}
        />
      </div>

      {/* 背景装饰引号水印 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Quote
          className="absolute -right-3 -top-2 h-20 w-20 text-muted/15 dark:text-muted/10"
          strokeWidth={1}
        />
      </div>

      {/* 顶部栏：标题、分类胶囊与“换一句”互动按钮 */}
      <div className="z-10 flex items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {lang === 'zh' ? '经典名句与灵感' : 'Inspiration & Lines'}
          </span>
          {current && <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors ${categoryConfig.color}`}
          >
            <CategoryIcon size={12} />
            <span>{categoryConfig.label}</span>
          </span>}
        </div>

        <button
          type="button"
          onClick={handleNextQuote}
          disabled={loadState === 'loading' || isAnimating}
          title={
            lang === 'zh'
              ? `点击随机切换下一句名言（${timeLeft} 秒后自动刷新）`
              : `Click to refresh quote (auto-refreshes in ${timeLeft}s)`
          }
          className="group inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 cursor-pointer"
        >
          <RefreshCw
            size={13}
            className={`transition-transform duration-500 ${isRotating ? 'rotate-180' : 'group-hover:rotate-45'}`}
          />
          <span>{loadState === 'error' ? (lang === 'zh' ? '重试' : 'Retry') : (lang === 'zh' ? '换一句' : 'Next')}</span>
          <span className="font-mono text-[10px] tabular-nums text-muted-foreground/70">
            {loadState === 'ready' ? `${timeLeft}s` : ''}
          </span>
        </button>
      </div>

      {/* 中部：名句内容展示区域（平滑淡入淡出） */}
      <div
        className={`my-auto py-2 transition-all duration-200 ${
          isAnimating ? 'scale-[0.98] opacity-0 blur-[1px]' : 'scale-100 opacity-100 blur-0'
        }`}
      >
        {current ? <blockquote className="border-l-2 border-primary/60 pl-3.5 text-sm sm:text-base italic leading-relaxed text-foreground font-serif tracking-wide">
          “{current.quote}”
        </blockquote> : (
          <p role="status" className="text-sm text-muted-foreground py-2">
            {loadState === 'error'
              ? (lang === 'zh' ? '句库暂时无法加载，请点击重试。' : 'Unable to load quotes. Please retry.')
              : (lang === 'zh' ? '正在加载一言句库…' : 'Loading Hitokoto quotes…')}
          </p>
        )}
      </div>

      {/* 底部信息：左侧开源数据源说明，右侧作品出处与作者 */}
      <div className="z-10 flex flex-wrap items-end justify-between gap-2 pt-2 border-t border-border/40 text-xs">
        <a
          href="https://sentences-bundle.hitokoto.cn/"
          target="_blank"
          rel="noopener noreferrer"
          title={lang === 'zh' ? '来自一言官方句子包，浏览器缓存 24 小时' : 'Official Hitokoto bundles, cached in this browser for 24 hours'}
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/75 hover:text-primary transition-colors"
        >
          <span>{lang === 'zh' ? '句库：一言' : 'Source: Hitokoto'}</span>
          <ExternalLink size={10} />
        </a>

        {current && <div className="ml-auto text-right text-xs font-medium text-foreground/90">
          <span className="font-semibold text-foreground">{current.from}</span>
          {current.author && (
            <span className="text-muted-foreground ml-1.5 font-normal">
              · {current.author}
            </span>
          )}
        </div>}
      </div>
    </div>
  );
}
