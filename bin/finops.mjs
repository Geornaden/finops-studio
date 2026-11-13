#!/usr/bin/env node
/**
 * FinOps Studio Official CLI, Pre-Flight Checksum Doctor & MCP Helper (v1.4.0)
 * Zero-dependency client, local bank checksum validator & OpenAPI/MCP generator.
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

function validIban(iban) {
  const clean = iban.replace(/\s+/g, '').toUpperCase();
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/.test(clean)) return false;
  const rearr = clean.slice(4) + clean.slice(0, 4);
  const exp = rearr.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let rem = 0n;
  for (const ch of exp) rem = (rem * 10n + BigInt(ch)) % 97n;
  return rem === 1n;
}

function validAba(aba) {
  if (!/^[0-9]{9}$/.test(aba)) return false;
  const w = [3, 7, 1, 3, 7, 1, 3, 7, 1];
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(aba[i]) * w[i];
  return sum > 0 && sum % 10 === 0;
}

const cmd = process.argv[2] || 'list';

if (cmd === 'mcp-config') {
  const includeAll = process.argv.includes('--all');
  const selected = includeAll ? TOOLS : TOOLS.filter((t) => t[3]);
  console.log(
    JSON.stringify(
      {
        mcpServers: {
          'finops-studio': {
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
  console.log(JSON.stringify({
    openapiSpec: 'https://geornaden.github.io/finops-studio/openapi.json',
    postmanCollection: 'https://geornaden.github.io/finops-studio/workflows/finops-studio-postman-collection.json',
    mcpRegistrySuite: 'io.github.Geornaden/finops-studio'
  }, null, 2));
} else if (cmd === 'doctor') {
  const targetPath = process.argv[3];
  if (!targetPath || !fs.existsSync(targetPath)) {
    console.error('Usage: npx github:Geornaden/finops-studio doctor <batch-or-bank-file>');
    process.exit(1);
  }
  const raw = fs.readFileSync(targetPath, 'utf8');
  const lines = raw.split(/\r?\n/).filter((l) => l.length > 0);
  const widths = [...new Set(lines.map((l) => l.length))];
  const ibans = [...new Set(raw.match(/\b[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}\b/g) || [])];
  const badIbans = ibans.filter((i) => !validIban(i));
  const abas = [...new Set(raw.match(/\b[0-9]{9}\b/g) || [])].filter(validAba);

  let detectedFormat = 'Generic CSV / JSON Batch';
  if (widths.length === 1 && widths[0] === 94) detectedFormat = 'US NACHA ACH (94-char fixed-width)';
  else if (widths.length === 1 && widths[0] === 120) detectedFormat = 'Australian BECS ABA (120-char fixed-width)';
  else if (widths.length === 1 && widths[0] === 100) detectedFormat = 'UK BACS Standard 18 (100-char fixed-width)';
  else if (widths.length === 1 && widths[0] === 1464) detectedFormat = 'Canadian CPA-005 EFT (1,464-byte fixed-width)';
  else if (widths.length === 1 && widths[0] === 80 && lines[0].startsWith('11')) detectedFormat = 'Spanish AEB Norma 43 (80-char)';
  else if (raw.startsWith('01,')) detectedFormat = 'Corporate BAI2 Bank Statement';
  else if (raw.includes('pain.001')) detectedFormat = 'ISO 20022 SEPA Credit Transfer XML';
  else if (raw.includes('pain.002')) detectedFormat = 'ISO 20022 pain.002 Payment Status XML';

  const result = {
    ok: badIbans.length === 0,
    file: targetPath,
    detectedFormat,
    nonEmptyLines: lines.length,
    distinctLineLengths: widths.slice(0, 8),
    ibansChecked: ibans.length,
    invalidIbans: badIbans,
    validUsAbaRoutingNumbersFound: abas.length
  };
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(2);
} else if (cmd === 'run') {
  const toolKey = process.argv[3];
  const payloadPath = process.argv[4];
  const outIdx = process.argv.indexOf('--out');
  const outPath = outIdx !== -1 ? process.argv[outIdx + 1] : null;
  const token = process.env.APIFY_TOKEN;
  const entry = TOOLS.find((t) => t[0] === toolKey);
  if (!entry || !payloadPath) {
    console.error('Usage: APIFY_TOKEN=<token> npx github:Geornaden/finops-studio run <tool> <payload.json> [--out ./output.xml]');
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
  const text = await res.text();
  if (!res.ok) {
    console.error(`Cloud API HTTP ${res.status}: ${text}`);
    process.exit(1);
  }
  if (outPath) {
    const items = JSON.parse(text);
    const first = Array.isArray(items) && items[0] ? items[0] : items;
    const extracted = first.xmlContent || first.achContent || first.abaContent || first.bacsContent || first.cpa005Content || first.csvContent || text;
    fs.writeFileSync(outPath, extracted, 'utf8');
    console.log(`Saved verified bank/tax file to ${outPath} (${extracted.length} bytes)`);
  } else {
    console.log(text);
  }
} else {
  console.log('FinOps Studio v1.4.0 — 12 Deterministic Banking, Treasury & E-Invoicing Cloud APIs');
  console.log('Docs & Pre-Flight Tools : https://geornaden.github.io/finops-studio/');
  console.log('OpenAPI 3.1 Spec        : https://geornaden.github.io/finops-studio/openapi.json');
  console.log('Cloud API Storefront    : https://apify.com/finops_studio\n');
  for (const [key, slug, desc] of TOOLS) {
    console.log(`  ${key.padEnd(14)} https://apify.com/${slug.replace('~', '/')}  — ${desc}`);
  }
  console.log('\nCommands:');
  console.log('  npx github:Geornaden/finops-studio list');
  console.log('  npx github:Geornaden/finops-studio doctor ./batch.csv');
  console.log('  npx github:Geornaden/finops-studio mcp-config');
  console.log('  npx github:Geornaden/finops-studio openapi');
  console.log('  APIFY_TOKEN=... npx github:Geornaden/finops-studio run sepa ./payload.json --out ./sepa.xml');
}
