#!/usr/bin/env node
/**
 * FinOps Studio Official Cookbook — Recipe #2
 * Convert CSV / ERP Vendor Rows into 2026 EPC Structured-Address ISO 20022 SEPA XML (pain.001.001.09).
 *
 * Requires Node.js 18+ (built-in fetch, zero npm dependencies).
 * Cloud API & Free $5 Platform Credit: https://apify.com/finops_studio/sepa-xml-generator
 */
import fs from 'node:fs';

const APIFY_TOKEN = process.env.APIFY_TOKEN || 'YOUR_APIFY_API_TOKEN';
const ENDPOINT = `https://api.apify.com/v2/acts/finops_studio~sepa-xml-generator/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;

async function generateSepaXml(transactions, outputPath = 'sepa-payout-pain001.xml') {
  const payload = {
    messageType: 'pain.001.001.09',
    initiatingPartyName: 'Acme Europe GmbH',
    debtorName: 'Acme Europe GmbH',
    debtorIban: 'DE89370400440532013000',
    debtorBic: 'COBADEFFXXX',
    debtorAddress: {
      streetName: 'Friedrichstrasse 100',
      postCode: '10117',
      townName: 'Berlin',
      country: 'DE'
    },
    executionDate: new Date().toISOString().slice(0, 10),
    transactions
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`FinOps Studio API HTTP ${res.status}: ${await res.text()}`);

  const [result] = await res.json();
  const xml = result.xmlContent || result.fileContent;
  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(`Generated IBAN-verified 2026 SEPA XML (${transactions.length} transfers) -> ${outputPath}`);
}

// Example execution
generateSepaXml([
  {
    endToEndId: 'INV-2026-4410',
    creditorName: 'Nordic Cloud AB',
    creditorIban: 'NL91ABNA0417164300',
    amount: 2450.75,
    currency: 'EUR',
    remittanceInfo: 'Invoice 4410 Cloud Hosting',
    creditorAddress: { townName: 'Amsterdam', postCode: '1012', country: 'NL' }
  }
]).catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
