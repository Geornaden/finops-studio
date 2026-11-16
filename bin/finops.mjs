#!/usr/bin/env node
/**
 * FinOps Studio Official CLI, Pre-Flight Checksum Doctor & MCP Server (v1.5.0)
 * Zero-dependency CLI, local bank checksum validator, OpenAPI/MCP helper & stdio MCP server.
 */
import fs from 'node:fs';
import readline from 'node:readline';

const VERSION = '1.5.0';

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

const CLOUD_MCP_TOOLS = [
  {
    name: 'generate_sepa_xml',
    slug: 'finops_studio~sepa-xml-generator',
    description: 'Generate 2026 EPC-compliant ISO 20022 SEPA Credit Transfer (pain.001.001.09) or Direct Debit (pain.008.001.08) XML via Apify Cloud.',
    payloadDesc: 'JSON input matching finops_studio/sepa-xml-generator schema (schema, initiatingPartyName, initiatingPartyIban, transactions, etc.).'
  },
  {
    name: 'generate_eu_einvoice_xml',
    slug: 'finops_studio~eu-einvoice-xml-generator',
    description: 'Generate EN 16931 EU E-Invoice XML (Peppol BIS 3.0 UBL, German XRechnung 3.0, or Factur-X/ZUGFeRD CII) via Apify Cloud.',
    payloadDesc: 'JSON input matching finops_studio/eu-einvoice-xml-generator schema (format, invoiceNumber, issueDate, currency, seller, buyer, lines).'
  },
  {
    name: 'generate_nacha_ach',
    slug: 'finops_studio~nacha-ach-file-generator',
    description: 'Generate or parse 94-character Block-10 padded US NACHA ACH (.ach) PPD/CCD/WEB files via Apify Cloud.',
    payloadDesc: 'JSON input matching finops_studio/nacha-ach-file-generator schema (mode, secCode, immediateDestination, companyName, companyId, entries).'
  },
  {
    name: 'parse_bai2_statement',
    slug: 'finops_studio~bai2-bank-statement-parser',
    description: 'Parse corporate BAI2 cash-management bank statements (01/02/03/16/88/49/98/99) into JSON & CSV via Apify Cloud.',
    payloadDesc: 'JSON input matching finops_studio/bai2-bank-statement-parser schema (bai2Text, includeInlineCsv).'
  },
  {
    name: 'generate_datev_csv',
    slug: 'finops_studio~datev-buchungsstapel-generator',
    description: 'Generate German DATEV EXTF v700 Buchungsstapel CSV (SKR03 / SKR04) via Apify Cloud.',
    payloadDesc: 'JSON input matching finops_studio/datev-buchungsstapel-generator schema (skr, consultantNumber, clientNumber, batchTitle, bookings).'
  },
  {
    name: 'generate_australian_aba',
    slug: 'finops_studio~aba-cemtex-file-generator',
    description: 'Generate 120-character Australian AusPayNet BECS Direct Entry (.aba / Cemtex) files via Apify Cloud.',
    payloadDesc: 'JSON input matching finops_studio/aba-cemtex-file-generator schema (bankCode, userName, apcaUserId, traceBsb, traceAccount, transactions).'
  },
  {
    name: 'decode_pain002_status',
    slug: 'finops_studio~iso20022-pain002-status-parser',
    description: 'Decode ISO 20022 pain.002 XML bank payment rejection reports (AC04, AM04, BE04, MD01) into plain-English fixes via Apify Cloud.',
    payloadDesc: 'JSON input matching finops_studio/iso20022-pain002-status-parser schema (xmlContent, onlyRejectedOrExceptions, includeInlineCsv).'
  },
  {
    name: 'generate_uk_bacs_18',
    slug: 'finops_studio~uk-bacs-standard18-generator',
    description: 'Generate 100-character Pay.UK BACS Standard 18 (VOL1/HDR1/UHL1 + Contra + UTL1) files via Apify Cloud.',
    payloadDesc: 'JSON input matching finops_studio/uk-bacs-standard18-generator schema (serviceUserNumber, originatingCompanyName, originatingSortCode, originatingAccountNumber, payments).'
  },
  {
    name: 'generate_canada_cpa005',
    slug: 'finops_studio~canada-cpa005-eft-generator',
    description: 'Generate 1,464-byte Payments Canada Standard 005 EFT direct deposit & supplier files via Apify Cloud.',
    payloadDesc: 'JSON input matching finops_studio/canada-cpa005-eft-generator schema (originatorId, originatorShortName, destinationDataCentre, transactions).'
  }
];

