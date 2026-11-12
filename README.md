# FinOps Studio — Deterministic Banking, Payroll, Treasury & E-Invoicing APIs (REST + MCP + n8n)

[![Live Hub](https://img.shields.io/badge/Live_Sandbox_&_Docs-finops--studio-10b981?style=for-the-badge)](https://geornaden.github.io/finops-studio/)
[![Apify Store](https://img.shields.io/badge/Cloud_APIs-Apify_Store-38bdf8?style=for-the-badge)](https://apify.com/finops_studio)
[![MCP Ready](https://img.shields.io/badge/MCP-Claude_%7C_Cursor_%7C_Windsurf-8b5cf6?style=for-the-badge)](#model-context-protocol-mcp-for-ai-agents)

**Zero-hallucination banking, payroll, cash-management, and tax e-invoicing file engines** for CFOs, accounting firms, ERP integrators (**NetSuite, SAP, Odoo, QuickBooks, Xero, Dynamics 365**), workflow builders (**n8n, Make.com, Zapier**), and **AI Agents (MCP)**.

> **Why deterministic engines instead of LLMs?**  
> Commercial banking gateways reject an entire payroll or treasury batch over a single shifted character column, a failed ISO 13616 MOD-97 IBAN check digit, an unbalanced NACHA ABA routing hash, or a floating-point penny rounding mismatch. FinOps Studio runs strict mathematical checksums and fixed-width/XML schema engines in isolated cloud containers—at **$0/month** subscription cost.

---

## 10 Production Financial File Engines

| # | Banking / Tax Standard | Region | Cloud API Endpoint | Pay-Per-Use |
|---|---|---|---|---|
| 1 | **ISO 20022 SEPA XML (`pain.001.001.09` & `pain.008.001.08`)** + 2026 Structured Addresses & MOD-97 IBAN Check | Europe (40+ Countries) | [`finops_studio/sepa-xml-generator`](https://apify.com/finops_studio/sepa-xml-generator) | `$0.02` / tx |
| 2 | **EU EN 16931 E-Invoice XML (`Peppol BIS 3.0`, `XRechnung 3.0`, `Factur-X / ZUGFeRD`)** | EU (BE, DE, FR, NL, ES, IT) | [`finops_studio/eu-einvoice-xml-generator`](https://apify.com/finops_studio/eu-einvoice-xml-generator) | `$0.05` / invoice |
| 3 | **US 94-Character NACHA ACH Generator (`PPD`, `CCD`, `WEB`)** + ABA MOD-10 Routing Check | United States | [`finops_studio/nacha-ach-file-generator`](https://apify.com/finops_studio/nacha-ach-file-generator) | `$0.02` / entry |
| 4 | **Corporate BAI2 Bank Statement Parser** (`01`/`02`/`03`/`16`/`88`/`49`/`98`/`99` → JSON/CSV) | US & Global Treasury | [`finops_studio/bai2-bank-statement-parser`](https://apify.com/finops_studio/bai2-bank-statement-parser) | `$0.02` / tx |
| 5 | **German DATEV Buchungsstapel (`EXTF v700` CSV)** (`SKR03` / `SKR04`, `BU-Schlüssel`) | Germany & Austria | [`finops_studio/datev-buchungsstapel-generator`](https://apify.com/finops_studio/datev-buchungsstapel-generator) | `$0.02` / booking |
| 6 | **Australian 120-Character ABA Direct Entry (`.aba` / Cemtex)** (CBA, NAB, Westpac, ANZ) | Australia | [`finops_studio/aba-cemtex-file-generator`](https://apify.com/finops_studio/aba-cemtex-file-generator) | `$0.02` / row |
| 7 | **ISO 20022 `pain.002` Bank Rejection Status Decoder** (`AC04`, `AM04`, `BE04`, `MD01` → Plain English) | Global ISO 20022 | [`finops_studio/iso20022-pain002-status-parser`](https://apify.com/finops_studio/iso20022-pain002-status-parser) | `$0.02` / status |
| 8 | **UK BACS Standard 18 (100-Character) Direct Credit & Debit Generator** (`VOL1`/`HDR1`/`UHL1`/`UTL1`) | United Kingdom | [`finops_studio/uk-bacs-standard18-generator`](https://apify.com/finops_studio/uk-bacs-standard18-generator) | `$0.02` / row |
| 9 | **Canadian Payments Association CPA-005 (1464-Byte) EFT Generator** (RBC, TD, BMO, Scotiabank) | Canada | [`finops_studio/canada-cpa005-eft-generator`](https://apify.com/finops_studio/canada-cpa005-eft-generator) | `$0.02` / segment |
| 10 | **US Bank Payee Positive Pay Check Fraud File Generator** (BofA CashPro, Chase, Wells Fargo CEO, PNC) | United States | [`finops_studio/us-positive-pay-check-generator`](https://apify.com/finops_studio/us-positive-pay-check-generator) | `$0.02` / check |

---

## Quickstart: CLI, cURL, Node.js & Python

### 1. Zero-Install CLI (`npx`)
```bash
npx github:Geornaden/finops-studio list
npx github:Geornaden/finops-studio mcp-config
```

### 2. Direct Synchronous REST API (`cURL`)
```bash
curl -X POST "https://api.apify.com/v2/acts/finops_studio~sepa-xml-generator/run-sync-get-dataset-items?token=YOUR_APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "schemaVersion": "pain.001.001.09",
    "initiatingPartyName": "Acme Europe GmbH",
    "debtorName": "Acme Europe GmbH",
    "debtorIban": "DE89370400440532013000",
    "debtorBic": "COBADEFFXXX",
    "transactions": [
      {
        "name": "Nordic Cloud AB",
        "iban": "NL91ABNA0417164300",
        "amount": 1450.00,
        "remittanceInfo": "INV-2026-0891",
        "country": "NL",
        "townName": "Amsterdam"
      }
    ]
  }'
```

---

## Model Context Protocol (MCP) for AI Agents

Give **Claude Desktop**, **Cursor**, **Windsurf**, or any MCP-compatible AI agent deterministic banking and e-invoicing capabilities:

```json
{
  "mcpServers": {
    "finops-studio": {
      "url": "https://mcp.apify.com/?actors=finops_studio/sepa-xml-generator,finops_studio/eu-einvoice-xml-generator,finops_studio/nacha-ach-file-generator,finops_studio/bai2-bank-statement-parser,finops_studio/datev-buchungsstapel-generator,finops_studio/aba-cemtex-file-generator,finops_studio/iso20022-pain002-status-parser,finops_studio/uk-bacs-standard18-generator,finops_studio/canada-cpa005-eft-generator,finops_studio/us-positive-pay-check-generator",
      "headers": {
        "Authorization": "Bearer YOUR_APIFY_API_TOKEN"
      }
    }
  }
}
```

---

## Ready-to-Import `n8n` Workflow Blueprints
- [`workflows/n8n-sheets-to-sepa-xml.json`](./workflows/n8n-sheets-to-sepa-xml.json) — Google Sheets / ERP → 2026 ISO 20022 SEPA XML
- [`workflows/n8n-stripe-to-datev-and-einvoice.json`](./workflows/n8n-stripe-to-datev-and-einvoice.json) — Paid Stripe Invoice → EN 16931 Peppol XML + German DATEV EXTF CSV
- [`workflows/n8n-bank-sftp-bai2-and-pain002-alerts.json`](./workflows/n8n-bank-sftp-bai2-and-pain002-alerts.json) — Daily Bank SFTP BAI2 Reconciliation + Slack `pain.002` Rejection Fixes

---

## Regional Documentation & Guides
- **Interactive Preview Hub:** <https://geornaden.github.io/finops-studio/>
- **US Chase / BofA / Wells Fargo NACHA ACH:** [Guide](https://geornaden.github.io/finops-studio/convert-excel-csv-to-nacha-ach-chase-bofa-wells-fargo.html)
- **US Bank Check Positive Pay (CashPro / CEO / Chase):** [Guide](https://geornaden.github.io/finops-studio/us-positive-pay-check-file-generator-chase-bofa-wells-fargo.html)
- **2026 EPC SEPA `BE04` Structured Address Mandate:** [Guide](https://geornaden.github.io/finops-studio/fix-sepa-pain001-2026-structured-address-rejection.html)
- **UK BACS Standard 18 (Barclays / HSBC / Lloyds / NatWest):** [Guide](https://geornaden.github.io/finops-studio/uk-bacs-standard-18-file-generator.html)
- **Canada CPA-005 1464-Byte EFT (RBC / TD / BMO / Scotiabank):** [Guide](https://geornaden.github.io/finops-studio/canada-cpa-005-eft-file-generator.html)
- **Germany (`DE`):** [Stripe & Shopify zu DATEV Buchungsstapel & XRechnung](https://geornaden.github.io/finops-studio/stripe-shopify-zu-datev-buchungsstapel-konvertieren.html)
- **France (`FR`):** [Facturation Électronique 2026 — Peppol BIS 3.0 & Factur-X](https://geornaden.github.io/finops-studio/facturation-electronique-2026-peppol-factur-x-xml.html)
- **Belgium & Netherlands (`NL`/`BE`):** [SEPA XML & Peppol E-Facturatie 2026](https://geornaden.github.io/finops-studio/sepa-xml-pain001-peppol-belgie-nederland.html)
- **Spain (`ES`):** [Facturación Electrónica 2026 Peppol & SEPA XML](https://geornaden.github.io/finops-studio/facturacion-electronica-2026-peppol-sepa-xml-espana.html)
