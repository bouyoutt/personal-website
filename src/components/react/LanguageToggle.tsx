import React, { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import { Button } from "../ui/button";

interface LanguageToggleProps {
  currentLang?: "zh" | "en";
}

export function LanguageToggle({
  currentLang: initialLang,
}: LanguageToggleProps) {
  const [lang, setLang] = useState<"zh" | "en">(initialLang || "zh");

  useEffect(() => {
    const isEn = window.location.pathname.startsWith("/en");
    setLang(isEn ? "en" : "zh");
  }, []);

  const toggleLanguage = () => {
    const isEn = window.location.pathname.startsWith("/en");
    const currentPath = window.location.pathname;

    let targetPath = "/";
    if (isEn) {
      // 切换为中文：去掉 /en 前缀
      targetPath = currentPath.replace(/^\/en(\/|$)/, "/");
      if (!targetPath) targetPath = "/";
      try {
        localStorage.setItem("preferred-language", "zh");
      } catch (e) {}
    } else {
      // 切换为英文：加上 /en 前缀
      if (currentPath === "/") {
        targetPath = "/en";
      } else {
        targetPath = `/en${currentPath}`;
      }
      try {
        localStorage.setItem("preferred-language", "en");
      } catch (e) {}
    }

    // Detail translations use distinct slugs; keep the selected article/project.
    targetPath = targetPath.replace(
      /\/(hello-world-my-first-blog|chrome-extension)(-en)?(\/)?$/,
      (_, slug, _suffix, slash) => `/${slug}${isEn ? "" : "-en"}${slash || ""}`,
    );
    // Tags and disabled collection pages have no English counterparts.
    if (!isEn && /^\/en\/(tags|books|experiences)(\/|$)/.test(targetPath)) {
      targetPath = "/en";
    }
    window.location.href = targetPath;
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex h-11 min-w-11 cursor-pointer items-center gap-1.5 px-2.5 text-xs font-medium hover:text-primary transition-colors"
      title={lang === "zh" ? "Switch to English" : "切换为中文"}
      aria-label={lang === "zh" ? "Switch to English" : "切换为中文"}
    >
      <Languages className="h-3.5 w-3.5" />
      <span>{lang === "zh" ? "EN" : "中文"}</span>
    </Button>
  );
}
