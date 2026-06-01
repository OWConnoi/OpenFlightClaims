# MCP Support

OpenFlightClaims provides a read-only, stateless MCP-compatible endpoint.

## Endpoint

- **URL:** `POST /mcp`
- **Content-Type:** `application/json`
- **Protocol:** JSON-RPC 2.0

## Manifest

- **URL:** `GET /mcp.json`
- Returns the MCP server manifest with tool listings.

## Available Tools

| Tool | Description |
|---|---|
| `search_airlines` | Search airlines by name or code |
| `get_airline_claim_link` | Get official claim link for an airline |
| `get_airline` | Get full airline record |
| `list_airlines_by_country` | List airlines by country |
| `list_airlines_by_region` | List airlines by region |
| `get_report_broken_link_url` | Get GitHub issue URL for reporting broken links |
| `get_update_link_url` | Get GitHub issue URL for suggesting updates |
| `get_dataset_meta` | Get dataset metadata and endpoints |

## Example

Request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "search_airlines",
    "arguments": { "query": "british" }
  }
}
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [{
      "type": "text",
      "text": "{\"results\":[...],\"count\":1}"
    }]
  }
}
```

## Limitations

This is a **stateless, read-only** MCP endpoint deployed on Vercel serverless functions. It does not support:

- Server-Sent Events (SSE) streaming
- Persistent connections
- Write operations

For more complex use cases, use the JSON API (`/api/airlines`) or OpenAPI spec (`/openapi.json`).

## Future Plan

A full MCP server with SSE support may be added in the future. The current `/mcp` endpoint provides functional read-only access for AI agents.
