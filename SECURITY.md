# Security Policy

## Supported Versions

| Version | Supported |
| --- | --- |
| `1.7.x` | Yes |
| `< 1.7.0` | Upgrade to latest `1.7.x` |

## Runtime & Data Handling

- **Zero third-party dependencies:** `bin/finops.mjs` uses only built-in Node.js modules (`node:fs`, `node:readline`).
- **Offline pre-flight validation:** `validate_bank_routing` and `audit_bank_file_format` run entirely in memory without transmitting bank account identifiers, IBANs, or routing numbers over the network.
- **No credential persistence:** Optional `APIFY_TOKEN` credentials for cloud payment/invoice generation are read strictly from environment variables at runtime and never logged or written to disk.

## Reporting a Vulnerability

Please report security issues privately rather than opening a public issue:

- **GitHub Security Advisories:** https://github.com/Geornaden/finops-studio/security/advisories/new
- **Email:** `geornaden@gmail.com`

You will receive an acknowledgment within 48 hours and a remediation update as soon as a fix is verified.
