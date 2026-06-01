"use client";

import { useEffect, useState } from "react";
import { themeStorageKey, themes, type ThemePreference } from "@/lib/theme";
import type { Dictionary } from "@/lib/i18n";

interface ThemeSelectorProps {
  dictionary: Dictionary["theme"];
}

export function ThemeSelector({ dictionary }: ThemeSelectorProps) {
  const [theme, setTheme] = useState<ThemePreference>("system");

  useEffect(() => {
    const stored = localStorage.getItem(themeStorageKey);
    const initialTheme = themes.includes(stored as ThemePreference) ? (stored as ThemePreference) : "system";
    setTheme(initialTheme);
    applyTheme(initialTheme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if ((localStorage.getItem(themeStorageKey) ?? "system") === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  function handleThemeChange(value: ThemePreference) {
    setTheme(value);
    localStorage.setItem(themeStorageKey, value);
    applyTheme(value);
  }

  return (
    <label className="selector-label">
      <span>{dictionary.label}</span>
      <select
        aria-label={dictionary.label}
        className="footer-select"
        onChange={(event) => handleThemeChange(event.currentTarget.value as ThemePreference)}
        value={theme}
      >
        <option value="system">{dictionary.system}</option>
        <option value="light">{dictionary.light}</option>
        <option value="dark">{dictionary.dark}</option>
      </select>
    </label>
  );
}

function applyTheme(theme: ThemePreference) {
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolvedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;
  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.dataset.themePreference = theme;
}
