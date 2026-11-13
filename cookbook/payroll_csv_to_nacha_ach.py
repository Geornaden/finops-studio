#!/usr/bin/env python3
"""
FinOps Studio Official Cookbook — Recipe #4
Generate 94-Character Block-10 Padded US NACHA ACH (.ach) Direct Deposit & Vendor Payout Files
with 10-Point Federal Reserve ABA Routing Checksum Validation.

Zero external dependencies required (Python 3 standard library).
Cloud API: https://apify.com/finops_studio/nacha-ach-file-generator
"""
import json
import os
import urllib.request

APIFY_TOKEN = os.environ.get("APIFY_TOKEN", "YOUR_APIFY_API_TOKEN")
ENDPOINT = (
    "https://api.apify.com/v2/acts/finops_studio~nacha-ach-file-generator"
    f"/run-sync-get-dataset-items?token={APIFY_TOKEN}"
)


def generate_nacha_ach(entries: list[dict], output_file: str = "payroll-batch.ach") -> None:
    payload = {
        "immediateDestination": "021000021",
        "immediateDestinationName": "JPMORGAN CHASE",
        "immediateOrigin": "1999999999",
        "immediateOriginName": "ACME CORP INC",
        "companyName": "ACME CORP",
        "companyIdentification": "1999999999",
        "standardEntryClassCode": "PPD",
        "companyEntryDescription": "PAYROLL",
        "effectiveEntryDate": "261116",
        "originatingDfiIdentification": "02100002",
        "entries": entries,
    }
    req = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        items = json.loads(resp.read().decode("utf-8"))

    ach_text = items[0].get("achContent") or items[0].get("fileContent", "")
    with open(output_file, "w", encoding="ascii", newline="") as f:
        f.write(ach_text)
    print(f"Saved 94-char block-10 NACHA file ({len(entries)} entries) -> {output_file}")


if __name__ == "__main__":
    generate_nacha_ach([
        {
            "transactionCode": "22",  # 22 = Checking Credit, 32 = Savings Credit
            "receivingDfiRouting": "026009593",
            "receivingAccountNumber": "9876543210",
            "amount": 3250.00,
            "individualId": "EMP-1042",
            "individualName": "JANE DOE",
        }
    ])
