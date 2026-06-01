# API Reference

OpenFlightClaims exposes a read-only JSON API and other machine-readable formats. No authentication required.

**Base URL:** `https://openflightclaims.com`

## Endpoints

### GET /api/airlines

Returns all airline records in the public projection.

Query params:
- `?pretty=1` — pretty-printed JSON
- `?full=1` — complete internal records

### GET /api/airlines/{slug}

Returns a single airline. Returns 404 if not found.

### GET /api/meta

Returns project metadata, dataset stats, and endpoint list.

### GET /openapi.json

Returns the OpenAPI 3.1 specification.

## Cache

All endpoints include `Cache-Control: public, max-age=3600, s-maxage=86400`.
