# AI & Programmatic Access

OpenFlightClaims is designed for AI agents, LLMs, crawlers, and developers. All endpoints are read-only, require no auth, and use cache-friendly responses.

## Endpoints

### JSON APIs

| Endpoint | Description |
|---|---|
| `GET /api/airlines` | All airline records |
| `GET /api/airlines/{slug}` | Single airline record |
| `GET /api/meta` | Project metadata and stats |
| `GET /airlines.json` | Raw JSON dataset |
| `GET /openapi.json` | OpenAPI 3.1 specification |

### Markdown

| Endpoint | Description |
|---|---|
| `GET /airlines.md` | Full directory in Markdown |
| `GET /airlines/{slug}.md` | Single airline in Markdown |
| `GET /guides/index.md` | All guides |
| `GET /contributing.md` | Contribution guide |

### AI Discovery

| Endpoint | Description |
|---|---|
| `GET /llms.txt` | Concise AI agent index |
| `GET /llms-full.txt` | Full access guide |

### MCP

| Endpoint | Description |
|---|---|
| `POST /mcp` | MCP-compatible JSON-RPC (read-only) |
| `GET /mcp.json` | MCP server manifest |

## Cache

All endpoints include `Cache-Control: public, max-age=3600, s-maxage=86400`.

## Disclaimer

OpenFlightClaims is not legal advice. External airline links can change. Verify against official airline websites.
