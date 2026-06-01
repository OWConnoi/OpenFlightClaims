import { AirlineAvatar } from "@/components/airline-avatar";
import { AirlineSearch } from "@/components/airline-search";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getLocale, type LocaleCode } from "@/i18n/locales";
import { getAirlines, getPopularVerifiedAirlines } from "@/lib/airlines";
import { getAddAirlineIssueUrl, getGenericBrokenLinkIssueUrl } from "@/lib/github-issue-links";
import { getDictionary } from "@/lib/i18n";
import { getAirlinePath } from "@/lib/site";

interface HomePageProps {
  localeCode?: LocaleCode;
}

export function HomePage({ localeCode = "en" }: HomePageProps) {
  const locale = getLocale(localeCode);
  const dictionary = getDictionary(locale.code);
  const airlines = getAirlines();
  const popular = getPopularVerifiedAirlines(airlines);
  const addAirlineUrl = getAddAirlineIssueUrl();
  const reportBrokenUrl = getGenericBrokenLinkIssueUrl();

  return (
    <main className="page-shell">
      <SiteHeader
        dictionary={dictionary}
        localeCode={locale.code}
      />

      <section className="hero-section">
        <h1 className="hero-title">{dictionary.hero.title}</h1>
        <p className="hero-subtitle">{dictionary.hero.lede}</p>
        <p className="hero-stat">{dictionary.stats.indexed.replace("{count}", airlines.length.toString())}</p>
      </section>

      <AirlineSearch airlines={airlines} dictionary={dictionary} localeCode={locale.code} />

      {popular.length > 0 ? (
        <section className="popular-section" aria-labelledby="popular-title">
          <h2 className="popular-title" id="popular-title">{dictionary.home.popularTitle}</h2>
          <div className="popular-pills">
            {popular.map((airline) => (
              <a
                className="popular-pill"
                href={getAirlinePath(locale.code, airline.slug)}
                key={airline.slug}
              >
                <AirlineAvatar airline={airline} />
                <span>{airline.name}</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="footer-cta" aria-label="Contribute">
        <a className="secondary-link" href={addAirlineUrl} rel="noopener noreferrer" target="_blank">
          {dictionary.actions.addAirline}
        </a>
        <span aria-hidden="true">·</span>
        <a className="secondary-link" href={reportBrokenUrl} rel="noopener noreferrer" target="_blank">
          {dictionary.actions.reportBroken}
        </a>
      </section>

      <SiteFooter
        addAirlineUrl={addAirlineUrl}
        dictionary={dictionary}
        localeCode={locale.code}
        reportBrokenUrl={reportBrokenUrl}
      />
    </main>
  );
}
