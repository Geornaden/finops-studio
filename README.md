# FinOps Studio — Deterministic Banking, Payroll, Treasury & E-Invoicing APIs (REST + MCP + n8n)

[![Live Hub](https://img.shields.io/badge/Live_Sandbox_&_Docs-finops--studio-10b981?style=for-the-badge)](https://geornaden.github.io/finops-studio/)
[![Apify Store](https://img.shields.io/badge/Cloud_APIs-Apify_Store-38bdf8?style=for-the-badge)](https://apify.com/finops_studio)
[![RapidAPI Hub](https://img.shields.io/badge/REST_APIs-RapidAPI_Hub-0284c7?style=for-the-badge)](https://rapidapi.com/user/Geornaden)
[![MCP Ready](https://img.shields.io/badge/MCP-Claude_%7C_Cursor_%7C_Windsurf-8b5cf6?style=for-the-badge)](#model-context-protocol-mcp-for-ai-agents)

[![FinOps Studio — 9 Live Banking, Payroll & E-Invoice APIs MCP on mcprush](https://mcprush.com/badge/finops-studio-banking-payroll-e-invoicing-mcp/score.svg)](https://mcprush.com/to/finops-studio-banking-payroll-e-invoicing-mcp?ref=badge)
[![EU E-Invoice XML Generator MCP on mcprush](https://mcprush.com/badge/eu-e-invoice-xml-generator-peppol-xrechnung-f-mcp/score.svg)](https://mcprush.com/to/eu-e-invoice-xml-generator-peppol-xrechnung-f-mcp?ref=badge)
[![Corporate BAI2 Bank Statement Parser MCP on mcprush](https://mcprush.com/badge/corporate-bai2-bank-statement-parser-to-json-mcp/score.svg)](https://mcprush.com/to/corporate-bai2-bank-statement-parser-to-json-mcp?ref=badge)
[![German DATEV Buchungsstapel CSV Generator MCP on mcprush](https://mcprush.com/badge/german-datev-buchungsstapel-extf-csv-generato-mcp/score.svg)](https://mcprush.com/to/german-datev-buchungsstapel-extf-csv-generato-mcp?ref=badge)

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

- **SEPA XML (`pain.001` / `pain.008`):** [Wise, Revolut & Qonto CSV to SEPA XML](https://apify.com/finops_studio/sepa-xml-generator/tasks/wise-revolut-qonto-csv-to-sepa-pain001-xml) • [NetSuite, Odoo & SAP Vendor SEPA XML](https://apify.com/finops_studio/sepa-xml-generator/tasks/netsuite-odoo-sap-vendor-sepa-credit-transfer-xml) • [SEPA Direct Debit (pain.008) Recurring Billing](https://apify.com/finops_studio/sepa-xml-generator/tasks/sepa-direct-debit-pain008-recurring-billing-xml) • [Fix SEPA BE04 Structured Address](https://apify.com/finops_studio/sepa-xml-generator/tasks/fix-sepa-be04-2026-structured-postal-address-xml) • [Deutsche Bank & Commerzbank SEPA XML](https://apify.com/finops_studio/sepa-xml-generator/tasks/deutsche-bank-commerzbank-sepa-pain001-xml) • [ING, Rabobank & ABN AMRO SEPA XML](https://apify.com/finops_studio/sepa-xml-generator/tasks/ing-rabobank-abn-amro-netherlands-sepa-xml-maker) • [BNP Paribas, Societe Generale & Credit Agricole SEPA](https://apify.com/finops_studio/sepa-xml-generator/tasks/bnp-paribas-societe-generale-credit-agricole-sepa-xml) • [UniCredit & Intesa Sanpaolo CBI SEPA](https://apify.com/finops_studio/sepa-xml-generator/tasks/unicredit-intesa-sanpaolo-italia-cbi-sepa-xml-maker) • [CaixaBank, BBVA & Santander SEPA](https://apify.com/finops_studio/sepa-xml-generator/tasks/caixabank-bbva-santander-spain-cuaderno34-sepa-xml) • [UBS, PostFinance & ZKB SEPA XML](https://apify.com/finops_studio/sepa-xml-generator/tasks/ubs-postfinance-zkb-swiss-eur-sepa-pain001-xml)
- **EU E-Invoice XML (`Peppol` / `XRechnung` / `Factur-X`):** [Belgium 2026 Peppol BIS 3.0](https://apify.com/finops_studio/eu-einvoice-xml-generator/tasks/belgium-2026-peppol-bis-3-b2b-einvoice-xml) • [Germany XRechnung 3.0 + Leitweg-ID](https://apify.com/finops_studio/eu-einvoice-xml-generator/tasks/germany-xrechnung-3-leitweg-id-ubl-xml-generator) • [France 2026 Factur-X CII](https://apify.com/finops_studio/eu-einvoice-xml-generator/tasks/france-2026-factur-x-en16931-cii-einvoice-xml) • [Stripe & Shopify to Peppol XML](https://apify.com/finops_studio/eu-einvoice-xml-generator/tasks/stripe-shopify-invoice-to-peppol-ubl-einvoice-xml) • [Norway EHF 3.0 & Peppol XML](https://apify.com/finops_studio/eu-einvoice-xml-generator/tasks/norway-ehf-3-peppol-bis-billing-xml-generator) • [Netherlands Simplerinvoicing Peppol](https://apify.com/finops_studio/eu-einvoice-xml-generator/tasks/netherlands-simplerinvoicing-peppol-kvk-xml-maker) • [Sweden, Denmark & Finland Peppol](https://apify.com/finops_studio/eu-einvoice-xml-generator/tasks/nordic-sweden-denmark-finland-peppol-ubl-xml) • [Austria ebInterface & Peppol](https://apify.com/finops_studio/eu-einvoice-xml-generator/tasks/austria-ebinterface-peppol-b2g-ubl-xml-generator) • [Odoo, NetSuite & SAP to Peppol](https://apify.com/finops_studio/eu-einvoice-xml-generator/tasks/odoo-netsuite-sap-erp-to-peppol-xrechnung-xml) • [Germany ZUGFeRD 2.3 CII XML](https://apify.com/finops_studio/eu-einvoice-xml-generator/tasks/germany-zugferd-2-3-cii-en16931-einvoice-xml)
- **US NACHA ACH (94-Char):** [QuickBooks & Xero to Chase / BofA ACH](https://apify.com/finops_studio/nacha-ach-file-generator/tasks/quickbooks-xero-csv-to-chase-bofa-nacha-ach) • [US Payroll Direct Deposit (PPD)](https://apify.com/finops_studio/nacha-ach-file-generator/tasks/us-payroll-direct-deposit-ppd-nacha-ach-maker) • [B2B Vendor AP (CCD) Wells Fargo & Citi](https://apify.com/finops_studio/nacha-ach-file-generator/tasks/b2b-vendor-ap-ccd-ach-batch-wells-fargo-citi) • [Parse Raw NACHA .ach to JSON](https://apify.com/finops_studio/nacha-ach-file-generator/tasks/parse-raw-nacha-ach-94-char-file-to-json) • [Mercury, Brex & Ramp Vendor ACH](https://apify.com/finops_studio/nacha-ach-file-generator/tasks/mercury-brex-ramp-startup-vendor-nacha-ach-maker) • [Gusto, Rippling & Deel Payroll ACH](https://apify.com/finops_studio/nacha-ach-file-generator/tasks/gusto-rippling-deel-csv-to-us-payroll-nacha-ach) • [PNC PINACLE, US Bank & Truist ACH](https://apify.com/finops_studio/nacha-ach-file-generator/tasks/pnc-us-bank-truist-commercial-nacha-ach-generator) • [SVB & First Citizens Commercial ACH](https://apify.com/finops_studio/nacha-ach-file-generator/tasks/svb-first-citizens-corporate-nacha-ach-file-maker) • [US E-Commerce WEB Debit ACH](https://apify.com/finops_studio/nacha-ach-file-generator/tasks/us-ecommerce-web-ach-customer-payment-batch) • [Property & HOA Rent Collection ACH](https://apify.com/finops_studio/nacha-ach-file-generator/tasks/property-management-hoa-rent-collection-nacha-ach)
- **Corporate BAI2 Parser:** [J.P. Morgan & BofA CashPro BAI2 to Excel CSV](https://apify.com/finops_studio/bai2-bank-statement-parser/tasks/jpmorgan-access-bofa-cashpro-bai2-to-excel-csv) • [Wells Fargo CEO & CitiDirect BAI2 to NetSuite](https://apify.com/finops_studio/bai2-bank-statement-parser/tasks/wells-fargo-ceo-citidirect-bai2-to-netsuite-json) • [HSBCnet, SVB & PNC Multi-Currency BAI2](https://apify.com/finops_studio/bai2-bank-statement-parser/tasks/hsbcnet-svb-pnc-multi-currency-bai2-parser) • [BAI2 Record 88 Remittance Stitcher](https://apify.com/finops_studio/bai2-bank-statement-parser/tasks/bai2-record-88-remittance-stitcher-reconciliation) • [U.S. Bank, Truist & Regions BAI2 to CSV](https://apify.com/finops_studio/bai2-bank-statement-parser/tasks/us-bank-truist-regions-bai2-to-excel-csv-parser) • [RBC, TD, BMO & Scotiabank BAI2 Parser](https://apify.com/finops_studio/bai2-bank-statement-parser/tasks/rbc-td-bmo-scotiabank-corporate-bai2-parser) • [BAI2 to QuickBooks & Xero CSV](https://apify.com/finops_studio/bai2-bank-statement-parser/tasks/bai2-bank-statement-to-quickbooks-xero-csv) • [BAI2 to SAP, Oracle & Dynamics JSON](https://apify.com/finops_studio/bai2-bank-statement-parser/tasks/bai2-to-sap-oracle-dynamics-erp-reconciliation-json) • [BAI2 ZBA Sweep (275/575) Reconciler](https://apify.com/finops_studio/bai2-bank-statement-parser/tasks/bai2-zba-sweep-concentration-275-575-reconciler) • [BAI2 Lockbox/ACH/Wire (115/165/195) Parser](https://apify.com/finops_studio/bai2-bank-statement-parser/tasks/bai2-lockbox-ach-wire-115-165-195-remittance-parser)
- **German DATEV EXTF v700:** [Stripe Payouts to DATEV SKR04](https://apify.com/finops_studio/datev-buchungsstapel-generator/tasks/stripe-payouts-to-datev-extf-skr04-buchungsstapel) • [Shopify & WooCommerce to DATEV SKR03](https://apify.com/finops_studio/datev-buchungsstapel-generator/tasks/shopify-woocommerce-orders-to-datev-skr03-csv) • [Amazon & PayPal to DATEV Steuerberater](https://apify.com/finops_studio/datev-buchungsstapel-generator/tasks/amazon-paypal-settlements-to-datev-steuerberater) • [SaaS B2B Reverse-Charge EU VAT DATEV](https://apify.com/finops_studio/datev-buchungsstapel-generator/tasks/saas-b2b-reverse-charge-eu-vat-datev-extf-csv) • [Lexoffice & sevDesk to DATEV CSV](https://apify.com/finops_studio/datev-buchungsstapel-generator/tasks/lexoffice-sevdesk-to-datev-extf-buchungsstapel-csv) • [eBay DE, Kaufland & OTTO to DATEV](https://apify.com/finops_studio/datev-buchungsstapel-generator/tasks/ebay-kaufland-otto-de-to-datev-skr03-buchungsstapel) • [Mollie, Klarna & Adyen to DATEV](https://apify.com/finops_studio/datev-buchungsstapel-generator/tasks/mollie-klarna-adyen-payouts-to-datev-extf-csv) • [GmbH Monthly Closing DATEV Online](https://apify.com/finops_studio/datev-buchungsstapel-generator/tasks/gmbh-ug-monthly-steuerberater-datev-extf-closing) • [DACH E-Commerce VAT DATEV CSV](https://apify.com/finops_studio/datev-buchungsstapel-generator/tasks/austria-dach-ecommerce-vat-to-datev-extf-csv) • [Chargebee, Paddle & Lemon Squeezy DATEV](https://apify.com/finops_studio/datev-buchungsstapel-generator/tasks/chargebee-paddle-lemonsqueezy-to-datev-skr04-csv)
- **Australian BECS `.ABA`:** [Xero & MYOB to CommBank CommBiz .ABA](https://apify.com/finops_studio/aba-cemtex-file-generator/tasks/xero-myob-csv-to-commbank-commbiz-aba-file) • [AU Payroll Code 53 (NAB / Westpac / ANZ)](https://apify.com/finops_studio/aba-cemtex-file-generator/tasks/australian-payroll-code-53-nab-westpac-anz-aba) • [AU Supplier AP Batch (Code 50)](https://apify.com/finops_studio/aba-cemtex-file-generator/tasks/australian-supplier-ap-batch-becs-cemtex-aba) • [Self-Balancing Contractor .ABA](https://apify.com/finops_studio/aba-cemtex-file-generator/tasks/self-balancing-australian-payroll-contractor-aba) • [Employment Hero & KeyPay to .ABA](https://apify.com/finops_studio/aba-cemtex-file-generator/tasks/employment-hero-keypay-deputy-csv-to-aba-file) • [Macquarie, Bendigo & Suncorp .ABA](https://apify.com/finops_studio/aba-cemtex-file-generator/tasks/macquarie-bendigo-suncorp-australian-aba-maker) • [NetSuite & SAP AU Subsidiary .ABA](https://apify.com/finops_studio/aba-cemtex-file-generator/tasks/netsuite-sap-australian-subsidiary-ap-aba-file) • [AU Contractor & Creditor AP .ABA](https://apify.com/finops_studio/aba-cemtex-file-generator/tasks/australian-contractor-creditor-payment-batch-aba) • [NAB Connect & ANZ Transactive .ABA](https://apify.com/finops_studio/aba-cemtex-file-generator/tasks/nab-connect-anz-transactive-direct-entry-aba) • [Westpac Corporate Online Deskbank .ABA](https://apify.com/finops_studio/aba-cemtex-file-generator/tasks/westpac-corporate-online-deskbank-aba-generator)
- **ISO 20022 `pain.002` Decoder:** [SEPA Rejection Decoder (AC04/AM04/BE04)](https://apify.com/finops_studio/iso20022-pain002-status-parser/tasks/sepa-pain002-bank-rejection-ac04-am04-be04-decoder) • [EBICS & SFTP pain.002 to Slack/Jira CSV](https://apify.com/finops_studio/iso20022-pain002-status-parser/tasks/ebics-sftp-pain002-xml-to-slack-jira-csv-alerts) • [SWIFT & CGI-MP Exception Extractor](https://apify.com/finops_studio/iso20022-pain002-status-parser/tasks/swift-iso20022-payment-status-exception-extractor) • [SEPA Direct Debit MD01/MS02 Decoder](https://apify.com/finops_studio/iso20022-pain002-status-parser/tasks/sepa-direct-debit-md01-ms02-return-xml-decoder) • [Deutsche Bank & Commerzbank EBICS pain.002](https://apify.com/finops_studio/iso20022-pain002-status-parser/tasks/deutsche-bank-commerzbank-ebics-pain002-decoder) • [BNP Paribas, ING & Rabobank pain.002](https://apify.com/finops_studio/iso20022-pain002-status-parser/tasks/bnp-paribas-ing-rabobank-sepa-pain002-xml-parser) • [NetSuite, SAP & Odoo pain.002 Reconciler](https://apify.com/finops_studio/iso20022-pain002-status-parser/tasks/netsuite-sap-odoo-erp-pain002-rejection-webhook) • [AC01/AC04/AM04/RC01 Reason Decoder](https://apify.com/finops_studio/iso20022-pain002-status-parser/tasks/iso20022-ac01-ac04-am04-rc01-payment-failure-parser) • [UBS, PostFinance & ZKB pain.002](https://apify.com/finops_studio/iso20022-pain002-status-parser/tasks/ubs-postfinance-zkb-swiss-pain002-status-decoder) • [Batch Multiple pain.002 XML to CSV](https://apify.com/finops_studio/iso20022-pain002-status-parser/tasks/batch-multiple-pain002-xml-files-to-single-csv)
- **UK BACS Standard 18:** [Sage, Xero & BrightPay to BACS 18](https://apify.com/finops_studio/uk-bacs-standard18-generator/tasks/sage-xero-brightpay-csv-to-uk-bacs-standard-18) • [Barclays, HSBC, Lloyds & NatWest Payroll](https://apify.com/finops_studio/uk-bacs-standard18-generator/tasks/barclays-hsbc-lloyds-natwest-uk-payroll-bacs-file) • [UK Supplier Code 99 + CONTRA](https://apify.com/finops_studio/uk-bacs-standard18-generator/tasks/uk-supplier-direct-credit-code-99-contra-bacs) • [UK BACS Direct Debit (01/17/18)](https://apify.com/finops_studio/uk-bacs-standard18-generator/tasks/uk-bacs-direct-debit-collections-01-17-18-maker) • [NatWest & RBS Bankline BACS 18](https://apify.com/finops_studio/uk-bacs-standard18-generator/tasks/natwest-rbs-bankline-uk-bacs-standard18-generator) • [Lloyds & Santander UK BACS 18](https://apify.com/finops_studio/uk-bacs-standard18-generator/tasks/lloyds-santander-uk-commercial-bacs-file-generator) • [IRIS, Staffology & Moneysoft BACS](https://apify.com/finops_studio/uk-bacs-standard18-generator/tasks/iris-staffology-moneysoft-payroll-to-uk-bacs-18) • [UK Corporate GBP Vendor BACS 18](https://apify.com/finops_studio/uk-bacs-standard18-generator/tasks/uk-corporate-treasury-gbp-ap-batch-bacs-standard18) • [NetSuite & Dynamics 365 UK BACS](https://apify.com/finops_studio/uk-bacs-standard18-generator/tasks/netsuite-dynamics365-uk-ap-to-bacs-standard18) • [UK SaaS & Membership AUDDIS DD](https://apify.com/finops_studio/uk-bacs-standard18-generator/tasks/uk-saas-gym-membership-bacs-direct-debit-auddis)
- **Canadian CPA-005 (1464-Byte):** [QuickBooks & Ceridian to RBC / TD EFT](https://apify.com/finops_studio/canada-cpa005-eft-generator/tasks/quickbooks-ceridian-csv-to-rbc-td-cpa005-eft) • [BMO, Scotiabank & CIBC Payroll EFT](https://apify.com/finops_studio/canada-cpa005-eft-generator/tasks/bmo-scotiabank-cibc-canadian-payroll-eft-1464) • [Canadian Vendor AP (Code 450)](https://apify.com/finops_studio/canada-cpa005-eft-generator/tasks/canadian-vendor-accounts-payable-cpa005-direct-eft) • [Desjardins & Multi-Bank CAD/USD EFT](https://apify.com/finops_studio/canada-cpa005-eft-generator/tasks/desjardins-multi-bank-cad-usd-cpa005-eft-builder) • [RBC Express 1464-Byte EFT](https://apify.com/finops_studio/canada-cpa005-eft-generator/tasks/rbc-express-1464-byte-cpa005-eft-payroll-maker) • [TD Commercial Banking EFT](https://apify.com/finops_studio/canada-cpa005-eft-generator/tasks/td-commercial-banking-cpa005-1464-byte-eft-maker) • [ScotiaConnect, BMO & CIBC Vendor EFT](https://apify.com/finops_studio/canada-cpa005-eft-generator/tasks/scotiaconnect-bmo-cibc-vendor-cpa005-eft-maker) • [National Bank, ATB & Credit Union EFT](https://apify.com/finops_studio/canada-cpa005-eft-generator/tasks/national-bank-atb-credit-union-cpa005-eft-maker) • [Dayforce, Humi & Wagepoint Payroll EFT](https://apify.com/finops_studio/canada-cpa005-eft-generator/tasks/dayforce-humi-wagepoint-canadian-payroll-eft) • [Canadian PAD (Code 460) Debit EFT](https://apify.com/finops_studio/canada-cpa005-eft-generator/tasks/canadian-pre-authorized-debit-pad-cpa005-eft)

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
