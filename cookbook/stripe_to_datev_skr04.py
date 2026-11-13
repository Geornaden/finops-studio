#!/usr/bin/env python3
"""
FinOps Studio Official Cookbook — Recipe #1
Convert Stripe / Shopify Payouts or Invoices into Official German DATEV EXTF v700 Buchungsstapel CSV (SKR03 / SKR04).

Zero external dependencies required (uses Python 3 standard library).
Get your free Apify API token ($5/mo platform credit included) at: https://apify.com/finops_studio/datev-buchungsstapel-generator
"""
import json
import os
import urllib.request

APIFY_TOKEN = os.environ.get("APIFY_TOKEN", "YOUR_APIFY_API_TOKEN")
ENDPOINT = (
    "https://api.apify.com/v2/acts/finops_studio~datev-buchungsstapel-generator"
    f"/run-sync-get-dataset-items?token={APIFY_TOKEN}"
)


def generate_datev_buchungsstapel(bookings: list[dict], output_file: str = "EXTF_Buchungsstapel.csv") -> None:
    payload = {
        "consultantNumber": "12345",   # Beraternummer (Steuerberater)
        "clientNumber": "67890",       # Mandantennummer
        "chartOfAccounts": "SKR04",    # "SKR03" or "SKR04"
        "fiscalYearStart": "20260101",
        "bookings": bookings,
    }
    req = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        items = json.loads(resp.read().decode("utf-8"))

    csv_text = items[0].get("csvContent") or items[0].get("fileContent", "")
    with open(output_file, "w", encoding="utf-8", newline="") as f:
        f.write(csv_text)
    print(f"Saved certified DATEV EXTF v700 CSV ({len(bookings)} bookings) -> {output_file}")


if __name__ == "__main__":
    sample_stripe_bookings = [
        {
            "amount": 1190.00,
            "debitCredit": "S",
            "account": "1800",
            "contraAccount": "4400",
            "taxKey": "9",
            "bookingDate": "1211",
            "documentNumber": "STRIPE-INV-9042",
            "postingText": "SaaS Jahresabo Kunde GmbH",
        }
    ]
    generate_datev_buchungsstapel(sample_stripe_bookings)