function getMcpToolDefinitions() {
  return [
    {
      name: 'validate_bank_routing',
      description: 'Offline deterministic validator for ISO 13616 IBAN (MOD-97), US 9-digit ABA routing number (MOD-10), UK 6-digit Sort Code, and Australian 6-digit BSB.',
      inputSchema: {
        type: 'object',
        properties: {
          iban: { type: 'string', description: 'International Bank Account Number (e.g., DE89370400440532013000)' },
          aba: { type: 'string', description: 'US 9-digit ABA Fedwire/ACH routing number (e.g., 021000021)' },
          ukSortCode: { type: 'string', description: 'UK 6-digit BACS Sort Code (e.g., 40-05-15)' },
          auBsb: { type: 'string', description: 'Australian 6-digit BSB number (e.g., 062-000)' }
        }
      }
    },
    {
      name: 'audit_bank_file_format',
      description: 'Offline pre-flight inspector that detects bank/tax file format (NACHA 94-char, AU ABA 120-char, UK BACS 100-char, CA CPA-005 1464-byte, Norma 43 80-char, BAI2, SEPA/ISO 20022 XML) and validates every embedded IBAN & ABA checksum.',
      inputSchema: {
        type: 'object',
        required: ['content'],
        properties: {
          content: { type: 'string', description: 'Raw text content of the bank file, CSV, or XML snippet to audit' }
        }
      }
    },
    ...CLOUD_MCP_TOOLS.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: {
        type: 'object',
        required: ['payload'],
        properties: {
          payload: {
            type: 'object',
            description: t.payloadDesc
          }
        }
      }
    }))
  ];
}

function sendJsonRpc(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n');
}

async function handleMcpCallTool(name, args = {}) {
  if (name === 'validate_bank_routing') {
    const checks = {};
    if (args.iban) checks.iban = { input: args.iban, valid: validIban(args.iban), normalized: String(args.iban).replace(/\s+/g, '').toUpperCase() };
    if (args.aba) checks.usAbaRouting = { input: args.aba, valid: validAba(args.aba), normalized: String(args.aba).replace(/\s+/g, '') };
    if (args.ukSortCode) checks.ukSortCode = validUkSortCode(args.ukSortCode);
    if (args.auBsb) checks.auBsb = validAuBsb(args.auBsb);
    if (Object.keys(checks).length === 0) {
      return {
        isError: true,
        content: [{ type: 'text', text: 'Provide at least one parameter: iban, aba, ukSortCode, or auBsb.' }]
      };
    }
    return { content: [{ type: 'text', text: JSON.stringify({ ok: true, checks }, null, 2) }] };
  }

  if (name === 'audit_bank_file_format') {
    if (!args.content || typeof args.content !== 'string') {
      return { isError: true, content: [{ type: 'text', text: 'Missing required string parameter: content' }] };
    }
    const audit = auditBankText(args.content, 'mcp-inline');
    return { content: [{ type: 'text', text: JSON.stringify(audit, null, 2) }] };
  }

  const cloudTool = CLOUD_MCP_TOOLS.find((t) => t.name === name);
  if (!cloudTool) {
    return { isError: true, content: [{ type: 'text', text: `Unknown tool: ${name}` }] };
  }

  const token = process.env.APIFY_TOKEN;
  if (!token) {
    return {
      isError: false,
      content: [
        {
          type: 'text',
          text:
            `Cloud API token not configured in APIFY_TOKEN.\n\n` +
            `To run ${cloudTool.name} in the cloud:\n` +
            `1. Claim $5/month free starter credits at https://apify.com/finops_studio (tool: https://apify.com/${cloudTool.slug.replace('~', '/')}) and set APIFY_TOKEN in your MCP env config.\n` +
            `2. Or connect directly via hosted Remote MCP Subscriptions & Grade-A listings at https://mcprush.com/geornaden-2`
        }
      ]
    };
  }

  const payload = args.payload && typeof args.payload === 'object' ? args.payload : args;
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
            protocolVersion: '2024-11-05',
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
  console.log(`FinOps Studio v${VERSION} — 12 Deterministic Banking, Treasury & E-Invoicing Cloud APIs & MCP Server`);
  console.log('Docs & Pre-Flight Tools : https://geornaden.github.io/finops-studio/');
  console.log('OpenAPI 3.1 Spec        : https://geornaden.github.io/finops-studio/openapi.json');
  console.log('Edge OpenAPI 3.1 Spec   : https://geornaden.github.io/finops-studio/openapi-edge.json');
  console.log('Cloud API Storefront    : https://apify.com/finops_studio\n');
  for (const [key, slug, desc] of TOOLS) {
    console.log(`  ${key.padEnd(14)} https://apify.com/${slug.replace('~', '/')}  — ${desc}`);
  }
  console.log('\nCommands:');
  console.log('  npx github:Geornaden/finops-studio mcp        # Start local stdio MCP server');
  console.log('  npx github:Geornaden/finops-studio list');
  console.log('  npx github:Geornaden/finops-studio doctor ./batch.csv');
  console.log('  npx github:Geornaden/finops-studio mcp-config');
  console.log('  npx github:Geornaden/finops-studio openapi');
  console.log('  APIFY_TOKEN=... npx github:Geornaden/finops-studio run sepa ./payload.json --out ./sepa.xml');
}
