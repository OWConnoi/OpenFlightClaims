import type { Dictionary } from "@/lib/i18n";
import { siteName } from "@/lib/site";
import { LanguageSelector } from "./language-selector";
import { ThemeSelector } from "./theme-selector";

interface SiteHeaderProps {
  dictionary: Dictionary;
  localeCode: string;
}

export function SiteHeader({ dictionary, localeCode }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__brand">
        <a className="site-header__wordmark" href={`/${localeCode}`}>
          {siteName}
        </a>
        <p className="site-header__tagline">{dictionary.hero.lede}</p>
      </div>
      <div className="site-header__end">
        <nav aria-label="Primary" className="site-header__nav">
          <a href={`/${localeCode}/guides`}>
            {dictionary.nav.guides}
          </a>
          <a href={`/${localeCode}/tools/eligibility-helper`}>
            {dictionary.nav.eligibility}
          </a>
          <a href={`/${localeCode}/tools/claim-template`}>
            {dictionary.nav.claimTemplate}
          </a>
        </nav>
        <div className="header-controls">
          <ThemeSelector dictionary={dictionary.theme} />
          <LanguageSelector currentLocale={localeCode} dictionary={dictionary.language} />
        </div>
      </div>
    </header>
  );
}
