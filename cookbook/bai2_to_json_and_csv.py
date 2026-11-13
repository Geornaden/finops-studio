#!/usr/bin/env python3
"""
FinOps Studio Official Cookbook — Recipe #3
Parse Corporate BAI2 Bank Statements (J.P. Morgan Access, BofA CashPro, Wells Fargo CEO, CitiDirect, HSBCnet)
into Clean JSON & Flat CSV Rows for Postgres, Snowflake, BigQuery, NetSuite, or Odoo Reconciliation.

Zero external dependencies required (Python 3 standard library).
Cloud API: https://apify.com/finops_studio/bai2-bank-statement-parser
"""
import json
import os
import urllib.request

APIFY_TOKEN = os.environ.get("APIFY_TOKEN", "YOUR_APIFY_API_TOKEN")
ENDPOINT = (
    "https://api.apify.com/v2/acts/finops_studio~bai2-bank-statement-parser"
    f"/run-sync-get-dataset-items?token={APIFY_TOKEN}"
)


def parse_bai2_statement(bai2_raw_text: str) -> dict:
    req = urllib.request.Request(
        ENDPOINT,
        data=json.dumps({"bai2Content": bai2_raw_text}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        items = json.loads(resp.read().decode("utf-8"))
    return items[0]


if __name__ == "__main__":
    sample_bai2 = "\n".join([
        "01,021000021,ACMECORP,261112,0800,001,,,2/",
        "02,ACMECORP,021000021,1,261111,,USD,2/",
        "03,000123456789,USD,010,50000000,,,015,52500000,,,/",
        "16,195,2500000,Z,REF99812,CUST-WIRE-01/",
        "88,INCOMING FEDWIRE PAYMENT FROM GLOBAL CLIENT INC/",
        "49,105000000,4/",
        "98,105000000,1,6/",
        "99,105000000,1,8/",
    ])
    parsed = parse_bai2_statement(sample_bai2)
    print(json.dumps(parsed, indent=2))
