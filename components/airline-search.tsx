"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useMemo, useState } from "react";
import type { LocaleCode } from "@/i18n/locales";
import type { Dictionary } from "@/lib/i18n";
import { getLinkStatus } from "@/lib/status";
import { searchAirlines } from "@/lib/search";
import type { AirlineRecord, LinkStatus } from "@/types/airline";
import { AirlineCard } from "./airline-card";

interface AirlineSearchProps {
  airlines: AirlineRecord[];
  dictionary: Dictionary;
  localeCode: LocaleCode;
}

const filterByStatus = (results: AirlineRecord[], filter: LinkStatus | "all") =>
  filter === "all" ? results : results.filter((airline) => getLinkStatus(airline.status) === filter);

function isExactCodeMatch(airline: AirlineRecord, query: string): boolean {
  const q = query.trim().toUpperCase();
  if (!q) return false;
  if (q.length === 2 && airline.iata?.toUpperCase() === q) return true;
  if (q.length === 3 && airline.icao?.toUpperCase() === q) return true;
  return false;
}

export function AirlineSearch({ airlines, dictionary, localeCode }: AirlineSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LinkStatus | "all">("all");
  const results = useMemo(() => searchAirlines(airlines, searchQuery), [airlines, searchQuery]);
  const filteredResults = useMemo(
    () => filterByStatus(results, statusFilter),
    [results, statusFilter],
  );
  const hasSearch = searchQuery.trim().length > 0;
  const isCodeQuery = /^[a-zA-Z0-9]{2,3}$/.test(searchQuery.trim());

  const handleSearchInput = (event: ChangeEvent<HTMLInputElement> | FormEvent<HTMLInputElement>) => {
    setSearchQuery(event.currentTarget.value);
  };

  return (
    <>
      <section className="search-section" aria-label="Search airline claim links">
        <label className="search-label" htmlFor="airline-search">
          {dictionary.search.label}
        </label>
        <input
          autoComplete="off"
          className="search-input"
          id="airline-search"
          onChange={handleSearchInput}
          onInput={handleSearchInput}
          placeholder={dictionary.search.placeholder}
          spellCheck="false"
          type="search"
          value={searchQuery}
        />
        <p className="result-meta" aria-live="polite">
          {hasSearch
            ? formatCount(
                filteredResults.length,
                filteredResults.length === 1 ? dictionary.search.match : dictionary.search.matches,
              )
            : formatCount(airlines.length, dictionary.search.indexed)}
        </p>
        {hasSearch && isCodeQuery && (
          <p className="result-meta" style={{ marginTop: 4 }}>
            Showing results for code <strong>{searchQuery.trim().toUpperCase()}</strong>
          </p>
        )}
        <label className="selector-label search-filter">
          <span>{dictionary.search.statusFilter}</span>
          <select
            className="footer-select"
            onChange={(event) => setStatusFilter(event.currentTarget.value as LinkStatus | "all")}
            value={statusFilter}
          >
            <option value="all">{dictionary.search.allStatuses}</option>
            <option value="active">{dictionary.status.active}</option>
            <option value="reported_broken">{dictionary.status.reportedBroken}</option>
            <option value="unknown">{dictionary.status.unknownStatus}</option>
          </select>
        </label>
      </section>

      <section className="airline-grid" aria-label="Airline claim links">
        {hasSearch ? (
          filteredResults.length > 0 ? (
            filteredResults.map((airline) => (
              <AirlineCard
                airline={airline}
                dictionary={dictionary}
                exactCodeMatch={isExactCodeMatch(airline, searchQuery)}
                key={airline.slug}
                localeCode={localeCode}
              />
            ))
          ) : (
            <div className="empty-state">
              <h2>{dictionary.empty.noMatchesTitle}</h2>
              <p>{dictionary.empty.noMatchesDescription}</p>
              <p className="result-meta" style={{ marginTop: 8 }}>
                Try searching by IATA code (2 letters) or ICAO code (3 letters).
              </p>
            </div>
          )
        ) : (
          <div className="empty-state">
            <h2>{dictionary.empty.title}</h2>
            <p>{dictionary.empty.description}</p>
          </div>
        )}
      </section>
    </>
  );
}

function formatCount(count: number, template: string) {
  return template.replace("{count}", count.toString());
}
