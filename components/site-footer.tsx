import type { Dictionary } from "@/lib/i18n";
import { getRepoFileUrl, repoUrl } from "@/lib/site";

interface SiteFooterProps {
  addAirlineUrl: string;
  reportBrokenUrl: string;
  dictionary: Dictionary;
  localeCode?: string;
}

export function SiteFooter({ addAirlineUrl, reportBrokenUrl, dictionary, localeCode = "en" }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <p>{dictionary.footer.description}</p>
      <nav aria-label="Footer links">
        <a href={repoUrl} rel="noopener noreferrer" target="_blank">
          {dictionary.footer.github}
        </a>
        <a href={addAirlineUrl} rel="noopener noreferrer" target="_blank">
          {dictionary.footer.addAirline}
        </a>
        <a href={reportBrokenUrl} rel="noopener noreferrer" target="_blank">
          {dictionary.footer.reportBroken}
        </a>
        <a href={`/${localeCode}/guides/how-to-claim`}>
          {dictionary.nav.guides}
        </a>
        <a href="/api">
          {dictionary.footer.api}
        </a>
        <a
          href={getRepoFileUrl("CONTRIBUTING.md")}
          rel="noopener noreferrer"
          target="_blank"
        >
          {dictionary.footer.contributing}
        </a>
        <a
          href={getRepoFileUrl("docs/translations.md")}
          rel="noopener noreferrer"
          target="_blank"
        >
          {dictionary.footer.translations}
        </a>
        <a
          href={getRepoFileUrl("LICENSE")}
          rel="noopener noreferrer"
          target="_blank"
        >
          {dictionary.footer.license}
        </a>
        <a
          href={getRepoFileUrl("TRADEMARKS.md")}
          rel="noopener noreferrer"
          target="_blank"
        >
          {dictionary.footer.trademarks}
        </a>
      </nav>
    </footer>
  );
}
