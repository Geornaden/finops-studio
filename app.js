// FinOps Studio — Public Interactive Sample Showcase (Proprietary Cloud Engines run privately on Apify Cloud)
export const TOOLS_CONFIG = {
  "sepa": {
    "label": "🇪🇺 SEPA XML (pain.001/008)",
    "storeUrl": "https://apify.com/finops_studio/sepa-xml-generator",
    "actorSlug": "finops_studio~sepa-xml-generator",
    "fileExt": "SEPA_SAMPLE_OUTPUT.xml",
    "mime": "application/xml",
    "summary": "VALID pain.001.001.09 • 2 tx • CtrlSum EUR 2100.45 (Sample Preview)",
    "sample": "name;iban;bic;amount;reference;country;city\nMüller & Söhne KG;DE89370400440532013000;COBADEFFXXX;1250.50;Invoice INV-2026-001;DE;Munich\nÉlodie Lefèvre SARL;FR7630006000011234567890189;BNPAFRPPXXX;849.95;Facture 2026-104;FR;Paris",
    "output": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Document xmlns=\"urn:iso:std:iso:20022:tech:xsd:pain.001.001.09\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n  <CstmrCdtTrfInitn>\n    <GrpHdr>\n      <MsgId>MSG-20261116-677180</MsgId>\n      <CreDtTm>2026-11-12T14:44:37</CreDtTm>\n      <NbOfTxs>2</NbOfTxs>\n      <CtrlSum>2100.45</CtrlSum>\n      <InitgPty>\n        <Nm>Acme Europe GmbH</Nm>\n      </InitgPty>\n    </GrpHdr>\n    <PmtInf>\n      <PmtInfId>PMT-20261116-01</PmtInfId>\n      <PmtMtd>TRF</PmtMtd>\n      <BtchBookg>true</BtchBookg>\n      <NbOfTxs>2</NbOfTxs>\n      <CtrlSum>2100.45</CtrlSum>\n      <PmtTpInf>\n        <SvcLvl>\n          <Cd>SEPA</Cd>\n        </SvcLvl>\n      </PmtTpInf>\n      <ReqdExctnDt>\n        <Dt>2026-11-16</Dt>\n      </ReqdExctnDt>\n      <Dbtr>\n        <Nm>Acme Europe GmbH</Nm>\n        <PstlAdr>\n          <TwnNm>Berlin</TwnNm>\n          <Ctry>DE</Ctry>\n        </PstlAdr>\n      </Dbtr>\n      <DbtrAcct>\n        <Id>\n          <IBAN>DE89370400440532013000</IBAN>\n        </Id>\n        <Ccy>EUR</Ccy>\n      </DbtrAcct>\n      <DbtrAgt>\n        <FinInstnId>\n          <BICFI>COBADEFFXXX</BICFI>\n        </FinInstnId>\n      </DbtrAgt>\n      <ChrgBr>SLEV</ChrgBr>\n      <CdtTrfTxInf>\n        <PmtId>\n          <EndToEndId>E2E-20261116-0001</EndToEndId>\n        </PmtId>\n        <Amt>\n          <InstdAmt Ccy=\"EUR\">1250.50</InstdAmt>\n        </Amt>\n        <CdtrAgt>\n          <FinInstnId>\n            <BICFI>COBADEFFXXX</BICFI>\n          </FinInstnId>\n        </CdtrAgt>\n        <Cdtr>\n          <Nm>Mueller + Soehne KG</Nm>\n          <PstlAdr>\n            <TwnNm>Munich</TwnNm>\n            <Ctry>DE</Ctry>\n          </PstlAdr>\n        </Cdtr>\n        <CdtrAcct>\n          <Id>\n            <IBAN>DE89370400440532013000</IBAN>\n          </Id>\n        </CdtrAcct>\n        <RmtInf>\n          <Ustrd>Invoice INV-2026-001</Ustrd>\n        </RmtInf>\n      </CdtTrfTxInf>\n      <CdtTrfTxInf>\n        <PmtId>\n          <EndToEndId>E2E-20261116-0002</EndToEndId>\n        </PmtId>\n        <Amt>\n          <InstdAmt Ccy=\"EUR\">849.95</InstdAmt>\n        </Amt>\n        <CdtrAgt>\n          <FinInstnId>\n            <BICFI>BNPAFRPPXXX</BICFI>\n          </FinInstnId>\n        </CdtrAgt>\n        <Cdtr>\n          <Nm>Elodie Lefevre SARL</Nm>\n          <PstlAdr>\n            <TwnNm>Paris</TwnNm>\n            <Ctry>FR</Ctry>\n          </PstlAdr>\n        </Cdtr>\n        <CdtrAcct>\n          <Id>\n            <IBAN>FR7630006000011234567890189</IBAN>\n          </Id>\n        </CdtrAcct>\n        <RmtInf>\n          <Ustrd>Facture 2026-104</Ustrd>\n        </RmtInf>\n      </CdtTrfTxInf>\n    </PmtInf>\n  </CstmrCdtTrfInitn>\n</Document>"
  },
  "einvoice": {
    "label": "🧾 EU E-Invoice (Peppol/XRechnung)",
    "storeUrl": "https://apify.com/finops_studio/eu-einvoice-xml-generator",
    "actorSlug": "finops_studio~eu-einvoice-xml-generator",
    "fileExt": "EINVOICE_SAMPLE_EN16931.xml",
    "mime": "application/xml",
    "summary": "VALID peppol-ubl-3.0 • Net 1600.00 + VAT 304.00 = 1904.00 EUR (Sample Preview)",
    "sample": "{\n  \"format\": \"peppol-ubl-3.0\",\n  \"invoiceNumber\": \"INV-2026-1001\",\n  \"issueDate\": \"2026-11-12\",\n  \"dueDate\": \"2026-11-26\",\n  \"currency\": \"EUR\",\n  \"buyerReference\": \"PO-2026-8841\",\n  \"seller\": {\n    \"name\": \"TechSolutions GmbH\",\n    \"vatId\": \"DE123456789\",\n    \"street\": \"Friedrichstr. 100\",\n    \"city\": \"Berlin\",\n    \"postalCode\": \"10115\",\n    \"country\": \"DE\",\n    \"iban\": \"DE89370400440532013000\"\n  },\n  \"buyer\": {\n    \"name\": \"EuroTrade NV\",\n    \"vatId\": \"BE0123456789\",\n    \"street\": \"Rue de la Loi 42\",\n    \"city\": \"Brussels\",\n    \"postalCode\": \"1000\",\n    \"country\": \"BE\"\n  },\n  \"lines\": [\n    {\n      \"description\": \"Website Setup Service\",\n      \"quantity\": 10,\n      \"unitPrice\": \"125.00\",\n      \"vatRate\": 19\n    },\n    {\n      \"description\": \"Monthly Hosting Plan\",\n      \"quantity\": 1,\n      \"unitPrice\": \"350.00\",\n      \"vatRate\": 19\n    }\n  ]\n}",
    "output": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Invoice xmlns=\"urn:oasis:names:specification:ubl:schema:xsd:Invoice-2\" xmlns:cac=\"urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2\" xmlns:cbc=\"urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2\">\n  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0</cbc:CustomizationID>\n  <cbc:ProfileID>urn:fdc:peppol.eu:2017:poacc:billing:01:1.0</cbc:ProfileID>\n  <cbc:ID>INV-2026-1001</cbc:ID>\n  <cbc:IssueDate>2026-11-12</cbc:IssueDate>\n  <cbc:DueDate>2026-11-26</cbc:DueDate>\n  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>\n  <cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode>\n  <cbc:BuyerReference>PO-2026-8841</cbc:BuyerReference>\n  <cac:AccountingSupplierParty>\n    <cac:Party>\n      <cbc:EndpointID schemeID=\"9930\">DE123456789</cbc:EndpointID>\n      <cac:PartyName>\n        <cbc:Name>TechSolutions GmbH</cbc:Name>\n      </cac:PartyName>\n      <cac:PostalAddress>\n        <cbc:StreetName>Friedrichstr. 100</cbc:StreetName>\n        <cbc:CityName>Berlin</cbc:CityName>\n        <cbc:PostalZone>10115</cbc:PostalZone>\n        <cac:Country>\n          <cbc:IdentificationCode>DE</cbc:IdentificationCode>\n        </cac:Country>\n      </cac:PostalAddress>\n      <cac:PartyTaxScheme>\n        <cbc:CompanyID>DE123456789</cbc:CompanyID>\n        <cac:TaxScheme>\n          <cbc:ID>VAT</cbc:ID>\n        </cac:TaxScheme>\n      </cac:PartyTaxScheme>\n      <cac:PartyLegalEntity>\n        <cbc:RegistrationName>TechSolutions GmbH</cbc:RegistrationName>\n      </cac:PartyLegalEntity>\n    </cac:Party>\n  </cac:AccountingSupplierParty>\n  <cac:AccountingCustomerParty>\n    <cac:Party>\n      <cbc:EndpointID schemeID=\"9930\">BE0123456789</cbc:EndpointID>\n      <cac:PartyName>\n        <cbc:Name>EuroTrade NV</cbc:Name>\n      </cac:PartyName>\n      <cac:PostalAddress>\n        <cbc:StreetName>Rue de la Loi 42</cbc:StreetName>\n        <cbc:CityName>Brussels</cbc:CityName>\n        <cbc:PostalZone>1000</cbc:PostalZone>\n        <cac:Country>\n          <cbc:IdentificationCode>BE</cbc:IdentificationCode>\n        </cac:Country>\n      </cac:PostalAddress>\n      <cac:PartyLegalEntity>\n        <cbc:RegistrationName>EuroTrade NV</cbc:RegistrationName>\n      </cac:PartyLegalEntity>\n    </cac:Party>\n  </cac:AccountingCustomerParty>\n  <cac:PaymentMeans>\n    <cbc:PaymentMeansCode>58</cbc:PaymentMeansCode>\n    <cac:PayeeFinancialAccount>\n      <cbc:ID>DE89370400440532013000</cbc:ID>\n    </cac:PayeeFinancialAccount>\n  </cac:PaymentMeans>\n  <cac:TaxTotal>\n    <cbc:TaxAmount currencyID=\"EUR\">304.00</cbc:TaxAmount>\n    <cac:TaxSubtotal>\n      <cbc:TaxableAmount currencyID=\"EUR\">1600.00</cbc:TaxableAmount>\n      <cbc:TaxAmount currencyID=\"EUR\">304.00</cbc:TaxAmount>\n      <cac:TaxCategory>\n        <cbc:ID>S</cbc:ID>\n        <cbc:Percent>19.00</cbc:Percent>\n        <cac:TaxScheme>\n          <cbc:ID>VAT</cbc:ID>\n        </cac:TaxScheme>\n      </cac:TaxCategory>\n    </cac:TaxSubtotal>\n  </cac:TaxTotal>\n  <cac:LegalMonetaryTotal>\n    <cbc:LineExtensionAmount currencyID=\"EUR\">1600.00</cbc:LineExtensionAmount>\n    <cbc:TaxExclusiveAmount currencyID=\"EUR\">1600.00</cbc:TaxExclusiveAmount>\n    <cbc:TaxInclusiveAmount currencyID=\"EUR\">1904.00</cbc:TaxInclusiveAmount>\n    <cbc:PayableAmount currencyID=\"EUR\">1904.00</cbc:PayableAmount>\n  </cac:LegalMonetaryTotal>\n  <cac:InvoiceLine>\n    <cbc:ID>1</cbc:ID>\n    <cbc:InvoicedQuantity unitCode=\"C62\">10</cbc:InvoicedQuantity>\n    <cbc:LineExtensionAmount currencyID=\"EUR\">1250.00</cbc:LineExtensionAmount>\n    <cac:Item>\n      <cbc:Name>Website Setup Service</cbc:Name>\n      <cac:ClassifiedTaxCategory>\n        <cbc:ID>S</cbc:ID>\n        <cbc:Percent>19.00</cbc:Percent>\n        <cac:TaxScheme>\n          <cbc:ID>VAT</cbc:ID>\n        </cac:TaxScheme>\n      </cac:ClassifiedTaxCategory>\n    </cac:Item>\n    <cac:Price>\n      <cbc:PriceAmount currencyID=\"EUR\">125.00</cbc:PriceAmount>\n    </cac:Price>\n  </cac:InvoiceLine>\n  <cac:InvoiceLine>\n    <cbc:ID>2</cbc:ID>\n    <cbc:InvoicedQuantity unitCode=\"C62\">1</cbc:InvoicedQuantity>\n    <cbc:LineExtensionAmount currencyID=\"EUR\">350.00</cbc:LineExtensionAmount>\n    <cac:Item>\n      <cbc:Name>Monthly Hosting Plan</cbc:Name>\n      <cac:ClassifiedTaxCategory>\n        <cbc:ID>S</cbc:ID>\n        <cbc:Percent>19.00</cbc:Percent>\n        <cac:TaxScheme>\n          <cbc:ID>VAT</cbc:ID>\n        </cac:TaxScheme>\n      </cac:ClassifiedTaxCategory>\n    </cac:Item>\n    <cac:Price>\n      <cbc:PriceAmount currencyID=\"EUR\">350.00</cbc:PriceAmount>\n    </cac:Price>\n  </cac:InvoiceLine>\n</Invoice>"
  },
  "nacha": {
    "label": "🇺🇸 US NACHA ACH (.ach)",
    "storeUrl": "https://apify.com/finops_studio/nacha-ach-file-generator",
    "actorSlug": "finops_studio~nacha-ach-file-generator",
    "fileExt": "ACH_BATCH_SAMPLE.ach",
    "mime": "text/plain",
    "summary": "VALID 94-Char NACHA (PPD) • 2 entries • Credits $4425.50 (Sample Preview)",
    "sample": "name,routing,account,amount,type,id\nSARAH JENKINS,021000021,449012398,2450.00,checking,EMP-101\nMARCUS VANCE,121000358,883104921,1975.50,checking,EMP-102",
    "output": "101 02100002119876543212611120900A094101JPMORGAN CHASE         ACME US CORP                   \n5220ACME US CORP                        1987654321PPDPAYROLL   261112261116   1021000020000001\n622021000021449012398        0000245000EMP-101        SARAH JENKINS           0021000020000001\n622121000358883104921        0000197550EMP-102        MARCUS VANCE            0021000020000002\n822000000200142000370000000000000000004425501987654321                         021000020000001\n9000001000001000000020014200037000000000000000000442550                                       \n9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999"
  },
  "bai2": {
    "label": "🏦 BAI2 Treasury Parser",
    "storeUrl": "https://apify.com/finops_studio/bai2-bank-statement-parser",
    "actorSlug": "finops_studio~bai2-bank-statement-parser",
    "fileExt": "BAI2_CLEAN_SAMPLE.csv",
    "mime": "text/csv",
    "summary": "PARSED 1 Account • 2 Transactions Stitched to CSV (Sample Preview)",
    "sample": "01,021000021,ACMECORP,261112,0830,001,80,1,2/\n02,ACMECORP,021000021,1,261111,2359,USD,2/\n03,0044918273,USD,010,12500000,,,015,13925050,,,045,13925050,,/\n16,195,1500000,Z,WIRE26111101,CUST-8841,INCOMING WIRE FROM GLOBAL CLIENT INC/\n88,INVOICE REF INV-2026-991 PAID IN FULL/\n16,455,74950,Z,ACH26111109,AWS-CLOUD,AMAZON WEB SERVICES MONTHLY BILLING/\n49,29749950,6/\n98,29749950,1,8/\n99,29749950,1,10/",
    "output": "account_number,as_of_date,currency,type_code,type_description,direction,amount,signed_amount,bank_reference,customer_reference,remittance_text\n0044918273,261111,USD,195,\"Incoming Money Transfer / Wire Credit\",credit,15000.00,15000.00,\"WIRE26111101\",\"CUST-8841\",\"INCOMING WIRE FROM GLOBAL CLIENT INC INVOICE REF INV-2026-991 PAID IN FULL\"\n0044918273,261111,USD,455,\"Preauthorized ACH Debit\",debit,749.50,-749.50,\"ACH26111109\",\"AWS-CLOUD\",\"AMAZON WEB SERVICES MONTHLY BILLING\""
  },
  "datev": {
    "label": "🇩🇪 DATEV Buchungsstapel",
    "storeUrl": "https://apify.com/finops_studio/datev-buchungsstapel-generator",
    "actorSlug": "finops_studio~datev-buchungsstapel-generator",
    "fileExt": "EXTF_Buchungsstapel_Sample.csv",
    "mime": "text/csv",
    "summary": "VALID DATEV EXTF v700 (SKR03) • 2 Bookings • EUR 1725,00 (Sample Preview)",
    "sample": "{\n  \"skr\": \"SKR03\",\n  \"consultantNumber\": \"12345\",\n  \"clientNumber\": \"10001\",\n  \"bookings\": [\n    {\n      \"date\": \"2026-11-10\",\n      \"amount\": \"1190.00\",\n      \"vatRate\": 19,\n      \"invoiceNumber\": \"RE-2026-401\",\n      \"description\": \"Stripe Abo Zahlung GmbH\"\n    },\n    {\n      \"date\": \"2026-11-11\",\n      \"amount\": \"535.00\",\n      \"vatRate\": 7,\n      \"invoiceNumber\": \"RE-2026-402\",\n      \"description\": \"Shopify Bestellung Schmidt\"\n    }\n  ]\n}",
    "output": "\"EXTF\";700;21;\"Buchungsstapel\";13;20261112144437189;;\"FO\";\"\";\"\";12345;10001;20260101;4;20261101;20261130;\"Ausgangsrechnungen\";\"\";1;0;0;\"EUR\";;\"\";;;;;;\"\";\r\nUmsatz (ohne Soll/Haben-Kz);Soll/Haben-Kennzeichen;WKZ Umsatz;Kurs;Basis-Umsatz;WKZ Basis-Umsatz;Konto;Gegenkonto (ohne BU-Schlüssel);BU-Schlüssel;Belegdatum;Belegfeld 1;Belegfeld 2;Skonto;Buchungstext\r\n1190,00;\"S\";\"EUR\";;;;1200;8400;;1011;\"RE-2026-401\";\"\";;\"Stripe Abo Zahlung GmbH\"\r\n535,00;\"S\";\"EUR\";;;;1200;8300;;1111;\"RE-2026-402\";\"\";;\"Shopify Bestellung Schmidt\""
  },
  "aba": {
    "label": "🇦🇺 Australian ABA (.aba)",
    "storeUrl": "https://apify.com/finops_studio/aba-cemtex-file-generator",
    "actorSlug": "finops_studio~aba-cemtex-file-generator",
    "fileExt": "DIRECT_ENTRY_SAMPLE.aba",
    "mime": "text/plain",
    "summary": "VALID 120-Char BECS ABA (CBA) • 2 Payees • AUD 4040.50 (Sample Preview)",
    "sample": "name,bsb,account,amount,reference\nLIAM O CONNOR,062-000,12345678,2150.00,WAGES NOV\nCHLOE NGUYEN,082-088,87654321,1890.50,WAGES NOV",
    "output": "0                 01CBA       SYDNEY TECH PTY LTD       301500PAYROLL     161126                                        \r\n1062-000 12345678 530000215000LIAM O CONNOR                   WAGES NOV         062-000 10458921SYDNEY TECH PTY 00000000\r\n1082-088 87654321 530000189050CHLOE NGUYEN                    WAGES NOV         062-000 10458921SYDNEY TECH PTY 00000000\r\n1062-000 10458921 130000404050SYDNEY TECH PTY LTD             PAYROLL           062-000 10458921SYDNEY TECH PTY 00000000\r\n7999-999            000000000000004040500000404050                        000003                                        "
  },
  "bacs": {
    "label": "🇬🇧 UK BACS Standard 18",
    "storeUrl": "https://apify.com/finops_studio/uk-bacs-standard18-generator",
    "actorSlug": "finops_studio~uk-bacs-standard18-generator",
    "fileExt": "UK_BACS_STANDARD18_SAMPLE.txt",
    "mime": "text/plain",
    "summary": "VALID 100-Char UK BACS Standard 18 • 2 Credits • GBP 5250.00 (Sample Preview)",
    "sample": "name,sortCode,accountNumber,amount,transactionCode,reference\nOLIVER WRIGHT,40-05-15,87654321,3400.00,99,SALARY NOV26\nAMELIA CLARKE,20-32-53,11223344,1850.00,99,SALARY NOV26",
    "output": "VOL1000001                               123456                                1                    \r\nHDR1A123456S  100000100010001       b26320 b26324 000000                                            \r\nUHL1 b26320999999    000000001 DAILY  001                                                           \r\n4005158765432109920000012345678000000340000LONDON TECH UK LTDSALARY NOV26      OLIVER WRIGHT        \r\n2032531122334409920000012345678000000185000LONDON TECH UK LTDSALARY NOV26      AMELIA CLARKE        \r\n2000001234567801720000012345678000000525000PAYROLL           CONTRA            LONDON TECH UK LTD   \r\nUTL100000052500000000052500000000010000002                                                          "
  },
  "cpa005": {
    "label": "🇨🇦 Canada CPA-005 EFT",
    "storeUrl": "https://apify.com/finops_studio/canada-cpa005-eft-generator",
    "actorSlug": "finops_studio~canada-cpa005-eft-generator",
    "fileExt": "CANADA_CPA005_SAMPLE.eft",
    "mime": "text/plain",
    "summary": "VALID 1464-Byte Payments Canada CPA-005 • A/C/Z Records • CAD 3950.00 (Sample Preview)",
    "sample": "name,institution,transit,accountNumber,amount,cpaCode,crossReference\nSOPHIE TREMBLAY,004,10202,7748392,3950.00,200,EMP-CA-204",
    "output": "A000000001GLOBTECHCA002102632000300                    CAD                                                                 (...padded to exact 1,464 bytes)\r\nC000000002GLOBTECHCA002120000003950000263240004102027748392     000000000000000GLOBAL TECH CA SOPHIE TREMBLAY               (...6x240-byte segments = exact 1,464 bytes)\r\nZ000000003GLOBTECHCA00210000000000000000000000000039500000000001                                                           (...padded to exact 1,464 bytes)"
  },
  "pain002": {
    "label": "🔍 ISO pain.002 Decoder",
    "storeUrl": "https://apify.com/finops_studio/iso20022-pain002-status-parser",
    "actorSlug": "finops_studio~iso20022-pain002-status-parser",
    "fileExt": "PAIN002_DECODED_SAMPLE.csv",
    "mime": "text/csv",
    "summary": "DECODED pain.002.001.10 • 1 Accepted, 2 Rejected with Plain-English Fixes",
    "sample": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Document xmlns=\"urn:iso:std:iso:20022:tech:xsd:pain.002.001.10\">\n  <CstmrPmtStsRpt>\n    <GrpHdr>\n      <MsgId>STS-20261112-99201</MsgId>\n      <CreDtTm>2026-11-12T09:15:00Z</CreDtTm>\n      <InitgPty>\n        <Nm>DEUTSCHE BANK AG</Nm>\n      </InitgPty>\n    </GrpHdr>\n    <OrgnlGrpInfAndSts>\n      <OrgnlMsgId>BATCH-2026-NOV-01</OrgnlMsgId>\n      <OrgnlMsgNmId>pain.001.001.09</OrgnlMsgNmId>\n      <GrpSts>PART</GrpSts>\n    </OrgnlGrpInfAndSts>\n    <OrgnlPmtInfAndSts>\n      <OrgnlPmtInfId>PMT-SUPPLIERS-01</OrgnlPmtInfId>\n      <PmtInfSts>PART</PmtInfSts>\n      <TxInfAndSts>\n        <OrgnlInstrId>INSTR-001</OrgnlInstrId>\n        <OrgnlEndToEndId>INV-2026-8801</OrgnlEndToEndId>\n        <TxSts>ACSC</TxSts>\n        <OrgnlTxRef>\n          <Amt><InstdAmt Ccy=\"EUR\">1250.50</InstdAmt></Amt>\n          <RmtInf><Ustrd>Invoice INV-2026-8801</Ustrd></RmtInf>\n          <Cdtr><Nm>Mueller + Soehne KG</Nm></Cdtr>\n          <CdtrAcct><Id><IBAN>DE89370400440532013000</IBAN></Id></CdtrAcct>\n        </OrgnlTxRef>\n      </TxInfAndSts>\n      <TxInfAndSts>\n        <OrgnlInstrId>INSTR-002</OrgnlInstrId>\n        <OrgnlEndToEndId>INV-2026-8802</OrgnlEndToEndId>\n        <TxSts>RJCT</TxSts>\n        <StsRsnInf>\n          <Rsn><Cd>AC04</Cd></Rsn>\n          <AddtlInf>Beneficiary IBAN account closed at receiving bank</AddtlInf>\n        </StsRsnInf>\n        <OrgnlTxRef>\n          <Amt><InstdAmt Ccy=\"EUR\">849.95</InstdAmt></Amt>\n          <RmtInf><Ustrd>Facture 2026-104</Ustrd></RmtInf>\n          <Cdtr><Nm>Elodie Lefevre SARL</Nm></Cdtr>\n          <CdtrAcct><Id><IBAN>FR7630006000011234567890189</IBAN></Id></CdtrAcct>\n        </OrgnlTxRef>\n      </TxInfAndSts>\n      <TxInfAndSts>\n        <OrgnlInstrId>INSTR-003</OrgnlInstrId>\n        <OrgnlEndToEndId>INV-2026-8803</OrgnlEndToEndId>\n        <TxSts>RJCT</TxSts>\n        <StsRsnInf>\n          <Rsn><Cd>BE04</Cd></Rsn>\n          <AddtlInf>2026 EPC Rule: Missing structured creditor TownName and Country</AddtlInf>\n        </StsRsnInf>\n        <OrgnlTxRef>\n          <Amt><InstdAmt Ccy=\"EUR\">3400.00</InstdAmt></Amt>\n          <RmtInf><Ustrd>Consulting Q4</Ustrd></RmtInf>\n          <Cdtr><Nm>Alpine Advisory AG</Nm></Cdtr>\n          <CdtrAcct><Id><IBAN>CH9300762011623852957</IBAN></Id></CdtrAcct>\n        </OrgnlTxRef>\n      </TxInfAndSts>\n    </OrgnlPmtInfAndSts>\n  </CstmrPmtStsRpt>\n</Document>",
    "output": "originalMessageId,batchPaymentInfoId,originalEndToEndId,originalInstructionId,isoStatus,normalizedStatus,reasonCode,reasonTitle,category,amount,currency,counterpartyName,counterpartyIban,remittanceInfo,plainEnglishExplanation,recommendedAction,bankNarrative\r\nBATCH-2026-NOV-01,PMT-SUPPLIERS-01,INV-2026-8801,INSTR-001,ACSC,SETTLED,AC04,Closed Bank Account,ACCOUNT,1250.50,EUR,Mueller + Soehne KG,DE89370400440532013000,Invoice INV-2026-8801,The target bank account has been permanently closed by the account holder or bank.,\"Stop automated retries immediately. Contact the supplier, employee, or customer to request their new bank IBAN/account details.\",Beneficiary IBAN account closed at receiving bank\r\nBATCH-2026-NOV-01,PMT-SUPPLIERS-01,INV-2026-8802,INSTR-002,RJCT,REJECTED,AC04,Closed Bank Account,ACCOUNT,849.95,EUR,Elodie Lefevre SARL,FR7630006000011234567890189,Facture 2026-104,The target bank account has been permanently closed by the account holder or bank.,\"Stop automated retries immediately. Contact the supplier, employee, or customer to request their new bank IBAN/account details.\",Beneficiary IBAN account closed at receiving bank\r\nBATCH-2026-NOV-01,PMT-SUPPLIERS-01,INV-2026-8803,INSTR-003,RJCT,REJECTED,BE04,Missing or Invalid Creditor Postal Address (2026 EPC Structured Address Rule),COMPLIANCE_ADDRESS,3400.00,EUR,Alpine Advisory AG,CH9300762011623852957,Consulting Q4,Mandatory structured postal address fields (<Ctry> and <TwnNm> in pain.001.001.09 / pain.008.001.08) are missing or unstructured.,Upgrade to pain.001.001.09 / pain.008.001.08 and populate structured <PstlAdr><Ctry> and <TwnNm> for the counterparty.,2026 EPC Rule: Missing structured creditor TownName and Country"
  }
};

