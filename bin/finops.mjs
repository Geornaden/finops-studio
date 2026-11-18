#!/usr/bin/env node
/**
 * FinOps Studio Official CLI, Pre-Flight Checksum Doctor & MCP Server (v1.6.0)
 * Zero-dependency CLI, local bank checksum validator, OpenAPI/MCP helper & stdio MCP server.
 */
import fs from 'node:fs';
import readline from 'node:readline';

const VERSION = '1.8.0';
const EDGE_ORIGIN = 'https://finops-rapidapi-edge.ria-rader.workers.dev';

const EDGE_PATH_BY_MCP = {
  generate_sepa_xml: '/v1/sepa/generate',
  generate_eu_einvoice_xml: '/v1/einvoice/generate',
  generate_nacha_ach_file: '/v1/nacha/generate',
  parse_bai2_statement: '/v1/bai2/parse',
  generate_datev_csv: '/v1/datev/generate',
  generate_australian_aba_file: '/v1/aba/generate',
  parse_pain002_status_xml: '/v1/pain002/parse',
  generate_uk_bacs_file: '/v1/bacs/generate',
  generate_canada_cpa005_file: '/v1/cpa005/generate',
  generate_positive_pay_file: '/v1/positive-pay/generate',
  parse_norma43_statement: '/v1/norma43/parse',
  generate_pacs008_wire_xml: '/v1/pacs008/generate'
};

const EDGE_PATH_BY_CLI = {
  sepa: '/v1/sepa/generate',
  einvoice: '/v1/einvoice/generate',
  nacha: '/v1/nacha/generate',
  bai2: '/v1/bai2/parse',
  datev: '/v1/datev/generate',
  aba: '/v1/aba/generate',
  pain002: '/v1/pain002/parse',
  bacs: '/v1/bacs/generate',
  cpa005: '/v1/cpa005/generate',
  'positive-pay': '/v1/positive-pay/generate',
  norma43: '/v1/norma43/parse',
  pacs008: '/v1/pacs008/generate'
};

const TOOLS = [
  ['sepa', 'finops_studio~sepa-xml-generator', 'ISO 20022 SEPA Credit Transfer & Direct Debit XML (pain.001/008)', true],
  ['einvoice', 'finops_studio~eu-einvoice-xml-generator', 'EU EN 16931 E-Invoice XML (Peppol BIS 3.0 / EHF 3.0 / XRechnung / Factur-X)', true],
  ['nacha', 'finops_studio~nacha-ach-file-generator', 'US 94-Char NACHA ACH Payroll & Vendor File Generator', true],
  ['bai2', 'finops_studio~bai2-bank-statement-parser', 'Corporate BAI2 Bank Statement Parser to JSON/CSV', true],
  ['datev', 'finops_studio~datev-buchungsstapel-generator', 'German DATEV EXTF v700 Buchungsstapel CSV Generator', true],
  ['aba', 'finops_studio~aba-cemtex-file-generator', 'Australian 120-Char ABA Direct Entry (.aba) Generator', true],
  ['pain002', 'finops_studio~iso20022-pain002-status-parser', 'ISO 20022 pain.002 Bank Rejection XML Decoder', true],
  ['bacs', 'finops_studio~uk-bacs-standard18-generator', 'UK BACS Standard 18 (100-Char) Direct Credit/Debit Generator', true],
  ['cpa005', 'finops_studio~canada-cpa005-eft-generator', 'Canadian CPA-005 (1464-Byte) EFT Direct Deposit Generator', true],
  ['positive-pay', 'finops_studio~us-positive-pay-check-generator', 'US Bank Payee Positive Pay Check Fraud File Generator', false],
  ['norma43', 'finops_studio~spanish-aeb-norma43-parser', 'Spanish AEB Norma 43 (Cuaderno 43) 80-Char Bank Statement Parser', false],
  ['pacs008', 'finops_studio~iso20022-pacs008-fedwire-generator', 'ISO 20022 pacs.008.001.08 Fedwire Funds & SWIFT CBPR+ Wire XML Generator', false]
];

function validIban(iban) {
  const clean = String(iban || '').replace(/\s+/g, '').toUpperCase();
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/.test(clean)) return false;
  const rearr = clean.slice(4) + clean.slice(0, 4);
  const exp = rearr.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let rem = 0n;
  for (const ch of exp) rem = (rem * 10n + BigInt(ch)) % 97n;
  return rem === 1n;
}

function validAba(aba) {
  const clean = String(aba || '').replace(/\s+/g, '');
  if (!/^[0-9]{9}$/.test(clean)) return false;
  const w = [3, 7, 1, 3, 7, 1, 3, 7, 1];
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(clean[i]) * w[i];
  return sum > 0 && sum % 10 === 0;
}

function validUkSortCode(code) {
  const digits = String(code || '').replace(/[\s-]+/g, '');
  if (!/^[0-9]{6}$/.test(digits)) return { valid: false, normalized: null };
  return { valid: true, normalized: `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 6)}`, compact: digits };
}

function validAuBsb(bsb) {
  const digits = String(bsb || '').replace(/[\s-]+/g, '');
  if (!/^[0-9]{6}$/.test(digits)) return { valid: false, normalized: null };
  return { valid: true, normalized: `${digits.slice(0, 3)}-${digits.slice(3, 6)}`, compact: digits };
}

