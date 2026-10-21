// Each mode pairs an accessible accent with its button foreground.
export const accentThemes = [
  {
    id: "orange",
    zh: "暖橙",
    en: "Orange",
    light: "21 90% 40%",
    dark: "25 95% 62%",
  },
  {
    id: "blue",
    zh: "海蓝",
    en: "Blue",
    light: "221 83% 48%",
    dark: "213 94% 68%",
  },
  {
    id: "green",
    zh: "森林绿",
    en: "Green",
    light: "161 94% 27%",
    dark: "158 64% 52%",
  },
  {
    id: "violet",
    zh: "鸢尾紫",
    en: "Violet",
    light: "262 70% 50%",
    dark: "255 92% 76%",
  },
  {
    id: "rose",
    zh: "玫红",
    en: "Rose",
    light: "347 77% 43%",
    dark: "350 95% 72%",
  },
] as const;

export type AccentTheme = (typeof accentThemes)[number]["id"];
export const accentStorageKey = "accent-theme";

export function isAccentTheme(value: unknown): value is AccentTheme {
  return accentThemes.some((theme) => theme.id === value);
}
