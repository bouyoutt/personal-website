import * as React from "react";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
  }, []);

  const applyTheme = (theme: string) => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {}
    applyTheme(nextTheme);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-11 w-11 shrink-0 cursor-pointer sm:ml-2"
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all rotate-0 scale-100" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all rotate-0 scale-100" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