function auditBankText(raw, sourceLabel = '<inline>') {
  const text = String(raw || '');
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  const widths = [...new Set(lines.map((l) => l.length))];
  const ibans = [...new Set(text.match(/\b[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}\b/g) || [])];
  const badIbans = ibans.filter((i) => !validIban(i));
  const abas = [...new Set(text.match(/\b[0-9]{9}\b/g) || [])].filter(validAba);

  let detectedFormat = 'Generic CSV / JSON Batch';
  if (widths.length === 1 && widths[0] === 94) detectedFormat = 'US NACHA ACH (94-char fixed-width)';
  else if (widths.length === 1 && widths[0] === 120) detectedFormat = 'Australian BECS ABA (120-char fixed-width)';
  else if (widths.length === 1 && widths[0] === 100) detectedFormat = 'UK BACS Standard 18 (100-char fixed-width)';
  else if (widths.length === 1 && widths[0] === 1464) detectedFormat = 'Canadian CPA-005 EFT (1,464-byte fixed-width)';
  else if (widths.length === 1 && widths[0] === 80 && lines[0]?.startsWith('11')) detectedFormat = 'Spanish AEB Norma 43 (80-char)';
  else if (text.startsWith('01,')) detectedFormat = 'Corporate BAI2 Bank Statement';
  else if (text.includes('pain.001')) detectedFormat = 'ISO 20022 SEPA Credit Transfer XML';
  else if (text.includes('pain.008')) detectedFormat = 'ISO 20022 SEPA Direct Debit XML';
  else if (text.includes('pain.002')) detectedFormat = 'ISO 20022 pain.002 Payment Status XML';
  else if (text.includes('pacs.008')) detectedFormat = 'ISO 20022 pacs.008 Fedwire / SWIFT Wire XML';

  return {
    ok: badIbans.length === 0,
    source: sourceLabel,
    detectedFormat,
    nonEmptyLines: lines.length,
    distinctLineLengths: widths.slice(0, 8),
    ibansChecked: ibans.length,
    invalidIbans: badIbans,
    validUsAbaRoutingNumbersFound: abas.length
  };
}

function snakeToCamelKey(key) {
  return String(key).replace(/_([a-z0-9])/g, (_, ch) => ch.toUpperCase());
}

function snakeToCamelObject(value) {
  if (Array.isArray(value)) return value.map(snakeToCamelObject);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[snakeToCamelKey(k)] = snakeToCamelObject(v);
    }
    return out;
  }
  return value;
}

const OFFLINE_ANNOTATIONS = (title) => ({
  title,
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false
});

const CLOUD_ANNOTATIONS = (title) => ({
  title,
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true
});

