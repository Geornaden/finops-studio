# FinOps Studio — Banking, Treasury & E-Invoicing File Automation Suite

**Live Interactive Browser Sandbox (Free 3-Row Preview):** [https://geornaden.github.io/finops-studio/](https://geornaden.github.io/finops-studio/)  
**Production Cloud REST APIs & MCP Suite on Apify Store:** [https://apify.com/finops_studio](https://apify.com/finops_studio)  
**AI / LLM Agent Manifest:** [`llms.txt`](https://geornaden.github.io/finops-studio/llms.txt)

---

## Why FinOps Studio?
Large Language Models should **never** guess fixed-width column offsets (94-char US NACHA or 120-char Australian ABA), ISO 13616 MOD-97 IBAN checksums, ABA 10-point routing weights, or EN 16931 VAT bucket rounding. **FinOps Studio** provides deterministic, zero-hallucination financial file engines usable in the browser, via REST API, inside **n8n / Make.com / Zapier**, or directly inside **Claude Desktop, Cursor & Windsurf via MCP**.

## Included Production APIs & Browser Sandboxes

| # | Financial Format | Standards Supported | Cloud API & Store | Browser Demo |
|---|---|---|---|---|
| 1 | **SEPA XML Generator & IBAN Validator** | `pain.001.001.09` (2026 EPC), `pain.001.001.03`, `pain.008.001.08`, `pain.008.001.02` | [Apify Store](https://apify.com/finops_studio/sepa-xml-generator) | [Live Demo](https://geornaden.github.io/finops-studio/sepa-xml-generator.html) |
| 2 | **EU E-Invoice XML Generator** | `Peppol BIS 3.0` (UBL), `XRechnung 3.0`, `Factur-X / ZUGFeRD` (EN 16931 CII) | [Apify Store](https://apify.com/finops_studio/eu-einvoice-xml-generator) | [Live Demo](https://geornaden.github.io/finops-studio/eu-einvoice-xml-generator.html) |
| 3 | **US NACHA ACH Generator & Parser** | 94-Char Fixed-Width `.ach` (`PPD`, `CCD`, `WEB`) + ABA Checksum + Parser | [Apify Store](https://apify.com/finops_studio/nacha-ach-file-generator) | [Live Demo](https://geornaden.github.io/finops-studio/nacha-ach-file-generator.html) |
| 4 | **Corporate `BAI2` Statement Parser** | `01/02/03/16/88/49/98/99` Multi-Currency Treasury Statement to JSON & CSV | [Apify Store](https://apify.com/finops_studio/bai2-bank-statement-parser) | [Live Demo](https://geornaden.github.io/finops-studio/bai2-bank-statement-parser.html) |
| 5 | **German `DATEV Buchungsstapel` CSV** | DATEV EXTF v700 Semicolon CSV (`SKR03` & `SKR04`) for *Steuerberater* | [Apify Store](https://apify.com/finops_studio/datev-buchungsstapel-generator) | [Live Demo](https://geornaden.github.io/finops-studio/datev-buchungsstapel-generator.html) |
| 6 | **Australian `ABA` File Generator** | 120-Char BECS Direct Entry `.aba` (CBA, NAB, Westpac, ANZ) + BSB Check | [Apify Store](https://apify.com/finops_studio/aba-cemtex-file-generator) | [Live Demo](https://geornaden.github.io/finops-studio/aba-cemtex-file-generator.html) |
| 7 | **ISO 20022 `pain.002` Decoder** | `pain.002.001.03` & `pain.002.001.10` Rejection Decoder (`AC04`, `AM04`, `BE04`) | [Apify Store](https://apify.com/finops_studio/iso20022-pain002-status-parser) | [Live Demo](https://geornaden.github.io/finops-studio/iso20022-pain002-decoder.html) |

---

## Connect All 7 Tools to Claude Desktop / Cursor via MCP

```json
{
  "mcpServers": {
    "finops-studio": {
      "url": "https://mcp.apify.com/?actors=finops_studio/sepa-xml-generator,finops_studio/eu-einvoice-xml-generator,finops_studio/nacha-ach-file-generator,finops_studio/bai2-bank-statement-parser,finops_studio/datev-buchungsstapel-generator,finops_studio/aba-cemtex-file-generator,finops_studio/iso20022-pain002-status-parser",
      "headers": {
        "Authorization": "Bearer YOUR_APIFY_API_TOKEN"
      }
    }
  }
}
```

## Ready-to-Import `n8n` Workflows
- [`workflows/n8n-sheets-to-sepa-xml.json`](./workflows/n8n-sheets-to-sepa-xml.json)
- [`workflows/n8n-stripe-to-datev-and-einvoice.json`](./workflows/n8n-stripe-to-datev-and-einvoice.json)
- [`workflows/n8n-bank-sftp-bai2-and-pain002-alerts.json`](./workflows/n8n-bank-sftp-bai2-and-pain002-alerts.json)

> **Disclaimer:** Technical file-formatting, parsing, and checksum validation utilities provided "as-is", not financial, tax, or legal advice.
