import { useEffect, useState, type CSSProperties } from "react";
import { ChevronDown, Palette } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
  accentThemes,
  accentStorageKey,
  isAccentTheme,
  type AccentTheme,
} from "../../lib/accent-themes";

export function AccentThemeToggle({ lang = "zh" }: { lang?: "zh" | "en" }) {
  const [accent, setAccent] = useState<AccentTheme>("orange");
  const label = lang === "zh" ? "主题色" : "Accent color";
  const currentTheme = accentThemes.find((theme) => theme.id === accent)!;

  useEffect(() => {
    const sync = () => {
      const value = document.documentElement.dataset.accent;
      setAccent(isAccentTheme(value) ? value : "orange");
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-accent"],
    });
    return () => observer.disconnect();
  }, []);

  const selectAccent = (value: string) => {
    if (!isAccentTheme(value)) return;
    document.documentElement.dataset.accent = value;
    setAccent(value);
    try {
      localStorage.setItem(accentStorageKey, value);
    } catch {}
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-11 min-w-11 shrink-0 gap-2 px-2.5 cursor-pointer transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5 data-[state=open]:border-primary/40 data-[state=open]:bg-primary/5"
          aria-label={`${label}: ${currentTheme[lang]}`}
          title={label}
        >
          <span
            className="h-4 w-4 rounded-full bg-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
            aria-hidden="true"
          />
          <span className="hidden text-xs sm:inline">{label}</span>
          <ChevronDown
            className="hidden h-3.5 w-3.5 text-muted-foreground sm:block"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        collisionPadding={12}
        className="w-60 max-w-[calc(100vw-24px)] p-2 shadow-lg motion-reduce:animate-none"
      >
        <DropdownMenuLabel className="px-2 pt-2 pb-3">
          <span className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" aria-hidden="true" />
            {label}
          </span>
          <span className="mt-1 block text-xs font-normal text-muted-foreground">
            {lang === "zh"
              ? "选一种喜欢的颜色，点亮整个小站"
              : "A little color, across the whole site"}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-0 mb-2" />
        <DropdownMenuRadioGroup
          value={accent}
          onValueChange={selectAccent}
          aria-label={label}
        >
          {accentThemes.map((theme) => (
            <DropdownMenuRadioItem
              key={theme.id}
              value={theme.id}
              className="my-1 min-h-11 gap-3 rounded-md border border-transparent pr-3 cursor-pointer transition-colors duration-150 focus:bg-primary/10 data-[state=checked]:border-primary/20 data-[state=checked]:bg-primary/5"
            >
              <span
                className="h-6 w-6 shrink-0 rounded-full border border-black/10 bg-[hsl(var(--swatch-light))] shadow-sm dark:bg-[hsl(var(--swatch-dark))]"
                style={
                  {
                    "--swatch-light": theme.light,
                    "--swatch-dark": theme.dark,
                  } as CSSProperties
                }
                aria-hidden="true"
              />
              <span>{theme[lang]}</span>
              {accent === theme.id && (
                <span className="ml-auto text-[11px] text-primary">
                  {lang === "zh" ? "当前" : "Active"}
                </span>
              )}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator className="mx-0 mt-2" />
        <p className="px-2 py-1.5 text-[11px] text-muted-foreground">
          {lang === "zh"
            ? "明暗模式均适用 · 自动记住你的选择"
            : "Light & dark · Preference saved locally"}
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