const CLOUD_MCP_TOOLS = [
  {
    name: 'generate_sepa_xml',
    title: 'Generate SEPA XML',
    slug: 'finops_studio~sepa-xml-generator',
    description: 'Generate 2026 EPC-compliant ISO 20022 SEPA Credit Transfer (pain.001.001.09) or Direct Debit (pain.008.001.08) XML files via Apify Cloud.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['initiating_party_name', 'initiating_party_iban', 'transactions'],
      properties: {
        schema: {
          type: 'string',
          enum: ['pain.001.001.09', 'pain.008.001.08'],
          default: 'pain.001.001.09',
          description: 'ISO 20022 SEPA XML schema version.'
        },
        initiating_party_name: { type: 'string', description: 'Legal name of the initiating debtor or creditor organization.' },
        initiating_party_iban: { type: 'string', description: 'Originating SEPA bank account IBAN.' },
        initiating_party_bic: { type: 'string', description: 'Optional 8- or 11-character SWIFT/BIC code of the originating bank.' },
        execution_date: { type: 'string', description: 'Requested execution date in YYYY-MM-DD format.' },
        transactions: {
          type: 'array',
          minItems: 1,
          description: 'Payment transactions to include in the SEPA batch.',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['amount', 'counterparty_name', 'counterparty_iban'],
            properties: {
              end_to_end_id: { type: 'string', description: 'Unique end-to-end transaction identifier.' },
              amount: { type: 'number', description: 'Payment amount in major currency units (e.g., 1250.50).' },
              currency: { type: 'string', default: 'EUR', description: 'ISO 4217 currency code (e.g., EUR).' },
              counterparty_name: { type: 'string', description: 'Recipient or debtor name.' },
              counterparty_iban: { type: 'string', description: 'Recipient or debtor IBAN.' },
              counterparty_bic: { type: 'string', description: 'Optional recipient or debtor BIC.' },
              remittance_info: { type: 'string', description: 'Unstructured invoice reference or payment note.' },
              country: { type: 'string', description: 'Two-letter ISO 3166-1 alpha-2 country code (e.g., DE).' },
              town_name: { type: 'string', description: 'Structured town or city name.' },
              post_code: { type: 'string', description: 'Structured postal code.' },
              street_name: { type: 'string', description: 'Structured street address.' }
            }
          }
        }
      }
    }
  },
  {
    name: 'generate_eu_einvoice_xml',
    title: 'Generate EU E-Invoice XML',
    slug: 'finops_studio~eu-einvoice-xml-generator',
    description: 'Generate EN 16931 EU E-Invoice XML (Peppol BIS 3.0 UBL, German XRechnung 3.0 UBL, or Factur-X/ZUGFeRD 2.3 CII) via Apify Cloud.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['invoice_number', 'seller', 'buyer', 'lines'],
      properties: {
        format: {
          type: 'string',
          enum: ['peppol-ubl-3.0', 'xrechnung-3.0-ubl', 'facturx-cii-en16931'],
          default: 'peppol-ubl-3.0',
          description: 'Target European e-invoice XML standard.'
        },
        invoice_number: { type: 'string', description: 'Unique supplier invoice number (BT-1).' },
        issue_date: { type: 'string', description: 'Invoice issue date in YYYY-MM-DD format (BT-2).' },
        due_date: { type: 'string', description: 'Payment due date in YYYY-MM-DD format (BT-9).' },
        currency: { type: 'string', default: 'EUR', description: 'ISO 4217 document currency code (e.g., EUR).' },
        buyer_reference: { type: 'string', description: 'Purchase order reference or German XRechnung Leitweg-ID (BT-10).' },
        seller: {
          type: 'object',
          additionalProperties: false,
          required: ['name', 'vat_id', 'country'],
          description: 'Seller legal entity details.',
          properties: {
            name: { type: 'string', description: 'Seller legal entity name.' },
            vat_id: { type: 'string', description: 'Seller EU VAT registration ID (e.g., DE129273398).' },
            country: { type: 'string', description: 'ISO 3166-1 alpha-2 country code.' },
            city: { type: 'string', description: 'Seller city.' },
            postal_code: { type: 'string', description: 'Seller postal code.' },
            street: { type: 'string', description: 'Seller street address.' },
            iban: { type: 'string', description: 'Seller payment IBAN.' }
          }
        },
        buyer: {
          type: 'object',
          additionalProperties: false,
          required: ['name', 'country'],
          description: 'Buyer legal entity details.',
          properties: {
            name: { type: 'string', description: 'Buyer legal entity name.' },
            vat_id: { type: 'string', description: 'Buyer EU VAT registration ID.' },
            country: { type: 'string', description: 'ISO 3166-1 alpha-2 country code.' },
            city: { type: 'string', description: 'Buyer city.' },
            postal_code: { type: 'string', description: 'Buyer postal code.' },
            street: { type: 'string', description: 'Buyer street address.' }
          }
        },
        lines: {
          type: 'array',
          minItems: 1,
          description: 'Invoice line items with quantities, unit prices, and VAT rates.',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['description', 'quantity', 'unit_price', 'vat_rate'],
            properties: {
              description: { type: 'string', description: 'Line item description.' },
              quantity: { type: 'number', description: 'Billed quantity.' },
              unit_price: { type: 'number', description: 'Net unit price before VAT.' },
              vat_rate: { type: 'number', description: 'VAT percentage rate (e.g., 19 or 21).' }
            }
          }
        }
      }
    }
  },
  {
    name: 'generate_nacha_ach_file',
    title: 'Generate US NACHA ACH File',
    slug: 'finops_studio~nacha-ach-file-generator',
    description: 'Generate 94-character Block-10 padded US NACHA ACH (.ach) vendor payment and payroll direct deposit files (CCD, PPD, WEB) via Apify Cloud.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['immediate_destination', 'company_name', 'company_id', 'entries'],
      properties: {
        sec_code: {
          type: 'string',
          enum: ['CCD', 'PPD', 'WEB'],
          default: 'CCD',
          description: 'Standard Entry Class code (CCD business, PPD payroll/consumer, WEB internet).'
        },
        immediate_destination: { type: 'string', description: '9-digit US ABA routing number of the originating or destination bank.' },
        company_name: { type: 'string', description: 'Originating company name (up to 16 characters).' },
        company_id: { type: 'string', description: '10-character NACHA Company ID (typically 1 plus 9-digit EIN).' },
        effective_entry_date: { type: 'string', description: 'Settlement date in YYMMDD or YYYY-MM-DD format.' },
        entries: {
          type: 'array',
          minItems: 1,
          description: 'ACH debit or credit entry detail records.',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['receiving_dfi_routing', 'dfi_account_number', 'amount', 'individual_name'],
            properties: {
              trace_id: { type: 'string', description: 'Optional trace or invoice ID (up to 15 chars).' },
              receiving_dfi_routing: { type: 'string', description: 'Receiver 9-digit US ABA routing number.' },
              dfi_account_number: { type: 'string', description: 'Receiver bank account number.' },
              amount: { type: 'number', description: 'Payment amount in USD (e.g., 450.25).' },
              individual_name: { type: 'string', description: 'Receiver name (up to 22 chars).' },
              transaction_code: { type: 'string', description: 'NACHA transaction code (22 checking credit, 27 checking debit).' }
            }
          }
        }
      }
    }
  },
  {
    name: 'parse_bai2_statement',
    title: 'Parse BAI2 Bank Statement',
    slug: 'finops_studio~bai2-bank-statement-parser',
    description: 'Parse corporate BAI2 (.bai / .bai2) cash-management bank statements (records 01, 02, 03, 16, 88, 49, 98, 99) into structured JSON and CSV via Apify Cloud.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['bai2_content'],
      properties: {
        bai2_content: { type: 'string', description: 'Raw multi-line corporate BAI2 bank statement text (records 01 through 99).' },
        include_inline_csv: { type: 'boolean', default: false, description: 'When true, include a flattened UTF-8 CSV ledger export in the output.' }
      }
    }
  },
  {
    name: 'generate_datev_csv',
    title: 'Generate DATEV EXTF CSV',
    slug: 'finops_studio~datev-buchungsstapel-generator',
    description: 'Generate German DATEV EXTF v700 Buchungsstapel CSV (SKR03 / SKR04) accounting import batches via Apify Cloud.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['entries'],
      properties: {
        chart_of_accounts: {
          type: 'string',
          enum: ['SKR03', 'SKR04'],
          default: 'SKR03',
          description: 'German DATEV standard chart of accounts.'
        },
        consultant_number: { type: 'integer', default: 12998, description: 'DATEV Beraternummer (4 to 7 digits).' },
        client_number: { type: 'integer', default: 55001, description: 'DATEV Mandantennummer (1 to 5 digits).' },
        fiscal_year_start: { type: 'string', default: '20260101', description: 'Fiscal year start date in YYYYMMDD format.' },
        entries: {
          type: 'array',
          minItems: 1,
          description: 'Accounting bookings to serialize into DATEV EXTF CSV rows.',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['booking_date', 'gross_amount', 'contra_account'],
            properties: {
              booking_date: { type: 'string', description: 'Document date in YYYY-MM-DD format.' },
              gross_amount: { type: 'number', description: 'Gross booking amount in EUR.' },
              vat_rate: { type: 'number', description: 'VAT percentage rate (e.g., 19, 7, or 0).' },
              contra_account: { type: 'integer', description: 'DATEV contra account number (Gegenkonto).' },
              booking_text: { type: 'string', description: 'Booking description text (Buchungstext, max 60 chars).' },
              document_ref: { type: 'string', description: 'Document reference / Belegfeld 1.' }
            }
          }
        }
      }
    }
  },
  {
    name: 'generate_australian_aba_file',
    title: 'Generate Australian ABA File',
    slug: 'finops_studio~aba-cemtex-file-generator',
    description: 'Generate 120-character Australian AusPayNet BECS Direct Entry (.aba / Cemtex) files with Record 7 hash/net balancing via Apify Cloud.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['bsb', 'account_number', 'user_name', 'apca_user_id', 'transactions'],
      properties: {
        bsb: { type: 'string', description: 'Originating or trace Australian 6-digit BSB (XXX-XXX).' },
        account_number: { type: 'string', description: 'Originating or trace bank account number.' },
        user_name: { type: 'string', description: 'Originating user preferred name (max 26 chars).' },
        apca_user_id: { type: 'string', description: '6-digit AusPayNet / APCA User Identification Number.' },
        description: { type: 'string', description: 'Batch entry description (max 12 chars, e.g., PAYROLL).' },
        transactions: {
          type: 'array',
          minItems: 1,
          description: 'Australian Direct Entry detail lines (Type 1 records).',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['bsb', 'account_number', 'amount', 'account_title'],
            properties: {
              bsb: { type: 'string', description: 'Recipient 6-digit BSB (XXX-XXX).' },
              account_number: { type: 'string', description: 'Recipient bank account number (max 9 digits).' },
              indicator: { type: 'string', description: 'Single-character indicator (blank, N, W, X, or Y).' },
              transaction_code: { type: 'string', default: '50', description: '2-digit BECS transaction code (50 general credit, 53 payroll, 13 debit).' },
              amount: { type: 'number', description: 'Payment amount in AUD.' },
              account_title: { type: 'string', description: 'Recipient account title (max 32 chars).' },
              lodgement_reference: { type: 'string', description: 'Reference shown on recipient statement (max 18 chars).' }
            }
          }
        }
      }
    }
  },
  {
    name: 'parse_pain002_status_xml',
    title: 'Parse ISO 20022 pain.002 XML',
    slug: 'finops_studio~iso20022-pain002-status-parser',
    description: 'Parse ISO 20022 pain.002 XML bank payment rejection reports (AC04, AM04, BE04, MD01) into plain-English remediation steps via Apify Cloud.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['xml_content'],
      properties: {
        xml_content: { type: 'string', description: 'Raw ISO 20022 pain.002.001.03 or pain.002.001.10 bank status report XML.' },
        only_rejected_or_exceptions: { type: 'boolean', default: false, description: 'When true, return only RJCT/PDNG transactions and omit ACCP items.' },
        include_inline_csv: { type: 'boolean', default: false, description: 'When true, include a UTF-8 CSV summary of status records.' }
      }
    }
  },
  {
    name: 'generate_uk_bacs_file',
    title: 'Generate UK BACS Standard 18 File',
    slug: 'finops_studio~uk-bacs-standard18-generator',
    description: 'Generate 100-character UK Pay.UK BACS Standard 18 (VOL1/HDR1/UHL1 + Contra + UTL1) direct credit or debit files via Apify Cloud.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['service_user_number', 'originating_company_name', 'originating_sort_code', 'originating_account_number', 'payments'],
      properties: {
        service_user_number: { type: 'string', description: '6-digit BACS Service User Number (SUN).' },
        originating_company_name: { type: 'string', description: 'Originating account or company name (max 18 chars).' },
        originating_sort_code: { type: 'string', description: '6-digit UK originating Sort Code.' },
        originating_account_number: { type: 'string', description: '8-digit UK originating bank account number.' },
        processing_date: { type: 'string', description: 'Processing date in YYYY-MM-DD format.' },
        payments: {
          type: 'array',
          minItems: 1,
          description: 'BACS payment lines.',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['destination_sort_code', 'destination_account_number', 'account_name', 'amount_pence'],
            properties: {
              destination_sort_code: { type: 'string', description: 'Recipient 6-digit UK Sort Code.' },
              destination_account_number: { type: 'string', description: 'Recipient 8-digit UK bank account number.' },
              account_name: { type: 'string', description: 'Recipient name (max 18 chars).' },
              amount_pence: { type: 'integer', description: 'Payment amount in GBP integer pence (e.g., 12500 = 125.00 GBP).' },
              reference: { type: 'string', description: 'Payment reference (max 18 chars).' },
              transaction_code: { type: 'string', default: '99', description: 'BACS transaction code (99 credit, 01/17/18/19 Direct Debit).' }
            }
          }
        }
      }
    }
  },
  {
    name: 'generate_canada_cpa005_file',
    title: 'Generate Canada CPA-005 EFT File',
    slug: 'finops_studio~canada-cpa005-eft-generator',
    description: 'Generate 1,464-byte Payments Canada Standard 005 (CPA-005) EFT direct deposit and supplier files via Apify Cloud.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['originator_id', 'originator_short_name', 'transactions'],
      properties: {
        originator_id: { type: 'string', description: '10-character Payments Canada Originator ID.' },
        originator_short_name: { type: 'string', description: 'Originator short name (max 15 chars).' },
        originator_long_name: { type: 'string', description: 'Originator full name (max 30 chars).' },
        destination_data_centre: { type: 'string', description: '5-digit destination bank data centre code.' },
        transactions: {
          type: 'array',
          minItems: 1,
          description: 'Canadian EFT direct deposit or supplier payment items.',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['institution_number', 'transit_number', 'account_number', 'amount', 'payee_name'],
            properties: {
              transaction_type: { type: 'string', default: '450', description: '3-digit CPA payment type code (200 payroll, 450 AP credit).' },
              amount: { type: 'number', description: 'Amount in CAD dollars (e.g., 1200.00).' },
              institution_number: { type: 'string', description: '3-digit Canadian bank institution number.' },
              transit_number: { type: 'string', description: '5-digit Canadian bank branch transit number.' },
              account_number: { type: 'string', description: 'Recipient bank account number (up to 12 chars).' },
              payee_name: { type: 'string', description: 'Payee full name (up to 30 chars).' },
              cross_reference: { type: 'string', description: 'Cross-reference ID (up to 19 chars).' }
            }
          }
        }
      }
    }
  },
  {
    name: 'generate_positive_pay_file',
    title: 'Generate US Bank Positive Pay File',
    slug: 'finops_studio~us-positive-pay-check-generator',
    edgeOnly: true,
    description: 'Generate US Payee Positive Pay check fraud-prevention files for J.P. Morgan Chase, Bank of America CashPro, Wells Fargo CEO, CitiDirect, and PNC via FinOps Direct Cloud Edge.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['account_number', 'checks'],
      properties: {
        bank_profile: { type: 'string', default: 'CHASE_JPM_CSV', description: 'Bank format profile (CHASE_JPM_CSV, BOFA_CASHPRO_FIXED, WELLS_FARGO_80, CITI_CSV, PNC_FIXED).' },
        account_number: { type: 'string', description: 'Corporate checking account number.' },
        company_name: { type: 'string', description: 'Company name.' },
        checks: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['check_number', 'issue_date', 'amount', 'payee_name'],
            properties: {
              check_number: { type: 'string', description: 'Check serial number.' },
              issue_date: { type: 'string', description: 'Issue date YYYY-MM-DD.' },
              amount: { type: 'number', description: 'Check amount in USD.' },
              payee_name: { type: 'string', description: 'Payee name.' },
              status: { type: 'string', default: 'ISSUE', description: 'ISSUE or VOID.' }
            }
          }
        }
      }
    }
  },
  {
    name: 'parse_norma43_statement',
    title: 'Parse Spanish AEB Norma 43 Bank Statement',
    slug: 'finops_studio~spanish-aeb-norma43-parser',
    edgeOnly: true,
    description: 'Parse Spanish AEB Norma 43 (Cuaderno 43) 80-char bank statements from CaixaBank, BBVA, Santander, and Sabadell into reconciled JSON/CSV with calculated ES IBANs.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['norma43_content'],
      properties: {
        norma43_content: { type: 'string', description: 'Raw 80-character Spanish Norma 43 / Cuaderno 43 statement text.' }
      }
    }
  },
  {
    name: 'generate_pacs008_wire_xml',
    title: 'Generate ISO 20022 pacs.008 Fedwire & SWIFT XML',
    slug: 'finops_studio~iso20022-pacs008-fedwire-generator',
    edgeOnly: true,
    description: 'Generate ISO 20022 pacs.008.001.08 high-value wire XML for US Fedwire Funds Service and SWIFT CBPR+ with UETR UUIDv4 and ABA/BIC validation.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['wires'],
      properties: {
        network_profile: { type: 'string', default: 'FEDWIRE_USABA', description: 'FEDWIRE_USABA or SWIFT_CBPR_PLUS.' },
        settlement_date: { type: 'string', description: 'Settlement date YYYY-MM-DD.' },
        wires: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            additionalProperties: true
          }
        }
      }
    }
  }
];

