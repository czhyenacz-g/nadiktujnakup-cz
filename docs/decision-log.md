# Decision Log

## Initial MVP Decisions

### Real Rohlik Integration Is Mocked

The MVP uses `MockCartProvider` only. It does not call Rohlik, MCP, or any merchant API.

### No Credentials In Frontend

SECURITY: Rohlik credentials, sessions, and tokens must never be stored directly in frontend code.

### Cart Provider Uses An Interface

The `CartProvider` interface allows the UI to depend on a typed contract instead of a concrete provider.

### Parser Is Deterministic For MVP

The parser recognizes a small set of Czech grocery terms and vague meal phrases. This keeps behavior predictable and easy to test or replace later.

### User Must Confirm Real Order Externally

SECURITY: The app must not silently place real orders. Final confirmation belongs on the merchant side.

### Codebase Is Optimized For AI-Assisted Maintenance

Folders are organized by responsibility, docs describe common edits, and future integration points are marked with `TODO(integration):`.
