export const dynamic = "force-static";

export function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>API · OpenFlightClaims</title>
  <meta name="description" content="OpenFlightClaims public API and data endpoints. Read-only JSON, Markdown, OpenAPI, and MCP access. No authentication required.">
  <style>
    :root {
      --bg: oklch(98% 0.003 250);
      --panel: oklch(99.5% 0.002 250);
      --text: oklch(12% 0.015 250);
      --muted: oklch(44% 0.015 250);
      --line: oklch(82% 0.004 250);
      --accent: oklch(55% 0.14 250);
      --accent-hover: oklch(48% 0.15 250);
      --link: oklch(42% 0.08 250);
      --space-sm: 8px;
      --space-md: 16px;
      --space-lg: 24px;
      --space-xl: 32px;
      --radius: 6px;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: oklch(14% 0.008 250);
        --panel: oklch(18% 0.01 250);
        --text: oklch(97% 0.004 250);
        --muted: oklch(72% 0.015 250);
        --line: oklch(28% 0.01 250);
        --accent: oklch(72% 0.12 250);
        --accent-hover: oklch(78% 0.11 250);
        --link: oklch(78% 0.08 250);
      }
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      font-size: 15px;
    }
    .wrap {
      max-width: 860px;
      margin: 0 auto;
      padding: 48px 20px 80px;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--line);
    }
    .brand {
      font-size: 21px;
      font-weight: 600;
      letter-spacing: -0.01em;
      text-decoration: none;
      color: var(--text);
    }
    .brand:hover { color: var(--accent); }
    h1 {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px;
      letter-spacing: -0.02em;
    }
    .tag {
      color: var(--muted);
      font-size: 15px;
    }
    .quick {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 24px 0 40px;
    }
    .quick a {
      display: inline-flex;
      align-items: center;
      padding: 8px 14px;
      border-radius: 999px;
      background: var(--panel);
      border: 1px solid var(--line);
      color: var(--text);
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.1s ease;
    }
    .quick a:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
    section {
      margin-bottom: 48px;
    }
    h2 {
      font-size: 15px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--muted);
      margin: 0 0 12px;
    }
    .endpoint {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      padding: 14px 0;
      border-bottom: 1px solid var(--line);
    }
    .endpoint:last-child { border-bottom: none; }
    .method {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 12px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      background: var(--panel);
      border: 1px solid var(--line);
      color: var(--muted);
      flex-shrink: 0;
      min-width: 52px;
      text-align: center;
    }
    .path {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 14px;
      color: var(--accent);
      text-decoration: none;
    }
    .path:hover { text-decoration: underline; }
    .desc {
      color: var(--muted);
      font-size: 14px;
      margin-top: 2px;
    }
    .note {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 16px 20px;
      font-size: 14px;
      color: var(--muted);
    }
    .note strong { color: var(--text); }
    footer {
      margin-top: 64px;
      padding-top: 24px;
      border-top: 1px solid var(--line);
      font-size: 13px;
      color: var(--muted);
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    footer a { color: var(--link); text-decoration: none; }
    footer a:hover { text-decoration: underline; }
    .pill {
      display: inline-block;
      font-size: 11px;
      padding: 1px 7px;
      border-radius: 999px;
      background: var(--accent);
      color: white;
      font-weight: 600;
      vertical-align: middle;
      margin-left: 6px;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <a href="/" class="brand">OpenFlightClaims</a>
      <a href="/" style="font-size:13px;color:var(--muted);text-decoration:none;">← Back to site</a>
    </header>

    <h1>API &amp; Data Access</h1>
    <p class="tag">Read-only, no authentication, heavily cached. Built for developers, scrapers, and AI agents.</p>

    <div class="quick">
      <a href="/api/airlines">/api/airlines.json</a>
      <a href="/airlines.json">/airlines.json</a>
      <a href="/api/meta">/api/meta</a>
      <a href="/openapi.json">/openapi.json</a>
      <a href="/llms.txt">/llms.txt</a>
      <a href="/llms-full.txt">/llms-full.txt</a>
      <a href="/airlines.md">/airlines.md</a>
      <a href="/mcp">POST /mcp</a>
    </div>

    <section>
      <h2>JSON API</h2>
      <div class="endpoint">
        <div class="method">GET</div>
        <div>
          <a class="path" href="/api/airlines">/api/airlines</a>
          <div class="desc">All airline records (clean public shape). Supports <code>?pretty=1</code> and <code>?full=1</code></div>
        </div>
      </div>
      <div class="endpoint">
        <div class="method">GET</div>
        <div>
          <a class="path" href="/api/airlines/qatar-airways">/api/airlines/{slug}</a>
          <div class="desc">Single airline record (clean public shape) or 404. Supports <code>?pretty=1</code> and <code>?full=1</code></div>
        </div>
      </div>
      <div class="endpoint">
        <div class="method">GET</div>
        <div>
          <a class="path" href="/api/meta">/api/meta</a>
          <div class="desc">Project info, dataset stats, and all endpoint URLs. Supports <code>?pretty=1</code></div>
        </div>
      </div>
      <div class="endpoint">
        <div class="method">GET</div>
        <div>
          <a class="path" href="/airlines.json">/airlines.json</a>
          <div class="desc">Exact same data as /api/airlines (convenience alias for scrapers). Supports <code>?pretty=1</code></div>
        </div>
      </div>
    </section>

    <section>
      <h2>Markdown</h2>
      <div class="endpoint">
        <div class="method">GET</div>
        <div>
          <a class="path" href="/airlines.md">/airlines.md</a>
          <div class="desc">Full directory in clean Markdown (great for LLMs and docs)</div>
        </div>
      </div>
      <div class="endpoint">
        <div class="method">GET</div>
        <div>
          <a class="path" href="/airlines/qatar-airways.md">/airlines/{slug}.md</a>
          <div class="desc">Single airline as Markdown</div>
        </div>
      </div>
      <div class="endpoint">
        <div class="method">GET</div>
        <div>
          <a class="path" href="/guides/index.md">/guides/index.md</a>
          <div class="desc">All guides combined</div>
        </div>
      </div>
      <div class="endpoint">
        <div class="method">GET</div>
        <div>
          <a class="path" href="/contributing.md">/contributing.md</a>
          <div class="desc">Contribution guide</div>
        </div>
      </div>
    </section>

    <section>
      <h2>AI &amp; Agent Discovery</h2>
      <div class="endpoint">
        <div class="method">GET</div>
        <div>
          <a class="path" href="/llms.txt">/llms.txt</a>
          <div class="desc">Concise index for AI agents (llms.txt standard)</div>
        </div>
      </div>
      <div class="endpoint">
        <div class="method">GET</div>
        <div>
          <a class="path" href="/llms-full.txt">/llms-full.txt</a>
          <div class="desc">Complete AI access guide with dataset summary and examples</div>
        </div>
      </div>
      <div class="endpoint">
        <div class="method">GET</div>
        <div>
          <a class="path" href="/openapi.json">/openapi.json</a>
          <div class="desc">OpenAPI 3.1 specification (full schema + examples)</div>
        </div>
      </div>
    </section>

    <section>
      <h2>MCP Protocol</h2>
      <div class="endpoint">
        <div class="method">POST</div>
        <div>
          <a class="path" href="/mcp">/mcp</a>
          <div class="desc">JSON-RPC 2.0 MCP endpoint (tools: search, get claim link, list by country/region, etc.)</div>
        </div>
      </div>
      <div class="endpoint">
        <div class="method">GET</div>
        <div>
          <a class="path" href="/mcp.json">/mcp.json</a>
          <div class="desc">MCP server manifest</div>
        </div>
      </div>
    </section>

    <div class="note">
      <strong>Notes</strong><br>
      • All endpoints are static and served with long-lived cache headers.<br>
      • JSON endpoints support <code>?pretty=1</code> for readable output and <code>?full=1</code> for complete internal records (with verification metadata).<br>
      • No authentication or rate limits. Please be reasonable.<br>
      • See OpenAPI spec for the exact public schema.
    </div>

    <footer>
      <a href="/">Home</a>
      <a href="https://github.com/OWConnoi/OpenFlightClaims">GitHub</a>
      <a href="/contributing.md">Contributing</a>
      <span style="margin-left:auto">OpenFlightClaims — community airline claim directory</span>
    </footer>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
