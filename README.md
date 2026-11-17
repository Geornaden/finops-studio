# FinOps Studio — Deterministic Banking, Payroll, Treasury & E-Invoicing APIs (REST + MCP + n8n)

[![Live Hub](https://img.shields.io/badge/Live_Sandbox_&_Docs-finops--studio-10b981?style=for-the-badge)](https://geornaden.github.io/finops-studio/)
[![Apify Store](https://img.shields.io/badge/Cloud_APIs-Apify_Store-38bdf8?style=for-the-badge)](https://apify.com/finops_studio)
[![RapidAPI Hub](https://img.shields.io/badge/REST_APIs-RapidAPI_Hub-0284c7?style=for-the-badge)](https://rapidapi.com/user/Geornaden)
[![MCP Ready](https://img.shields.io/badge/MCP-Claude_%7C_Cursor_%7C_Windsurf-8b5cf6?style=for-the-badge)](#model-context-protocol-mcp-for-ai-agents)

[![FinOps Studio — 9 Live Banking, Payroll & E-Invoice APIs MCP on mcprush](https://mcprush.com/badge/finops-studio-banking-payroll-e-invoicing-mcp/score.svg)](https://mcprush.com/to/finops-studio-banking-payroll-e-invoicing-mcp?ref=badge)
[![EU E-Invoice XML Generator MCP on mcprush](https://mcprush.com/badge/eu-e-invoice-xml-generator-peppol-xrechnung-f-mcp/score.svg)](https://mcprush.com/to/eu-e-invoice-xml-generator-peppol-xrechnung-f-mcp?ref=badge)
[![Corporate BAI2 Bank Statement Parser MCP on mcprush](https://mcprush.com/badge/corporate-bai2-bank-statement-parser-to-json-mcp/score.svg)](https://mcprush.com/to/corporate-bai2-bank-statement-parser-to-json-mcp?ref=badge)
[![German DATEV Buchungsstapel CSV Generator MCP on mcprush](https://mcprush.com/badge/german-datev-buchungsstapel-extf-csv-generato-mcp/score.svg)](https://mcprush.com/to/german-datev-buchungsstapel-extf-csv-generato-mcp?ref=badge)
[![Geornaden/finops-studio MCP server](https://glama.ai/mcp/servers/Geornaden/finops-studio/badges/score.svg)](https://glama.ai/mcp/servers/Geornaden/finops-studio)

**Zero-hallucination banking, payroll, cash-management, and tax e-invoicing file engines** for CFOs, accounting firms, ERP integrators (**NetSuite, SAP, Odoo, QuickBooks, Xero, Dynamics 365**), workflow builders (**n8n, Make.com, Zapier**), and **AI Agents (MCP)**.

> **Why deterministic engines instead of LLMs?**  
> Commercial banking gateways reject an entire payroll or treasury batch over a single shifted character column, a failed ISO 13616 MOD-97 IBAN check digit, an unbalanced NACHA ABA routing hash, or a floating-point penny rounding mismatch. FinOps Studio runs strict mathematical checksums and fixed-width/XML schema engines in isolated cloud containers—at **$0/month** subscription cost.

---

## 12 Production Financial File Engines

| # | Banking / Tax Standard | Region | Cloud API / Specs | Pay-Per-Use |
|---|---|---|---|---|
| 1 | **ISO 20022 SEPA XML (`pain.001.001.09` & `pain.008.001.08`)** + 2026 Structured Addresses & MOD-97 IBAN Check | Europe (40+ Countries) | [`finops_studio/sepa-xml-generator`](https://apify.com/finops_studio/sepa-xml-generator) | `$0.02` / tx |
| 2 | **EU EN 16931 E-Invoice XML (`Peppol BIS 3.0`, `EHF 3.0`, `XRechnung 3.0`, `Factur-X / ZUGFeRD`)** | EU & Nordics | [`finops_studio/eu-einvoice-xml-generator`](https://apify.com/finops_studio/eu-einvoice-xml-generator) | `$0.05` / invoice |
| 3 | **US 94-Character NACHA ACH Generator (`PPD`, `CCD`, `WEB`)** + ABA MOD-10 Routing Check | United States | [`finops_studio/nacha-ach-file-generator`](https://apify.com/finops_studio/nacha-ach-file-generator) | `$0.02` / entry |
| 4 | **Corporate BAI2 Bank Statement Parser** (`01`/`02`/`03`/`16`/`88`/`49`/`98`/`99` → JSON/CSV) | US & Global Treasury | [`finops_studio/bai2-bank-statement-parser`](https://apify.com/finops_studio/bai2-bank-statement-parser) | `$0.02` / tx |
| 5 | **German DATEV Buchungsstapel (`EXTF v700` CSV)** (`SKR03` / `SKR04`, `BU-Schlüssel`) | Germany & Austria | [`finops_studio/datev-buchungsstapel-generator`](https://apify.com/finops_studio/datev-buchungsstapel-generator) | `$0.02` / booking |
| 6 | **Australian 120-Character ABA Direct Entry (`.aba` / Cemtex)** (CBA, NAB, Westpac, ANZ) | Australia | [`finops_studio/aba-cemtex-file-generator`](https://apify.com/finops_studio/aba-cemtex-file-generator) | `$0.02` / row |
| 7 | **ISO 20022 `pain.002` Bank Rejection Status Decoder** (`AC04`, `AM04`, `BE04`, `MD01` → Plain English) | Global ISO 20022 | [`finops_studio/iso20022-pain002-status-parser`](https://apify.com/finops_studio/iso20022-pain002-status-parser) | `$0.02` / status |
| 8 | **UK BACS Standard 18 (100-Character) Direct Credit & Debit Generator** (`VOL1`/`HDR1`/`UHL1`/`UTL1`) | United Kingdom | [`finops_studio/uk-bacs-standard18-generator`](https://apify.com/finops_studio/uk-bacs-standard18-generator) | `$0.02` / row |
| 9 | **Canadian Payments Association CPA-005 (1464-Byte) EFT Generator** (RBC, TD, BMO, Scotiabank) | Canada | [`finops_studio/canada-cpa005-eft-generator`](https://apify.com/finops_studio/canada-cpa005-eft-generator) | `$0.02` / segment |
| 10 | **US Bank Payee Positive Pay Check Fraud File Generator** (BofA CashPro, Chase, Wells Fargo CEO, PNC) | United States | [Specs & Guide](https://geornaden.github.io/finops-studio/us-positive-pay-check-file-generator-chase-bofa-wells-fargo.html) | `$0.02` / check |
| 11 | **Spanish AEB Norma 43 (`Cuaderno 43`) 80-Char Bank Statement Parser** (CaixaBank, BBVA, Santander → JSON/CSV) | Spain | [Specs & Guide](https://geornaden.github.io/finops-studio/spanish-aeb-norma-43-cuaderno-43-bank-statement-parser.html) | `$0.02` / tx |
| 12 | **ISO 20022 `pacs.008.001.08` Fedwire Funds & SWIFT CBPR+ Wire XML Generator** (`AppHdr` + UUID v4 `UETR`) | US & Global Wires | [Specs & Guide](https://geornaden.github.io/finops-studio/fedwire-iso20022-pacs008-swift-cbpr-xml-generator.html) | `$0.02` / wire |

<details>
<summary><strong>90 Pre-Configured 1-Click Apify Store Use-Case Tasks (Deutsche Bank, ING, Mercury, Gusto, Stripe/Shopify to DATEV, Lexoffice, J.P. Morgan BAI2, NatWest, RBC &amp; more)</strong></summary>

- **SEPA XML (`pain.001` / `pain.008`):** [Wise, Revolut & Qonto CSV to SEPA XML](https://apify.com/finops_studio/sepa-xml-generator) • [NetSuite, Odoo & SAP Vendor SEPA XML](https://apify.com/finops_studio/sepa-xml-generator) • [SEPA Direct Debit (pain.008) Recurring Billing](https://apify.com/finops_studio/sepa-xml-generator) • [Fix SEPA BE04 Structured Address](https://apify.com/finops_studio/sepa-xml-generator) • [Deutsche Bank & Commerzbank SEPA XML](https://apify.com/finops_studio/sepa-xml-generator) • [ING, Rabobank & ABN AMRO SEPA XML](https://apify.com/finops_studio/sepa-xml-generator) • [BNP Paribas, Societe Generale & Credit Agricole SEPA](https://apify.com/finops_studio/sepa-xml-generator) • [UniCredit & Intesa Sanpaolo CBI SEPA](https://apify.com/finops_studio/sepa-xml-generator) • [CaixaBank, BBVA & Santander SEPA](https://apify.com/finops_studio/sepa-xml-generator) • [UBS, PostFinance & ZKB SEPA XML](https://apify.com/finops_studio/sepa-xml-generator)
- **EU E-Invoice XML (`Peppol` / `XRechnung` / `Factur-X`):** [Belgium 2026 Peppol BIS 3.0](https://apify.com/finops_studio/eu-einvoice-xml-generator) • [Germany XRechnung 3.0 + Leitweg-ID](https://apify.com/finops_studio/eu-einvoice-xml-generator) • [France 2026 Factur-X CII](https://apify.com/finops_studio/eu-einvoice-xml-generator) • [Stripe & Shopify to Peppol XML](https://apify.com/finops_studio/eu-einvoice-xml-generator) • [Norway EHF 3.0 & Peppol XML](https://apify.com/finops_studio/eu-einvoice-xml-generator) • [Netherlands Simplerinvoicing Peppol](https://apify.com/finops_studio/eu-einvoice-xml-generator) • [Sweden, Denmark & Finland Peppol](https://apify.com/finops_studio/eu-einvoice-xml-generator) • [Austria ebInterface & Peppol](https://apify.com/finops_studio/eu-einvoice-xml-generator) • [Odoo, NetSuite & SAP to Peppol](https://apify.com/finops_studio/eu-einvoice-xml-generator) • [Germany ZUGFeRD 2.3 CII XML](https://apify.com/finops_studio/eu-einvoice-xml-generator)
- **US NACHA ACH (94-Char):** [QuickBooks & Xero to Chase / BofA ACH](https://apify.com/finops_studio/nacha-ach-file-generator) • [US Payroll Direct Deposit (PPD)](https://apify.com/finops_studio/nacha-ach-file-generator) • [B2B Vendor AP (CCD) Wells Fargo & Citi](https://apify.com/finops_studio/nacha-ach-file-generator) • [Parse Raw NACHA .ach to JSON](https://apify.com/finops_studio/nacha-ach-file-generator) • [Mercury, Brex & Ramp Vendor ACH](https://apify.com/finops_studio/nacha-ach-file-generator) • [Gusto, Rippling & Deel Payroll ACH](https://apify.com/finops_studio/nacha-ach-file-generator) • [PNC PINACLE, US Bank & Truist ACH](https://apify.com/finops_studio/nacha-ach-file-generator) • [SVB & First Citizens Commercial ACH](https://apify.com/finops_studio/nacha-ach-file-generator) • [US E-Commerce WEB Debit ACH](https://apify.com/finops_studio/nacha-ach-file-generator) • [Property & HOA Rent Collection ACH](https://apify.com/finops_studio/nacha-ach-file-generator)
- **Corporate BAI2 Parser:** [J.P. Morgan & BofA CashPro BAI2 to Excel CSV](https://apify.com/finops_studio/bai2-bank-statement-parser) • [Wells Fargo CEO & CitiDirect BAI2 to NetSuite](https://apify.com/finops_studio/bai2-bank-statement-parser) • [HSBCnet, SVB & PNC Multi-Currency BAI2](https://apify.com/finops_studio/bai2-bank-statement-parser) • [BAI2 Record 88 Remittance Stitcher](https://apify.com/finops_studio/bai2-bank-statement-parser) • [U.S. Bank, Truist & Regions BAI2 to CSV](https://apify.com/finops_studio/bai2-bank-statement-parser) • [RBC, TD, BMO & Scotiabank BAI2 Parser](https://apify.com/finops_studio/bai2-bank-statement-parser) • [BAI2 to QuickBooks & Xero CSV](https://apify.com/finops_studio/bai2-bank-statement-parser) • [BAI2 to SAP, Oracle & Dynamics JSON](https://apify.com/finops_studio/bai2-bank-statement-parser) • [BAI2 ZBA Sweep (275/575) Reconciler](https://apify.com/finops_studio/bai2-bank-statement-parser) • [BAI2 Lockbox/ACH/Wire (115/165/195) Parser](https://apify.com/finops_studio/bai2-bank-statement-parser)
- **German DATEV EXTF v700:** [Stripe Payouts to DATEV SKR04](https://apify.com/finops_studio/datev-buchungsstapel-generator) • [Shopify & WooCommerce to DATEV SKR03](https://apify.com/finops_studio/datev-buchungsstapel-generator) • [Amazon & PayPal to DATEV Steuerberater](https://apify.com/finops_studio/datev-buchungsstapel-generator) • [SaaS B2B Reverse-Charge EU VAT DATEV](https://apify.com/finops_studio/datev-buchungsstapel-generator) • [Lexoffice & sevDesk to DATEV CSV](https://apify.com/finops_studio/datev-buchungsstapel-generator) • [eBay DE, Kaufland & OTTO to DATEV](https://apify.com/finops_studio/datev-buchungsstapel-generator) • [Mollie, Klarna & Adyen to DATEV](https://apify.com/finops_studio/datev-buchungsstapel-generator) • [GmbH Monthly Closing DATEV Online](https://apify.com/finops_studio/datev-buchungsstapel-generator) • [DACH E-Commerce VAT DATEV CSV](https://apify.com/finops_studio/datev-buchungsstapel-generator) • [Chargebee, Paddle & Lemon Squeezy DATEV](https://apify.com/finops_studio/datev-buchungsstapel-generator)
- **Australian BECS `.ABA`:** [Xero & MYOB to CommBank CommBiz .ABA](https://apify.com/finops_studio/aba-cemtex-file-generator) • [AU Payroll Code 53 (NAB / Westpac / ANZ)](https://apify.com/finops_studio/aba-cemtex-file-generator) • [AU Supplier AP Batch (Code 50)](https://apify.com/finops_studio/aba-cemtex-file-generator) • [Self-Balancing Contractor .ABA](https://apify.com/finops_studio/aba-cemtex-file-generator) • [Employment Hero & KeyPay to .ABA](https://apify.com/finops_studio/aba-cemtex-file-generator) • [Macquarie, Bendigo & Suncorp .ABA](https://apify.com/finops_studio/aba-cemtex-file-generator) • [NetSuite & SAP AU Subsidiary .ABA](https://apify.com/finops_studio/aba-cemtex-file-generator) • [AU Contractor & Creditor AP .ABA](https://apify.com/finops_studio/aba-cemtex-file-generator) • [NAB Connect & ANZ Transactive .ABA](https://apify.com/finops_studio/aba-cemtex-file-generator) • [Westpac Corporate Online Deskbank .ABA](https://apify.com/finops_studio/aba-cemtex-file-generator)
- **ISO 20022 `pain.002` Decoder:** [SEPA Rejection Decoder (AC04/AM04/BE04)](https://apify.com/finops_studio/iso20022-pain002-status-parser) • [EBICS & SFTP pain.002 to Slack/Jira CSV](https://apify.com/finops_studio/iso20022-pain002-status-parser) • [SWIFT & CGI-MP Exception Extractor](https://apify.com/finops_studio/iso20022-pain002-status-parser) • [SEPA Direct Debit MD01/MS02 Decoder](https://apify.com/finops_studio/iso20022-pain002-status-parser) • [Deutsche Bank & Commerzbank EBICS pain.002](https://apify.com/finops_studio/iso20022-pain002-status-parser) • [BNP Paribas, ING & Rabobank pain.002](https://apify.com/finops_studio/iso20022-pain002-status-parser) • [NetSuite, SAP & Odoo pain.002 Reconciler](https://apify.com/finops_studio/iso20022-pain002-status-parser) • [AC01/AC04/AM04/RC01 Reason Decoder](https://apify.com/finops_studio/iso20022-pain002-status-parser) • [UBS, PostFinance & ZKB pain.002](https://apify.com/finops_studio/iso20022-pain002-status-parser) • [Batch Multiple pain.002 XML to CSV](https://apify.com/finops_studio/iso20022-pain002-status-parser)
- **UK BACS Standard 18:** [Sage, Xero & BrightPay to BACS 18](https://apify.com/finops_studio/uk-bacs-standard18-generator) • [Barclays, HSBC, Lloyds & NatWest Payroll](https://apify.com/finops_studio/uk-bacs-standard18-generator) • [UK Supplier Code 99 + CONTRA](https://apify.com/finops_studio/uk-bacs-standard18-generator) • [UK BACS Direct Debit (01/17/18)](https://apify.com/finops_studio/uk-bacs-standard18-generator) • [NatWest & RBS Bankline BACS 18](https://apify.com/finops_studio/uk-bacs-standard18-generator) • [Lloyds & Santander UK BACS 18](https://apify.com/finops_studio/uk-bacs-standard18-generator) • [IRIS, Staffology & Moneysoft BACS](https://apify.com/finops_studio/uk-bacs-standard18-generator) • [UK Corporate GBP Vendor BACS 18](https://apify.com/finops_studio/uk-bacs-standard18-generator) • [NetSuite & Dynamics 365 UK BACS](https://apify.com/finops_studio/uk-bacs-standard18-generator) • [UK SaaS & Membership AUDDIS DD](https://apify.com/finops_studio/uk-bacs-standard18-generator)
- **Canadian CPA-005 (1464-Byte):** [QuickBooks & Ceridian to RBC / TD EFT](https://apify.com/finops_studio/canada-cpa005-eft-generator) • [BMO, Scotiabank & CIBC Payroll EFT](https://apify.com/finops_studio/canada-cpa005-eft-generator) • [Canadian Vendor AP (Code 450)](https://apify.com/finops_studio/canada-cpa005-eft-generator) • [Desjardins & Multi-Bank CAD/USD EFT](https://apify.com/finops_studio/canada-cpa005-eft-generator) • [RBC Express 1464-Byte EFT](https://apify.com/finops_studio/canada-cpa005-eft-generator) • [TD Commercial Banking EFT](https://apify.com/finops_studio/canada-cpa005-eft-generator) • [ScotiaConnect, BMO & CIBC Vendor EFT](https://apify.com/finops_studio/canada-cpa005-eft-generator) • [National Bank, ATB & Credit Union EFT](https://apify.com/finops_studio/canada-cpa005-eft-generator) • [Dayforce, Humi & Wagepoint Payroll EFT](https://apify.com/finops_studio/canada-cpa005-eft-generator) • [Canadian PAD (Code 460) Debit EFT](https://apify.com/finops_studio/canada-cpa005-eft-generator)

</details>

---

## Quickstart: CLI, cURL, Node.js & Python

### 1. Zero-Install CLI, Pre-Flight Checksum Doctor & Stdio MCP Server (`npx` v1.5.0)
```bash
npx -y github:Geornaden/finops-studio mcp
npx github:Geornaden/finops-studio list
npx github:Geornaden/finops-studio doctor ./batch.csv
npx github:Geornaden/finops-studio mcp-config
npx github:Geornaden/finops-studio openapi
APIFY_TOKEN=YOUR_APIFY_TOKEN npx github:Geornaden/finops-studio run sepa ./payload.json --out ./sepa.xml
```

### 1b. OpenAPI 3.1 Spec, Postman Collection, 2026 Comparison & AI Discovery
- **OpenAPI 3.1 Specs (Custom GPT Actions / Copilot Studio / Retool):** [`openapi-edge.json` (includes Zero-Auth 2-Row Demo)](https://geornaden.github.io/finops-studio/openapi-edge.json) • [`openapi.json`](https://geornaden.github.io/finops-studio/openapi.json)
- **Postman Collection v2.1:** [`workflows/finops-studio-postman-collection.json`](./workflows/finops-studio-postman-collection.json)
- **60-Second OpenAI ChatGPT Store Blueprint:** [`workflows/custom-gpt-finops-file-doctor.md`](./workflows/custom-gpt-finops-file-doctor.md)
- **2026 Software & Pricing Comparison (`FinOps Studio` vs. `ACH Universal` / `Invopop` / `IBAN.com`):** [View Comparison Guide](https://geornaden.github.io/finops-studio/best-sepa-xml-nacha-ach-bai2-peppol-datev-software-comparison-2026.html) • [`llms-full.txt`](https://geornaden.github.io/finops-studio/llms-full.txt) • [`.well-known/mcp.json`](https://geornaden.github.io/finops-studio/.well-known/mcp.json)

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

### Option A: Zero-Install Local `stdio` MCP Server (Works Offline for Routing & Format Audits!)
```json
{
  "mcpServers": {
    "finops-studio": {
      "command": "npx",
      "args": ["-y", "github:Geornaden/finops-studio", "mcp"],
      "env": {
        "APIFY_TOKEN": "YOUR_OPTIONAL_APIFY_TOKEN"
      }
    }
  }
}
```

### Option B: Hosted Remote Cloud MCP Gateway
```json
{
  "mcpServers": {
    "finops-studio": {
      "url": "https://mcp.apify.com/?actors=finops_studio/sepa-xml-generator,finops_studio/eu-einvoice-xml-generator,finops_studio/nacha-ach-file-generator,finops_studio/bai2-bank-statement-parser,finops_studio/datev-buchungsstapel-generator,finops_studio/aba-cemtex-file-generator,finops_studio/iso20022-pain002-status-parser,finops_studio/uk-bacs-standard18-generator,finops_studio/canada-cpa005-eft-generator",
      "headers": {
        "Authorization": "Bearer YOUR_APIFY_API_TOKEN"
      }
    }
  }
}
```

### Option C: Zero-Auth 2-Row Remote Cloud MCP Preview (Try Instantly — No Token Needed!)
```json
{
  "mcpServers": {
    "finops-studio-preview": {
      "url": "https://finops-rapidapi-edge.ria-rader.workers.dev/public-mcp"
    }
  }
}
```

### Zero-Install Google Sheets `=IMPORTDATA()` Formula (10 Rows Free)
Paste straight into Google Sheets cell `B2` to validate any vendor IBAN, US ABA routing #, UK Sort Code, AU BSB, or EU VAT ID (no add-on required — [Interactive Builder](https://geornaden.github.io/finops-studio/google-sheets-excel-importdata-iban-aba-formula.html) &bull; [Free Blog Embed Widget](https://geornaden.github.io/finops-studio/free-embeddable-iban-aba-routing-validator-widget.html)):
```excel
=IMPORTDATA("https://finops-rapidapi-edge.ria-rader.workers.dev/v1/sheet/check?q="&ENCODEURL(A2)&"&row="&ROW())
```

### Independent MCPRush Tool-List Grade A Verified Servers

[![FinOps Studio — 9 Live Banking, Payroll & E-Invoice APIs MCP server](https://mcprush.com/badge/finops-studio-banking-payroll-e-invoicing-mcp/card.svg)](https://mcprush.com/to/finops-studio-banking-payroll-e-invoicing-mcp?ref=badge)
[![Corporate BAI2 Bank Statement Parser to JSON & CSV MCP server](https://mcprush.com/badge/corporate-bai2-bank-statement-parser-to-json-mcp/card.svg)](https://mcprush.com/to/corporate-bai2-bank-statement-parser-to-json-mcp?ref=badge)
[![EU E-Invoice XML Generator (Peppol, XRechnung, Factur-X) MCP server](https://mcprush.com/badge/eu-e-invoice-xml-generator-peppol-xrechnung-f-mcp/card.svg)](https://mcprush.com/to/eu-e-invoice-xml-generator-peppol-xrechnung-f-mcp?ref=badge)
[![German DATEV Buchungsstapel EXTF CSV Generator MCP server](https://mcprush.com/badge/german-datev-buchungsstapel-extf-csv-generato-mcp/card.svg)](https://mcprush.com/to/german-datev-buchungsstapel-extf-csv-generato-mcp?ref=badge)

---

## Ready-to-Import `n8n`, `GitHub Actions` & `Make.com` Workflow Blueprints + Python/Node.js Cookbook
- **[Official GitHub Action (`Geornaden/finops-bank-validator-action@v1`)](https://github.com/Geornaden/finops-bank-validator-action)** — Pre-flight IBAN MOD-97, US ABA MOD-10, SEPA `BE04` & fixed-width validator + Cloud Bank File Generator Action (`v1.0.0`)
- [`workflows/github-actions-scheduled-sepa-nacha-peppol.yml`](./workflows/github-actions-scheduled-sepa-nacha-peppol.yml) — **GitHub Actions Scheduled Treasury, Payroll & Tax Pipeline** (`CODEOWNERS` CFO PR sign-off + `npx github:Geornaden/finops-studio`) + [CI/CD Guide](https://geornaden.github.io/finops-studio/github-actions-ci-cd-sepa-nacha-peppol-bank-file-validation.html)
- [`workflows/n8n-global-payroll-sepa-nacha-bacs-aba-cpa005.json`](./workflows/n8n-global-payroll-sepa-nacha-bacs-aba-cpa005.json) — **5-Country Global Payroll Router** (`US` NACHA ACH, `EU` SEPA XML, `GB` BACS Standard 18, `AU` ABA Cemtex, `CA` CPA-005 EFT) + [Architecture Guide](https://geornaden.github.io/finops-studio/multi-country-global-payroll-bank-files-sepa-nacha-bacs-aba-cpa005.html)
- [`cookbook/`](./cookbook) — Zero-dependency Python 3 & Node.js 20+ client scripts (`csv_to_sepa_pain001.mjs`, `payroll_csv_to_nacha_ach.py`, `bai2_to_json_and_csv.py`, `stripe_to_datev_skr04.py`)
- [`workflows/make-sheets-airtable-to-sepa-nacha-datev.json`](./workflows/make-sheets-airtable-to-sepa-nacha-datev.json) — Make.com Scenario Blueprint (Google Sheets / Airtable → SEPA XML)
- [`workflows/n8n-quickbooks-checks-to-positive-pay-and-ach.json`](./workflows/n8n-quickbooks-checks-to-positive-pay-and-ach.json) — QuickBooks / Xero → US Positive Pay + NACHA ACH
- [`workflows/n8n-netsuite-odoo-erp-to-sepa-and-bai2.json`](./workflows/n8n-netsuite-odoo-erp-to-sepa-and-bai2.json) — NetSuite / Odoo / SAP SFTP → SEPA XML + BAI2 Reconciliation
- [`workflows/n8n-sheets-to-sepa-xml.json`](./workflows/n8n-sheets-to-sepa-xml.json) — Google Sheets / ERP → 2026 ISO 20022 SEPA XML
- [`workflows/n8n-stripe-to-datev-and-einvoice.json`](./workflows/n8n-stripe-to-datev-and-einvoice.json) — Paid Stripe Invoice → EN 16931 Peppol XML + German DATEV EXTF CSV
- [`workflows/n8n-bank-sftp-bai2-and-pain002-alerts.json`](./workflows/n8n-bank-sftp-bai2-and-pain002-alerts.json) — Daily Bank SFTP BAI2 Reconciliation + Slack `pain.002` Rejection Fixes

---

## Free Browser Pre-Flight Validators & Regional Guides
- **Corporate Treasury `BAI2` Type Codes (`010`–`699`: `015`, `115`, `165`, `195`, `455`, `475`, `495`, `575`) & Record `16+88` Line Decoder:** [Launch BAI2 Reference](https://geornaden.github.io/finops-studio/bai2-type-codes-165-195-475-jpmorgan-bofa-wells-fargo-citi.html)
- **Free Bank File Format & Line-Length Auditor (`NACHA` 94, `ABA` 120, `BACS` 100, `CPA-005` 1464, `Norma 43` 80, `BAI2`, `SEPA BE04`):** [Launch Browser Auditor](https://geornaden.github.io/finops-studio/free-bank-file-format-detector-line-length-auditor.html)
- **Global APAC, LATAM & MENA Banking & E-Invoicing Validators (`BR` CNPJ, `MX` CLABE, `IN` IFSC/GSTIN, `JP` T-Number, `SG` UEN, `MY` MyInvois, `SA`/`AE` IBAN & TRN):** [Launch Global Validators](https://geornaden.github.io/finops-studio/global-apac-latam-mena-einvoicing-banking-validators.html)
- **Free IBAN MOD-97, US ABA Routing & ISO 20022 Error Code Lookup:** [Launch Checker](https://geornaden.github.io/finops-studio/free-iban-routing-number-pain002-validator.html)
- **Free UK Sort Code, Australian BSB & Canadian CPA-005 Transit Converter:** [Launch Checker](https://geornaden.github.io/finops-studio/free-uk-sort-code-au-bsb-canada-transit-checker.html)
- **Interactive Preview Hub:** <https://geornaden.github.io/finops-studio/>
- **US Fedwire Funds & SWIFT CBPR+ `pacs.008` Wire XML:** [Guide](https://geornaden.github.io/finops-studio/fedwire-iso20022-pacs008-swift-cbpr-xml-generator.html)
- **Spanish AEB Norma 43 (`Cuaderno 43`) Bank Statement Parser:** [Guide](https://geornaden.github.io/finops-studio/spanish-aeb-norma-43-cuaderno-43-bank-statement-parser.html)
- **Austria & Nordics (`AT`/`NO`/`SE`/`DK`/`FI` — EHF 3.0, NemHandel, Peppol & SEPA):** [Guide](https://geornaden.github.io/finops-studio/sepa-xml-peppol-ehf-finvoice-austria-nordics.html)
- **Ireland, Portugal & Luxembourg (`IE`/`PT`/`LU` — BOI, AIB, Millennium bcp, Spuerkeess, MultiLine SEPA & Peppol):** [Guide](https://geornaden.github.io/finops-studio/ireland-portugal-luxembourg-sepa-xml-pain001-peppol-api.html)
- **Romania, Czechia, Hungary & Greece (`RO`/`CZ`/`HU`/`GR` — RO e-Factura UBL, Peppol BIS 3.0 & SEPA):** [Guide](https://geornaden.github.io/finops-studio/romania-efactura-czechia-hungary-greece-sepa-xml-peppol-api.html)
- **Italy (`IT` — Bonifici CBI SEPA XML & Peppol UE):** [Guide](https://geornaden.github.io/finops-studio/fatturazione-elettronica-peppol-bonifico-sepa-xml-italia.html)
- **Poland (`PL` — KSeF 2026 Exporter Peppol & Przelewy SEPA):** [Guide](https://geornaden.github.io/finops-studio/ksef-2026-peppol-efaktura-przelewy-sepa-xml-polska.html)
- **US Chase / BofA / Wells Fargo NACHA ACH:** [CSV to ACH Guide](https://geornaden.github.io/finops-studio/convert-excel-csv-to-nacha-ach-chase-bofa-wells-fargo.html) • [R01–R85 Return & NOC Codes + Record 6 Slicer](https://geornaden.github.io/finops-studio/nacha-ach-return-codes-r01-r02-r03-r10-r29-sec-codes-guide.html)
- **US Bank Check Positive Pay (CashPro / CEO / Chase):** [Guide](https://geornaden.github.io/finops-studio/us-positive-pay-check-file-generator-chase-bofa-wells-fargo.html)
- **2026 EPC SEPA `BE04` Structured Address Mandate:** [Guide](https://geornaden.github.io/finops-studio/fix-sepa-pain001-2026-structured-address-rejection.html)
- **UK BACS Standard 18 (Barclays / HSBC / Lloyds / NatWest):** [Guide](https://geornaden.github.io/finops-studio/uk-bacs-standard-18-file-generator.html)
- **Canada CPA-005 1464-Byte EFT (RBC / TD / BMO / Scotiabank):** [Guide](https://geornaden.github.io/finops-studio/canada-cpa-005-eft-file-generator.html)
- **Germany (`DE`):** [Stripe & Shopify zu DATEV Buchungsstapel & XRechnung](https://geornaden.github.io/finops-studio/stripe-shopify-zu-datev-buchungsstapel-konvertieren.html) • [DATEV BU-Schlüssel & SKR03/SKR04 Tabelle](https://geornaden.github.io/finops-studio/datev-bu-schluessel-skr03-skr04-tabelle-buchungsstapel-api.html)
- **France (`FR`):** [Facturation Électronique 2026 — Peppol BIS 3.0 & Factur-X](https://geornaden.github.io/finops-studio/facturation-electronique-2026-peppol-factur-x-xml.html)
- **Belgium & Netherlands (`NL`/`BE`):** [SEPA XML & Peppol E-Facturatie 2026](https://geornaden.github.io/finops-studio/sepa-xml-pain001-peppol-belgie-nederland.html)
- **Spain (`ES`):** [Facturación Electrónica 2026 Peppol & SEPA XML](https://geornaden.github.io/finops-studio/facturacion-electronica-2026-peppol-sepa-xml-espana.html)