function getMcpToolDefinitions() {
  return [
    {
      name: 'validate_bank_routing',
      description: 'Offline deterministic validator for standalone bank routing identifiers: ISO 13616 IBAN (MOD-97), US 9-digit ABA routing number (MOD-10), UK 6-digit BACS Sort Code, and Australian 6-digit BSB. Use for standalone bank identifiers; to inspect a full multi-line payment or statement file, use audit_bank_file_format.',
      annotations: OFFLINE_ANNOTATIONS('Validate Bank Routing Identifiers'),
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          iban: { type: 'string', description: 'International Bank Account Number to verify via ISO 13616 MOD-97 (e.g., DE89370400440532013000).' },
          aba_routing_number: { type: 'string', description: 'US 9-digit ABA Fedwire/ACH routing number to verify via MOD-10 checksum (e.g., 021000021).' },
          uk_sort_code: { type: 'string', description: 'UK 6-digit BACS Sort Code to validate and normalize (e.g., 40-05-15).' },
          au_bsb: { type: 'string', description: 'Australian 6-digit BECS BSB number to validate and normalize (e.g., 062-000).' }
        }
      }
    },
    {
      name: 'audit_bank_file_format',
      description: 'Offline pre-flight inspector for multi-line bank, payroll, or statement files: detects format (NACHA 94-char, AU ABA 120-char, UK BACS 100-char, CA CPA-005 1464-byte, Norma 43 80-char, BAI2, SEPA/ISO 20022 XML) and validates every embedded IBAN and ABA checksum. Use for full files; to check a single standalone identifier, use validate_bank_routing.',
      annotations: OFFLINE_ANNOTATIONS('Audit Bank File Format & Checksums'),
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        required: ['file_content'],
        properties: {
          file_content: { type: 'string', description: 'Raw text content of the bank payment file, CSV batch, BAI2 statement, or ISO 20022 XML snippet to audit.' }
        }
      }
    },
    ...CLOUD_MCP_TOOLS.map((t) => ({
      name: t.name,
      description: t.description,
      annotations: CLOUD_ANNOTATIONS(t.title),
      inputSchema: t.inputSchema
    }))
  ];
}

