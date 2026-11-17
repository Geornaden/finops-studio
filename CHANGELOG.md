# Changelog

All notable changes to FinOps Studio are documented in this file.

## [1.7.0] - 2026-11-16
### Changed
- Upgraded all 11 stdio MCP tool definitions in `bin/finops.mjs` to explicit, strongly typed `snake_case` JSON Schemas with `additionalProperties: false` and explicit nested item schemas (eliminating generic `payload` wrappers).
- Disambiguated tool names and descriptions (`validate_bank_routing`, `audit_bank_file_format`, `generate_sepa_xml`, `generate_eu_einvoice_xml`, `generate_nacha_ach_file`, `parse_bai2_statement`, `generate_datev_csv`, `generate_australian_aba_file`, `parse_pain002_status_xml`, `generate_uk_bacs_file`, `generate_canada_cpa005_file`).
- Added MCP `annotations` (`title`, `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`) on all 11 tools and seamless `snake_case` -> `camelCase` payload translation for Cloud API calls.
### Added
- `SECURITY.md` security & runtime data-handling policy.
- `CHANGELOG.md` release history.

## [1.6.0] - 2026-11-16
### Added
- Added `glama.json` maintainer configuration and hardened stdio MCP handshake (`protocolVersion` negotiation, `resources/list`, and `prompts/list`).
- Added live Glama score badge, `AGENTS.md`, `llms-full.txt`, and `openapi-edge.json` v1.6.0 discovery assets.

## [1.5.0] - 2026-11-16
### Added
- Shipped runnable zero-dependency MCP JSON-RPC 2.0 `stdio` server in `bin/finops.mjs` (`npx github:Geornaden/finops-studio mcp`) plus `Dockerfile`.

## [1.4.0] - 2026-11-13
### Added
- Published OpenAPI 3.1 spec, Postman collection, CLI checksum `doctor` command, and live pre-flight sandbox.

## [1.3.0] - 2026-11-13
### Added
- Expanded FinOps Studio to 12 deterministic banking, payroll, treasury, and e-invoicing APIs (adding Fedwire `pacs.008` and Spanish AEB Norma 43).

## [1.2.0] - 2026-11-12
### Added
- Initial release of FinOps Studio CLI, Cloud APIs, MCP configurations, and n8n workflow blueprints.
