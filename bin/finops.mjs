#!/usr/bin/env node
/**
 * FinOps Studio Official CLI & MCP Helper (v1.3.0)
 * Zero-dependency thin HTTP client & MCP config generator for FinOps Studio Cloud APIs on Apify Store.
 */
import fs from 'node:fs';

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

const cmd = process.argv[2] || 'list';

if (cmd === 'mcp-config') {
  const includeAll = process.argv.includes('--all');
  const selected = includeAll ? TOOLS : TOOLS.filter((t) => t[3]);
  console.log(
    JSON.stringify(
      {
        mcpServers: {
          'finops-studio': {
            url:
              'https://mcp.apify.com/?actors=' +
              selected.map((t) => t[1].replace('~', '/')).join(','),
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
} else if (cmd === 'run') {
  const toolKey = process.argv[3];
  const payloadPath = process.argv[4];
  const token = process.env.APIFY_TOKEN;
  const entry = TOOLS.find((t) => t[0] === toolKey);
  if (!entry || !payloadPath) {
    console.error('Usage: APIFY_TOKEN=<token> npx github:Geornaden/finops-studio run <tool> <payload.json>');
    console.error('Tools: ' + TOOLS.map((t) => t[0]).join(', '));
    process.exit(1);
  }
  if (!token) {
    console.error('Error: Set APIFY_TOKEN environment variable (free $5/mo credits at https://apify.com/finops_studio).');
    process.exit(1);
  }
  const body = fs.readFileSync(payloadPath, 'utf8');
  JSON.parse(body);
  const url = `https://api.apify.com/v2/acts/${entry[1]}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  });
  if (!res.ok) {
    console.error(`Cloud API HTTP ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  console.log(await res.text());
} else {
  console.log('FinOps Studio v1.3.0 — 12 Deterministic Banking, Treasury & E-Invoicing Cloud APIs');
  console.log('Docs & Free Checkers: https://geornaden.github.io/finops-studio/');
  console.log('Cloud API Storefront: https://apify.com/finops_studio\n');
  for (const [key, slug, desc] of TOOLS) {
    console.log(`  ${key.padEnd(14)} https://apify.com/${slug.replace('~', '/')}  — ${desc}`);
  }
  console.log('\nCommands:');
  console.log('  npx github:Geornaden/finops-studio list');
  console.log('  npx github:Geornaden/finops-studio mcp-config');
  console.log('  APIFY_TOKEN=... npx github:Geornaden/finops-studio run sepa ./payload.json');
}