function sendJsonRpc(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n');
}

function normalizeCloudPayload(name, args) {
  const source = args.payload && typeof args.payload === 'object' ? args.payload : args;
  const payload = snakeToCamelObject(source);
  if (name === 'parse_bai2_statement' && payload.bai2Content && !payload.bai2Text) {
    payload.bai2Text = payload.bai2Content;
  }
  if (name === 'generate_datev_csv') {
    if (payload.chartOfAccounts && !payload.skr) payload.skr = payload.chartOfAccounts;
    if (Array.isArray(payload.entries)) {
      payload.entries = payload.entries.map((e) => ({
        ...e,
        date: e.date || e.bookingDate
      }));
    }
  }
  if (name === 'generate_australian_aba_file') {
    if (payload.bsb && !payload.traceBsb) payload.traceBsb = payload.bsb;
    if (payload.accountNumber && !payload.traceAccount) payload.traceAccount = payload.accountNumber;
  }
  return payload;
}

async function handleMcpCallTool(name, args = {}) {
  if (name === 'validate_bank_routing') {
    const abaInput = args.aba_routing_number || args.aba;
    const ukInput = args.uk_sort_code || args.ukSortCode;
    const auInput = args.au_bsb || args.auBsb;
    const checks = {};
    if (args.iban) checks.iban = { input: args.iban, valid: validIban(args.iban), normalized: String(args.iban).replace(/\s+/g, '').toUpperCase() };
    if (abaInput) checks.usAbaRouting = { input: abaInput, valid: validAba(abaInput), normalized: String(abaInput).replace(/\s+/g, '') };
    if (ukInput) checks.ukSortCode = validUkSortCode(ukInput);
    if (auInput) checks.auBsb = validAuBsb(auInput);
    if (Object.keys(checks).length === 0) {
      return {
        isError: true,
        content: [{ type: 'text', text: 'Provide at least one parameter: iban, aba_routing_number, uk_sort_code, or au_bsb.' }]
      };
    }
    return { content: [{ type: 'text', text: JSON.stringify({ ok: true, checks }, null, 2) }] };
  }

  if (name === 'audit_bank_file_format') {
    const fileText = args.file_content || args.content;
    if (!fileText || typeof fileText !== 'string') {
      return { isError: true, content: [{ type: 'text', text: 'Missing required string parameter: file_content' }] };
    }
    const audit = auditBankText(fileText, 'mcp-inline');
    return { content: [{ type: 'text', text: JSON.stringify(audit, null, 2) }] };
  }

  const cloudTool = CLOUD_MCP_TOOLS.find((t) => t.name === name);
  if (!cloudTool) {
    return { isError: true, content: [{ type: 'text', text: `Unknown tool: ${name}` }] };
  }

  const passKey = (process.env.FINOPS_PASS_KEY || '').trim();
  const token = (process.env.APIFY_TOKEN || '').trim();
  if (!passKey && !token) {
    return {
      isError: false,
      content: [
        {
          type: 'text',
          text:
            `Cloud API key not configured (set FINOPS_PASS_KEY or APIFY_TOKEN).\n\n` +
            `To run ${cloudTool.name} in production:\n` +
            `1. Instant No-Signup Pass ($9 24h Unlimited / $29 30d Pro via PayPal or Card): https://geornaden.github.io/finops-studio/free-csv-to-sepa-nacha-bacs-aba-cpa005-json-mapper.html — set FINOPS_PASS_KEY=fop_... in your MCP env.\n` +
            `2. Apify Cloud ($5/month free starter credits): https://apify.com/${cloudTool.slug.replace('~', '/')} — set APIFY_TOKEN in your MCP env.\n` +
            `3. Hosted Remote MCP Subscriptions: https://mcprush.com/geornaden-2/finops-studio-banking-payroll-e-invoicing-mcp`
        }
      ]
    };
  }

  const payload = normalizeCloudPayload(name, args);
  if (passKey.startsWith('fop_') && EDGE_PATH_BY_MCP[name]) {
    const res = await fetch(`${EDGE_ORIGIN}${EDGE_PATH_BY_MCP[name]}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-FinOps-Pass': passKey },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    if (!res.ok) {
      return { isError: true, content: [{ type: 'text', text: `FinOps Edge HTTP ${res.status}: ${text}` }] };
    }
    return { content: [{ type: 'text', text }] };
  }

  if (cloudTool.edgeOnly) {
    return {
      isError: false,
      content: [
        {
          type: 'text',
          text: `${cloudTool.name} runs exclusively on FinOps Direct Cloud Edge. Get an instant $9 (24h Unlimited) or $29 (30-Day Pro) Pass Key (fop_...) at https://geornaden.github.io/finops-studio/free-csv-to-sepa-nacha-bacs-aba-cpa005-json-mapper.html and set FINOPS_PASS_KEY=fop_... in your MCP environment.`
        }
      ]
    };
  }

  const url = `https://api.apify.com/v2/acts/${cloudTool.slug}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  if (!res.ok) {
    return { isError: true, content: [{ type: 'text', text: `Cloud API HTTP ${res.status}: ${text}` }] };
  }
  return { content: [{ type: 'text', text }] };
}

function startStdioMcpServer() {
  const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
  rl.on('line', async (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    let req;
    try {
      req = JSON.parse(trimmed);
    } catch {
      sendJsonRpc({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
      return;
    }

    // Notifications (no id) require no response per JSON-RPC 2.0 / MCP spec
    if (req.id === undefined || req.id === null) return;

    const id = req.id;
    const method = req.method;
    try {
      if (method === 'initialize') {
        sendJsonRpc({
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: (req.params && req.params.protocolVersion) || '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'finops-studio', version: VERSION }
          }
        });
      } else if (method === 'ping') {
        sendJsonRpc({ jsonrpc: '2.0', id, result: {} });
      } else if (method === 'tools/list') {
        sendJsonRpc({
          jsonrpc: '2.0',
          id,
          result: { tools: getMcpToolDefinitions() }
        });
      } else if (method === 'resources/list') {
        sendJsonRpc({ jsonrpc: '2.0', id, result: { resources: [] } });
      } else if (method === 'prompts/list') {
        sendJsonRpc({ jsonrpc: '2.0', id, result: { prompts: [] } });
      } else if (method === 'tools/call') {
        const params = req.params || {};
        const result = await handleMcpCallTool(params.name, params.arguments || {});
        sendJsonRpc({ jsonrpc: '2.0', id, result });
      } else {
        sendJsonRpc({
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method not found: ${method}` }
        });
      }
    } catch (err) {
      sendJsonRpc({
        jsonrpc: '2.0',
        id,
        error: { code: -32603, message: err?.message || 'Internal error' }
      });
    }
  });
}

