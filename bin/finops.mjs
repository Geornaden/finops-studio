#!/usr/bin/env node
/**
 * FinOps Studio Official CLI & MCP Helper
 * Connects developers and AI agents directly to FinOps Studio Cloud APIs on Apify Store.
 */
const TOOLS = [
  ['sepa', 'finops_studio~sepa-xml-generator', 'ISO 20022 SEPA Credit Transfer & Direct Debit XML (pain.001/008)'],
  ['einvoice', 'finops_studio~eu-einvoice-xml-generator', 'EU EN 16931 E-Invoice XML (Peppol BIS 3.0 / XRechnung / Factur-X)'],
  ['nacha', 'finops_studio~nacha-ach-file-generator', 'US 94-Char NACHA ACH Payroll & Vendor File Generator'],
  ['bai2', 'finops_studio~bai2-bank-statement-parser', 'Corporate BAI2 Bank Statement Parser to JSON/CSV'],
  ['datev', 'finops_studio~datev-buchungsstapel-generator', 'German DATEV EXTF v700 Buchungsstapel CSV Generator'],
  ['aba', 'finops_studio~aba-cemtex-file-generator', 'Australian 120-Char ABA Direct Entry (.aba) Generator'],
  ['pain002', 'finops_studio~iso20022-pain002-status-parser', 'ISO 20022 pain.002 Bank Rejection XML Decoder'],
  ['bacs', 'finops_studio~uk-bacs-standard18-generator', 'UK BACS Standard 18 (100-Char) Direct Credit/Debit Generator'],
  ['cpa005', 'finops_studio~canada-cpa005-eft-generator', 'Canadian CPA-005 (1464-Byte) EFT Direct Deposit Generator'],
  ['positive-pay', 'finops_studio~us-positive-pay-check-generator', 'US Bank Payee Positive Pay Check Fraud File Generator']
];

const cmd = process.argv[2] || 'list';

if (cmd === 'mcp-config') {
  console.log(
    JSON.stringify(
      {
        mcpServers: {
          'finops-studio': {
            url:
              'https://mcp.apify.com/?actors=' +
              TOOLS.map((t) => t[1].replace('~', '/')).join(','),
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
} else {
  console.log('FinOps Studio — 10 Deterministic Banking & E-Invoicing Cloud APIs');
  console.log('Docs & Sandbox: https://geornaden.github.io/finops-studio/');
  console.log('Cloud Store:    https://apify.com/finops_studio\n');
  for (const [key, slug, desc] of TOOLS) {
    console.log(`  ${key.padEnd(14)} https://apify.com/${slug.replace('~', '/')}  — ${desc}`);
  }
  console.log('\nPrint Claude/Cursor MCP JSON config: npx github:Geornaden/finops-studio mcp-config');
}
