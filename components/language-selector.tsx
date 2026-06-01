"use client";

import { useEffect, useState } from "react";
import { getLocale, locales, type LocaleCode } from "@/i18n/locales";
import type { Dictionary } from "@/lib/i18n";

const languageStorageKey = "ofc-locale";

interface LanguageSelectorProps {
  currentLocale: string;
  dictionary: Dictionary["language"];
}

export function LanguageSelector({ currentLocale, dictionary }: LanguageSelectorProps) {
  const [locale, setLocale] = useState<LocaleCode>(getLocale(currentLocale).code);

  useEffect(() => {
    const activeLocale = getLocale(currentLocale);
    setLocale(activeLocale.code);
    localStorage.setItem(languageStorageKey, activeLocale.code);
  }, [currentLocale]);

  function handleLocaleChange(value: LocaleCode) {
    const nextLocale = getLocale(value);
    setLocale(nextLocale.code);
    localStorage.setItem(languageStorageKey, nextLocale.code);
    window.location.assign(`/${nextLocale.code}`);
  }

  return (
    <label className="selector-label">
      <span>{dictionary.label}</span>
      <select
        aria-label={dictionary.label}
        className="footer-select"
        onChange={(event) => handleLocaleChange(event.currentTarget.value as LocaleCode)}
        value={locale}
      >
        {locales.map((item) => (
          <option key={item.code} value={item.code}>
            {item.nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}