const cmd = process.argv[2] || 'list';

if (cmd === 'mcp' || cmd === '--mcp') {
  startStdioMcpServer();
} else if (cmd === 'mcp-config') {
  const includeAll = process.argv.includes('--all');
  const selected = includeAll ? TOOLS : TOOLS.filter((t) => t[3]);
  console.log(
    JSON.stringify(
      {
        mcpServers: {
          'finops-studio-stdio': {
            command: 'npx',
            args: ['-y', 'github:Geornaden/finops-studio', 'mcp'],
            env: {
              APIFY_TOKEN: process.env.APIFY_TOKEN || 'YOUR_OPTIONAL_APIFY_TOKEN'
            }
          },
          'finops-studio-remote': {
            url: 'https://mcp.apify.com/?actors=' + selected.map((t) => t[1].replace('~', '/')).join(','),
            headers: {
              Authorization: 'Bearer ' + (process.env.APIFY_TOKEN || 'YOUR_APIFY_API_TOKEN')
            }
          }
        }
      },
      null,
      2
    )
  );
} else if (cmd === 'openapi') {
  console.log(
    JSON.stringify(
      {
        openapiSpec: 'https://geornaden.github.io/finops-studio/openapi.json',
        edgeOpenapiSpec: 'https://geornaden.github.io/finops-studio/openapi-edge.json',
        postmanCollection: 'https://geornaden.github.io/finops-studio/workflows/finops-studio-postman-collection.json',
        mcpRegistrySuite: 'io.github.Geornaden/finops-studio'
      },
      null,
      2
    )
  );
} else if (cmd === 'doctor') {
  const targetPath = process.argv[3];
  if (!targetPath || !fs.existsSync(targetPath)) {
    console.error('Usage: npx github:Geornaden/finops-studio doctor <batch-or-bank-file>');
    process.exit(1);
  }
  const raw = fs.readFileSync(targetPath, 'utf8');
  const result = auditBankText(raw, targetPath);
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(2);
} else if (cmd === 'run') {
  const toolKey = process.argv[3];
  const payloadPath = process.argv[4];
  const outIdx = process.argv.indexOf('--out');
  const outPath = outIdx !== -1 ? process.argv[outIdx + 1] : null;
  const passKey = (process.env.FINOPS_PASS_KEY || '').trim();
  const token = (process.env.APIFY_TOKEN || '').trim();
  const entry = TOOLS.find((t) => t[0] === toolKey);
  if (!entry || !payloadPath) {
    console.error('Usage: FINOPS_PASS_KEY=fop_... npx finops-studio run <tool> <payload.json> [--out ./output.xml]');
    console.error('Tools: ' + TOOLS.map((t) => t[0]).join(', '));
    process.exit(1);
  }
  if (!passKey && !token) {
    console.error('Error: Set FINOPS_PASS_KEY ($9/$29 Instant Pass at https://geornaden.github.io/finops-studio/) or APIFY_TOKEN ($5/mo free credits at https://apify.com/finops_studio).');
    process.exit(1);
  }
  const body = fs.readFileSync(payloadPath, 'utf8');
  JSON.parse(body);
  const useDirectPass = passKey.startsWith('fop_');
  if (!useDirectPass && !entry[3]) {
    console.error(`Error: ${toolKey} runs on FinOps Direct Cloud Edge. Set FINOPS_PASS_KEY=fop_... ($9/$29 Pass at https://geornaden.github.io/finops-studio/).`);
    process.exit(1);
  }
  const url = useDirectPass
    ? `${EDGE_ORIGIN}${EDGE_PATH_BY_CLI[toolKey]}`
    : `https://api.apify.com/v2/acts/${entry[1]}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: useDirectPass
      ? { 'Content-Type': 'application/json', 'X-FinOps-Pass': passKey }
      : { 'Content-Type': 'application/json' },
    body
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`Cloud API HTTP ${res.status}: ${text}`);
    process.exit(1);
  }
  if (outPath) {
    const items = JSON.parse(text);
    const first = Array.isArray(items) && items[0] ? items[0] : items;
    const extracted = first.xml || first.xmlText || first.fileText || first.nachaText || first.bacsText || first.abaText || first.eftText || first.csvText || first.csvOutput || first.csvReport || first.xmlContent || first.achContent || first.abaContent || first.bacsContent || first.cpa005Content || first.csvContent || text;
    fs.writeFileSync(outPath, extracted, 'utf8');
    console.log(`Saved verified bank/tax file to ${outPath} (${extracted.length} bytes)`);
  } else {
    console.log(text);
  }
} else {
  console.log(`FinOps Studio v${VERSION} — 12 Deterministic Banking, Treasury & E-Invoicing Cloud APIs & MCP Server`);
  console.log('Instant Direct Pass ($9): https://geornaden.github.io/finops-studio/free-csv-to-sepa-nacha-bacs-aba-cpa005-json-mapper.html');
  console.log('Docs & Pre-Flight Tools : https://geornaden.github.io/finops-studio/');
  console.log('OpenAPI 3.1 Spec        : https://geornaden.github.io/finops-studio/openapi.json');
  console.log('Edge OpenAPI 3.1 Spec   : https://geornaden.github.io/finops-studio/openapi-edge.json');
  console.log('Cloud API Storefront    : https://apify.com/finops_studio\n');
  for (const [key, slug, desc, isApifyPublic] of TOOLS) {
    const link = isApifyPublic
      ? `https://apify.com/${slug.replace('~', '/')}`
      : `${EDGE_ORIGIN}${EDGE_PATH_BY_CLI[key]}`;
    console.log(`  ${key.padEnd(14)} ${link.padEnd(58)} — ${desc}`);
  }
  console.log('\nCommands:');
  console.log('  npx finops-studio mcp                # Start local stdio MCP server');
  console.log('  npx finops-studio list');
  console.log('  npx finops-studio doctor ./batch.csv');
  console.log('  npx finops-studio mcp-config');
  console.log('  npx finops-studio openapi');
  console.log('  FINOPS_PASS_KEY=fop_... npx finops-studio run sepa ./payload.json --out ./sepa.xml');
}
