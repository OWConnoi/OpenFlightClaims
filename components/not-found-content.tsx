export function NotFoundContent() {
  return (
    <main className="page-shell">
      <section className="empty-state not-found-panel">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The page you requested does not exist. Open the directory and search for an airline claim link.</p>
        <a className="cta-link" href="/en">
          Back to OpenFlightClaims
        </a>
      </section>
    </main>
  );
}