export function initSandbox(defaultTool = 'sepa') {
  const tabsEl = document.getElementById('tool-tabs');
  const inputEl = document.getElementById('sandbox-input');
  const outputEl = document.getElementById('sandbox-output');
  const statusEl = document.getElementById('sandbox-status');
  const runBtn = document.getElementById('btn-run-preview');
  const dlBtn = document.getElementById('btn-download-preview');
  const storeBtn = document.getElementById('btn-open-store');
  const curlBtn = document.getElementById('btn-copy-curl');
  const upsellEl = document.getElementById('upsell-banner');
  const upsellLink = document.getElementById('upsell-link');

  if (!tabsEl || !inputEl) return;

  let activeKey = TOOLS_CONFIG[defaultTool] ? defaultTool : 'sepa';
  let lastOutput = '';

  function selectTool(key) {
    activeKey = key;
    const cfg = TOOLS_CONFIG[key];
    tabsEl.querySelectorAll('.tab-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.tool === key);
    });
    inputEl.value = cfg.sample;
    outputEl.textContent = cfg.output;
    lastOutput = cfg.output;
    statusEl.className = 'status-chip status-ok';
    statusEl.textContent = cfg.summary;
    storeBtn.href = cfg.storeUrl;
    storeBtn.className = 'btn btn-primary';
    storeBtn.innerHTML = 'Run Unlimited Batch on Cloud API ($0/mo) &rarr;';
    if (upsellLink) upsellLink.href = cfg.storeUrl;
    upsellEl.style.display = 'none';
  }

  function handleRunClick() {
    const cfg = TOOLS_CONFIG[activeKey];
    if (inputEl.value.trim() !== cfg.sample.trim()) {
      upsellEl.style.display = 'flex';
      upsellEl.querySelector('span').innerHTML = '<strong>Custom Data Ready:</strong> Live validation &amp; custom file generation run securely inside our private cloud engine on Apify Store.';
    } else {
      outputEl.textContent = cfg.output;
      statusEl.textContent = cfg.summary;
      upsellEl.style.display = 'flex';
    }
  }

  Object.entries(TOOLS_CONFIG).forEach(([key, cfg]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tab-btn';
    btn.dataset.tool = key;
    btn.textContent = cfg.label;
    btn.addEventListener('click', () => selectTool(key));
    tabsEl.appendChild(btn);
  });

  runBtn?.addEventListener('click', handleRunClick);

  dlBtn?.addEventListener('click', () => {
    if (!lastOutput) return;
    const cfg = TOOLS_CONFIG[activeKey];
    const blob = new Blob([lastOutput], { type: cfg.mime });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = cfg.fileExt;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  curlBtn?.addEventListener('click', async () => {
    const cfg = TOOLS_CONFIG[activeKey];
    const snippet = `curl -X POST "https://api.apify.com/v2/acts/${cfg.actorSlug}/run-sync-get-dataset-items?token=YOUR_APIFY_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{}'`;
    await navigator.clipboard.writeText(snippet);
    const orig = curlBtn.textContent;
    curlBtn.textContent = 'Copied REST API cURL!';
    setTimeout(() => { curlBtn.textContent = orig; }, 1800);
  });

  selectTool(activeKey);
}
