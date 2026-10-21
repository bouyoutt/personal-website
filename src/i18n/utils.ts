import { ui, defaultLang, type Lang } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui[typeof defaultLang]): string {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: Lang) {
  return function translatePath(path: string, l: Lang = lang): string {
    const cleanPath = path.replace(/^\/en/, '').replace(/\/+$/, '') || '/';
    if (l === defaultLang) {
      return cleanPath;
    }
    return `/en${cleanPath === '/' ? '' : cleanPath}`;
  };
}
