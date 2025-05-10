import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const HIGHLIGHT_THEME_ID = "highlightjs-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    return stored ?? "dark";
  });

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);

    // Dynamically load highlight.js CSS
    const existingLink = document.getElementById(
      HIGHLIGHT_THEME_ID
    ) as HTMLLinkElement | null;
    const themeHref =
      theme === "dark"
        ? "https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/atom-one-dark.css"
        : "https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/atom-one-light.css";

    if (existingLink) {
      existingLink.href = themeHref;
    } else {
      const link = document.createElement("link");
      link.id = HIGHLIGHT_THEME_ID;
      link.rel = "stylesheet";
      link.href = themeHref;
      document.head.appendChild(link);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}
