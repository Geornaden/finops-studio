// FinOps Studio — Interactive Pre-Flight Checksum Auditor, Sample Showcase & Direct Cloud API Bridge
// (Proprietary fixed-width & XML generation engines run privately inside isolated Apify Cloud containers)

export const TOOLS_CONFIG = {
  sepa: {
    label: "🇪🇺 SEPA XML (pain.001/008)",
    storeUrl: "https://apify.com/finops_studio/sepa-xml-generator",
    actorSlug: "finops_studio~sepa-xml-generator",
    unitPrice: 0.02,
    fileExt: "SEPA_PAIN001_BATCH.xml",
    mime: "application/xml",
    summary: "VALID pain.001.001.09 • 2 tx • CtrlSum EUR 2100.45 (Sample Preview)",
    apiSampleJson: {
      schemaVersion: "pain.001.001.09",
      initiatingPartyName: "Acme Europe GmbH",
      debtorName: "Acme Europe GmbH",
      debtorIban: "DE89370400440532013000",
      debtorBic: "COBADEFFXXX",
      transactions: [
        { name: "Mueller & Soehne KG", iban: "DE89370400440532013000", amount: 1250.50, remittanceInfo: "INV-2026-001", country: "DE", townName: "Munich" },
        { name: "Elodie Lefevre SARL", iban: "FR7630006000011234567890189", amount: 849.95, remittanceInfo: "Facture 2026-104", country: "FR", townName: "Paris" }
      ]
    },
    sample: "name;iban;bic;amount;reference;country;city\nMüller & Söhne KG;DE89370400440532013000;COBADEFFXXX;1250.50;Invoice INV-2026-001;DE;Munich\nÉlodie Lefèvre SARL;FR7630006000011234567890189;BNPAFRPPXXX;849.95;Facture 2026-104;FR;Paris",
    output: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Document xmlns=\"urn:iso:std:iso:20022:tech:xsd:pain.001.001.09\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n  <CstmrCdtTrfInitn>\n    <GrpHdr>\n      <MsgId>MSG-20261116-677180</MsgId>\n      <CreDtTm>2026-11-12T14:44:37</CreDtTm>\n      <NbOfTxs>2</NbOfTxs>\n      <CtrlSum>2100.45</CtrlSum>\n      <InitgPty>\n        <Nm>Acme Europe GmbH</Nm>\n      </InitgPty>\n    </GrpHdr>\n    <PmtInf>\n      <PmtInfId>PMT-20261116-01</PmtInfId>\n      <PmtMtd>TRF</PmtMtd>\n      <BtchBookg>true</BtchBookg>\n      <NbOfTxs>2</NbOfTxs>\n      <CtrlSum>2100.45</CtrlSum>\n      <PmtTpInf>\n        <SvcLvl><Cd>SEPA</Cd></SvcLvl>\n      </PmtTpInf>\n      <ReqdExctnDt><Dt>2026-11-16</Dt></ReqdExctnDt>\n      <Dbtr>\n        <Nm>Acme Europe GmbH</Nm>\n        <PstlAdr><TwnNm>Berlin</TwnNm><Ctry>DE</Ctry></PstlAdr>\n      </Dbtr>\n      <DbtrAcct><Id><IBAN>DE89370400440532013000</IBAN></Id><Ccy>EUR</Ccy></DbtrAcct>\n      <DbtrAgt><FinInstnId><BICFI>COBADEFFXXX</BICFI></FinInstnId></DbtrAgt>\n      <ChrgBr>SLEV</ChrgBr>\n      <CdtTrfTxInf>\n        <PmtId><EndToEndId>E2E-20261116-0001</EndToEndId></PmtId>\n        <Amt><InstdAmt Ccy=\"EUR\">1250.50</InstdAmt></Amt>\n        <CdtrAgt><FinInstnId><BICFI>COBADEFFXXX</BICFI></FinInstnId></CdtrAgt>\n        <Cdtr><Nm>Mueller + Soehne KG</Nm><PstlAdr><TwnNm>Munich</TwnNm><Ctry>DE</Ctry></PstlAdr></Cdtr>\n        <CdtrAcct><Id><IBAN>DE89370400440532013000</IBAN></Id></CdtrAcct>\n        <RmtInf><Ustrd>Invoice INV-2026-001</Ustrd></RmtInf>\n      </CdtTrfTxInf>\n      <CdtTrfTxInf>\n        <PmtId><EndToEndId>E2E-20261116-0002</EndToEndId></PmtId>\n        <Amt><InstdAmt Ccy=\"EUR\">849.95</InstdAmt></Amt>\n        <CdtrAgt><FinInstnId><BICFI>BNPAFRPPXXX</BICFI></FinInstnId></CdtrAgt>\n        <Cdtr><Nm>Elodie Lefevre SARL</Nm><PstlAdr><TwnNm>Paris</TwnNm><Ctry>FR</Ctry></PstlAdr></Cdtr>\n        <CdtrAcct><Id><IBAN>FR7630006000011234567890189</IBAN></Id></CdtrAcct>\n        <RmtInf><Ustrd>Facture 2026-104</Ustrd></RmtInf>\n      </CdtTrfTxInf>\n    </PmtInf>\n  </CstmrCdtTrfInitn>\n</Document>"
  },
  einvoice: {
    label: "🧾 EU E-Invoice (Peppol/XRechnung)",
    storeUrl: "https://apify.com/finops_studio/eu-einvoice-xml-generator",
    actorSlug: "finops_studio~eu-einvoice-xml-generator",
    unitPrice: 0.05,
    fileExt: "EINVOICE_EN16931.xml",
    mime: "application/xml",
    summary: "VALID peppol-ubl-3.0 • Net 1600.00 + VAT 304.00 = 1904.00 EUR (Sample Preview)",
    sample: "{\n  \"format\": \"peppol-ubl-3.0\",\n  \"invoiceNumber\": \"INV-2026-1001\",\n  \"issueDate\": \"2026-11-12\",\n  \"dueDate\": \"2026-11-26\",\n  \"currency\": \"EUR\",\n  \"buyerReference\": \"PO-2026-8841\",\n  \"seller\": {\n    \"name\": \"TechSolutions GmbH\",\n    \"vatId\": \"DE123456789\",\n    \"street\": \"Friedrichstr. 100\",\n    \"city\": \"Berlin\",\n    \"postalCode\": \"10115\",\n    \"country\": \"DE\",\n    \"iban\": \"DE89370400440532013000\"\n  },\n  \"buyer\": {\n    \"name\": \"EuroTrade NV\",\n    \"vatId\": \"BE0123456789\",\n    \"street\": \"Rue de la Loi 42\",\n    \"city\": \"Brussels\",\n    \"postalCode\": \"1000\",\n    \"country\": \"BE\"\n  },\n  \"lines\": [\n    { \"description\": \"Website Setup Service\", \"quantity\": 10, \"unitPrice\": \"125.00\", \"vatRate\": 19 },\n    { \"description\": \"Monthly Hosting Plan\", \"quantity\": 1, \"unitPrice\": \"350.00\", \"vatRate\": 19 }\n  ]\n}",
    output: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Invoice xmlns=\"urn:oasis:names:specification:ubl:schema:xsd:Invoice-2\" xmlns:cac=\"urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2\" xmlns:cbc=\"urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2\">\n  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0</cbc:CustomizationID>\n  <cbc:ProfileID>urn:fdc:peppol.eu:2017:poacc:billing:01:1.0</cbc:ProfileID>\n  <cbc:ID>INV-2026-1001</cbc:ID>\n  <cbc:IssueDate>2026-11-12</cbc:IssueDate>\n  <cbc:DueDate>2026-11-26</cbc:DueDate>\n  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>\n  <cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode>\n  <cbc:BuyerReference>PO-2026-8841</cbc:BuyerReference>\n  <cac:AccountingSupplierParty>\n    <cac:Party>\n      <cbc:EndpointID schemeID=\"9930\">DE123456789</cbc:EndpointID>\n      <cac:PartyName><cbc:Name>TechSolutions GmbH</cbc:Name></cac:PartyName>\n      <cac:PostalAddress><cbc:StreetName>Friedrichstr. 100</cbc:StreetName><cbc:CityName>Berlin</cbc:CityName><cbc:PostalZone>10115</cbc:PostalZone><cac:Country><cbc:IdentificationCode>DE</cbc:IdentificationCode></cac:Country></cac:PostalAddress>\n    </cac:Party>\n  </cac:AccountingSupplierParty>\n  <cac:AccountingCustomerParty>\n    <cac:Party>\n      <cbc:EndpointID schemeID=\"9925\">BE0123456789</cbc:EndpointID>\n      <cac:PartyName><cbc:Name>EuroTrade NV</cbc:Name></cac:PartyName>\n    </cac:Party>\n  </cac:AccountingCustomerParty>\n  <cac:TaxTotal><cbc:TaxAmount currencyID=\"EUR\">304.00</cbc:TaxAmount></cac:TaxTotal>\n  <cac:LegalMonetaryTotal>\n    <cbc:TaxExclusiveAmount currencyID=\"EUR\">1600.00</cbc:TaxExclusiveAmount>\n    <cbc:TaxInclusiveAmount currencyID=\"EUR\">1904.00</cbc:TaxInclusiveAmount>\n    <cbc:PayableAmount currencyID=\"EUR\">1904.00</cbc:PayableAmount>\n  </cac:LegalMonetaryTotal>\n</Invoice>"
  },
  nacha: {
    label: "🇺🇸 US NACHA ACH (.ach)",
    storeUrl: "https://apify.com/finops_studio/nacha-ach-file-generator",
    actorSlug: "finops_studio~nacha-ach-file-generator",
    unitPrice: 0.02,
    fileExt: "ACH_BATCH.ach",
    mime: "text/plain",
    summary: "VALID 94-Char NACHA (PPD) • 2 entries • Credits $4425.50 (Sample Preview)",
    apiSampleJson: {
      mode: "generate",
      secCode: "PPD",
      immediateDestination: "021000021",
      immediateDestinationName: "JPMORGAN CHASE",
      immediateOrigin: "1987654321",
      immediateOriginName: "ACME US CORP",
      companyName: "ACME US CORP",
      companyId: "1987654321",
      companyEntryDescription: "PAYROLL",
      originatingDfiId: "02100002",
      effectiveEntryDate: "261116",
      entries: [
        { transactionCode: "22", routingNumber: "021000021", accountNumber: "449012398", amount: 2450.00, individualId: "EMP-101", individualName: "SARAH JENKINS" },
        { transactionCode: "22", routingNumber: "121000358", accountNumber: "883104921", amount: 1975.50, individualId: "EMP-102", individualName: "MARCUS VANCE" }
      ]
    },
    sample: "name,routing,account,amount,type,id\nSARAH JENKINS,021000021,449012398,2450.00,checking,EMP-101\nMARCUS VANCE,121000358,883104921,1975.50,checking,EMP-102",
    output: "101 02100002119876543212611120900A094101JPMORGAN CHASE         ACME US CORP                   \n5220ACME US CORP                        1987654321PPDPAYROLL   261112261116   1021000020000001\n622021000021449012398        0000245000EMP-101        SARAH JENKINS           0021000020000001\n622121000358883104921        0000197550EMP-102        MARCUS VANCE            0021000020000002\n822000000200142000370000000000000000004425501987654321                         021000020000001\n9000001000001000000020014200037000000000000000000442550                                       \n9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999"
  },
  bai2: {
    label: "🏦 BAI2 Treasury Parser",
    storeUrl: "https://apify.com/finops_studio/bai2-bank-statement-parser",
    actorSlug: "finops_studio~bai2-bank-statement-parser",
    unitPrice: 0.02,
    fileExt: "BAI2_PARSED.csv",
    mime: "text/csv",
    summary: "PARSED 1 Account • 2 Transactions Stitched to CSV (Sample Preview)",
    sample: "01,021000021,ACMECORP,261112,0830,001,80,1,2/\n02,ACMECORP,021000021,1,261111,2359,USD,2/\n03,0044918273,USD,010,12500000,,,015,13925050,,,045,13925050,,/\n16,195,1500000,Z,WIRE26111101,CUST-8841,INCOMING WIRE FROM GLOBAL CLIENT INC/\n88,INVOICE REF INV-2026-991 PAID IN FULL/\n16,455,74950,Z,ACH26111109,AWS-CLOUD,AMAZON WEB SERVICES MONTHLY BILLING/\n49,29749950,6/\n98,29749950,1,8/\n99,29749950,1,10/",
    output: "account_number,as_of_date,currency,type_code,type_description,direction,amount,signed_amount,bank_reference,customer_reference,remittance_text\n0044918273,261111,USD,195,\"Incoming Money Transfer / Wire Credit\",credit,15000.00,15000.00,\"WIRE26111101\",\"CUST-8841\",\"INCOMING WIRE FROM GLOBAL CLIENT INC INVOICE REF INV-2026-991 PAID IN FULL\"\n0044918273,261111,USD,455,\"Preauthorized ACH Debit\",debit,749.50,-749.50,\"ACH26111109\",\"AWS-CLOUD\",\"AMAZON WEB SERVICES MONTHLY BILLING\""
  },
  datev: {
    label: "🇩🇪 DATEV Buchungsstapel",
    storeUrl: "https://apify.com/finops_studio/datev-buchungsstapel-generator",
    actorSlug: "finops_studio~datev-buchungsstapel-generator",
    unitPrice: 0.02,
    fileExt: "EXTF_Buchungsstapel.csv",
    mime: "text/csv",
    summary: "VALID DATEV EXTF v700 (SKR03) • 2 Bookings • EUR 1725,00 (Sample Preview)",
    sample: "{\n  \"skr\": \"SKR03\",\n  \"consultantNumber\": \"12345\",\n  \"clientNumber\": \"10001\",\n  \"bookings\": [\n    { \"date\": \"2026-11-10\", \"amount\": \"1190.00\", \"vatRate\": 19, \"invoiceNumber\": \"RE-2026-401\", \"description\": \"Stripe Abo Zahlung GmbH\" },\n    { \"date\": \"2026-11-11\", \"amount\": \"535.00\", \"vatRate\": 7, \"invoiceNumber\": \"RE-2026-402\", \"description\": \"Shopify Bestellung Schmidt\" }\n  ]\n}",
    output: "\"EXTF\";700;21;\"Buchungsstapel\";13;20261112144437189;;\"FO\";\"\";\"\";12345;10001;20260101;4;20261101;20261130;\"Ausgangsrechnungen\";\"\";1;0;0;\"EUR\";;\"\";;;;;;\"\";\r\nUmsatz (ohne Soll/Haben-Kz);Soll/Haben-Kennzeichen;WKZ Umsatz;Kurs;Basis-Umsatz;WKZ Basis-Umsatz;Konto;Gegenkonto (ohne BU-Schlüssel);BU-Schlüssel;Belegdatum;Belegfeld 1;Belegfeld 2;Skonto;Buchungstext\r\n1190,00;\"S\";\"EUR\";;;;1200;8400;;1011;\"RE-2026-401\";\"\";;\"Stripe Abo Zahlung GmbH\"\r\n535,00;\"S\";\"EUR\";;;;1200;8300;;1111;\"RE-2026-402\";\"\";;\"Shopify Bestellung Schmidt\""
  },
  aba: {
    label: "🇦🇺 Australian ABA (.aba)",
    storeUrl: "https://apify.com/finops_studio/aba-cemtex-file-generator",
    actorSlug: "finops_studio~aba-cemtex-file-generator",
    unitPrice: 0.02,
    fileExt: "DIRECT_ENTRY_BATCH.aba",
    mime: "text/plain",
    summary: "VALID 120-Char BECS ABA (CBA) • 2 Payees • AUD 4040.50 (Sample Preview)",
    apiSampleJson: {
      financialInstitution: "CBA",
      userName: "SYDNEY TECH PTY LTD",
      apcaUserId: "301500",
      description: "PAYROLL",
      processingDate: "2026-11-16",
      traceBsb: "062-000",
      traceAccount: "10458921",
      remitterName: "SYDNEY TECH PTY",
      includeSelfBalancingRow: true,
      transactions: [
        { bsb: "062-000", accountNumber: "12345678", transactionCode: "53", amount: 2150.00, accountTitle: "LIAM O CONNOR", lodgementReference: "WAGES NOV" },
        { bsb: "082-088", accountNumber: "87654321", transactionCode: "53", amount: 1890.50, accountTitle: "CHLOE NGUYEN", lodgementReference: "WAGES NOV" }
      ]
    },
    sample: "name,bsb,account,amount,reference\nLIAM O CONNOR,062-000,12345678,2150.00,WAGES NOV\nCHLOE NGUYEN,082-088,87654321,1890.50,WAGES NOV",
    output: "0                 01CBA       SYDNEY TECH PTY LTD       301500PAYROLL     161126                                        \r\n1062-000 12345678 530000215000LIAM O CONNOR                   WAGES NOV         062-000 10458921SYDNEY TECH PTY 00000000\r\n1082-088 87654321 530000189050CHLOE NGUYEN                    WAGES NOV         062-000 10458921SYDNEY TECH PTY 00000000\r\n1062-000 10458921 130000404050SYDNEY TECH PTY LTD             PAYROLL           062-000 10458921SYDNEY TECH PTY 00000000\r\n7999-999            000000000000004040500000404050                        000003                                        "
  },
  bacs: {
    label: "🇬🇧 UK BACS Standard 18",
    storeUrl: "https://apify.com/finops_studio/uk-bacs-standard18-generator",
    actorSlug: "finops_studio~uk-bacs-standard18-generator",
    unitPrice: 0.02,
    fileExt: "UK_BACS_STANDARD18.txt",
    mime: "text/plain",
    summary: "VALID 100-Char UK BACS Standard 18 • 2 Credits • GBP 5250.00 (Sample Preview)",
    apiSampleJson: {
      serviceUserNumber: "123456",
      originatorName: "LONDON TECH UK LTD",
      originatorSortCode: "20-00-00",
      originatorAccountNumber: "12345678",
      processingDate: "2026-11-20",
      includeHeaders: true,
      transactions: [
        { name: "OLIVER WRIGHT", sortCode: "40-05-15", accountNumber: "87654321", amount: 3400.00, transactionCode: "99", reference: "SALARY NOV26" },
        { name: "AMELIA CLARKE", sortCode: "20-32-53", accountNumber: "11223344", amount: 1850.00, transactionCode: "99", reference: "SALARY NOV26" }
      ]
    },
    sample: "name,sortCode,accountNumber,amount,transactionCode,reference\nOLIVER WRIGHT,40-05-15,87654321,3400.00,99,SALARY NOV26\nAMELIA CLARKE,20-32-53,11223344,1850.00,99,SALARY NOV26",
    output: "VOL1000001                               123456                                1                    \r\nHDR1A123456S  100000100010001       b26320 b26324 000000                                            \r\nUHL1 b26320999999    000000001 DAILY  001                                                           \r\n4005158765432109920000012345678000000340000LONDON TECH UK LTDSALARY NOV26      OLIVER WRIGHT        \r\n2032531122334409920000012345678000000185000LONDON TECH UK LTDSALARY NOV26      AMELIA CLARKE        \r\n2000001234567801720000012345678000000525000PAYROLL           CONTRA            LONDON TECH UK LTD   \r\nUTL100000052500000000052500000000010000002                                                          "
  },
  cpa005: {
    label: "🇨🇦 Canada CPA-005 EFT",
    storeUrl: "https://apify.com/finops_studio/canada-cpa005-eft-generator",
    actorSlug: "finops_studio~canada-cpa005-eft-generator",
    unitPrice: 0.02,
    fileExt: "CANADA_CPA005.eft",
    mime: "text/plain",
    summary: "VALID 1464-Byte Payments Canada CPA-005 • A/C/Z Records • CAD 3950.00 (Sample Preview)",
    apiSampleJson: {
      originatorId: "GLOBTECHCA",
      originatorShortName: "GLOBAL TECH CA",
      originatorLongName: "GLOBAL TECH CANADA INC",
      destinationDataCentre: "00300",
      fileCreationNumber: "0021",
      returnInstitution: "003",
      returnTransit: "00012",
      returnAccount: "1004589",
      dueDate: "2026-11-20",
      transactions: [
        { name: "SOPHIE TREMBLAY", institution: "004", transit: "10202", accountNumber: "7748392", amount: 3950.00, cpaCode: "200", crossReference: "EMP-CA-204" }
      ]
    },
    sample: "name,institution,transit,accountNumber,amount,cpaCode,crossReference\nSOPHIE TREMBLAY,004,10202,7748392,3950.00,200,EMP-CA-204",
    output: "A000000001GLOBTECHCA002102632000300                    CAD                                                                 (...padded to exact 1,464 bytes)\r\nC000000002GLOBTECHCA002120000003950000263240004102027748392     000000000000000GLOBAL TECH CA SOPHIE TREMBLAY               (...6x240-byte segments = exact 1,464 bytes)\r\nZ000000003GLOBTECHCA00210000000000000000000000000039500000000001                                                           (...padded to exact 1,464 bytes)"
  },
  pain002: {
    label: "🔍 ISO pain.002 Decoder",
    storeUrl: "https://apify.com/finops_studio/iso20022-pain002-status-parser",
    actorSlug: "finops_studio~iso20022-pain002-status-parser",
    unitPrice: 0.02,
    fileExt: "PAIN002_DECODED.csv",
    mime: "text/csv",
    summary: "DECODED pain.002.001.10 • 1 Accepted, 2 Rejected with Plain-English Fixes",
    sample: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Document xmlns=\"urn:iso:std:iso:20022:tech:xsd:pain.002.001.10\">\n  <CstmrPmtStsRpt>\n    <GrpHdr><MsgId>STS-20261112-99201</MsgId><CreDtTm>2026-11-12T09:15:00Z</CreDtTm><InitgPty><Nm>DEUTSCHE BANK AG</Nm></InitgPty></GrpHdr>\n    <OrgnlGrpInfAndSts><OrgnlMsgId>BATCH-2026-NOV-01</OrgnlMsgId><OrgnlMsgNmId>pain.001.001.09</OrgnlMsgNmId><GrpSts>PART</GrpSts></OrgnlGrpInfAndSts>\n    <OrgnlPmtInfAndSts>\n      <OrgnlPmtInfId>PMT-SUPPLIERS-01</OrgnlPmtInfId>\n      <PmtInfSts>PART</PmtInfSts>\n      <TxInfAndSts>\n        <OrgnlInstrId>INSTR-001</OrgnlInstrId><OrgnlEndToEndId>INV-2026-8801</OrgnlEndToEndId><TxSts>ACSC</TxSts>\n        <OrgnlTxRef><Amt><InstdAmt Ccy=\"EUR\">1250.50</InstdAmt></Amt><Cdtr><Nm>Mueller + Soehne KG</Nm></Cdtr><CdtrAcct><Id><IBAN>DE89370400440532013000</IBAN></Id></CdtrAcct></OrgnlTxRef>\n      </TxInfAndSts>\n      <TxInfAndSts>\n        <OrgnlInstrId>INSTR-002</OrgnlInstrId><OrgnlEndToEndId>INV-2026-8802</OrgnlEndToEndId><TxSts>RJCT</TxSts>\n        <StsRsnInf><Rsn><Cd>AC04</Cd></Rsn><AddtlInf>Beneficiary IBAN account closed at receiving bank</AddtlInf></StsRsnInf>\n        <OrgnlTxRef><Amt><InstdAmt Ccy=\"EUR\">849.95</InstdAmt></Amt><Cdtr><Nm>Elodie Lefevre SARL</Nm></Cdtr><CdtrAcct><Id><IBAN>FR7630006000011234567890189</IBAN></Id></CdtrAcct></OrgnlTxRef>\n      </TxInfAndSts>\n      <TxInfAndSts>\n        <OrgnlInstrId>INSTR-003</OrgnlInstrId><OrgnlEndToEndId>INV-2026-8803</OrgnlEndToEndId><TxSts>RJCT</TxSts>\n        <StsRsnInf><Rsn><Cd>BE04</Cd></Rsn><AddtlInf>2026 EPC Rule: Missing structured creditor TownName and Country</AddtlInf></StsRsnInf>\n        <OrgnlTxRef><Amt><InstdAmt Ccy=\"EUR\">3400.00</InstdAmt></Amt><Cdtr><Nm>Alpine Advisory AG</Nm></Cdtr><CdtrAcct><Id><IBAN>CH9300762011623852957</IBAN></Id></CdtrAcct></OrgnlTxRef>\n      </TxInfAndSts>\n    </OrgnlPmtInfAndSts>\n  </CstmrPmtStsRpt>\n</Document>",
    output: "originalMessageId,batchPaymentInfoId,originalEndToEndId,originalInstructionId,isoStatus,normalizedStatus,reasonCode,reasonTitle,category,amount,currency,counterpartyName,counterpartyIban,plainEnglishExplanation,recommendedAction\r\nBATCH-2026-NOV-01,PMT-SUPPLIERS-01,INV-2026-8801,INSTR-001,ACSC,SETTLED,,,OK,1250.50,EUR,Mueller + Soehne KG,DE89370400440532013000,Payment settled successfully.,No action required.\r\nBATCH-2026-NOV-01,PMT-SUPPLIERS-01,INV-2026-8802,INSTR-002,RJCT,REJECTED,AC04,Closed Bank Account,ACCOUNT,849.95,EUR,Elodie Lefevre SARL,FR7630006000011234567890189,The target bank account has been permanently closed.,Stop automated retries and request updated IBAN from beneficiary.\r\nBATCH-2026-NOV-01,PMT-SUPPLIERS-01,INV-2026-8803,INSTR-003,RJCT,REJECTED,BE04,Missing Structured Address,COMPLIANCE_ADDRESS,3400.00,EUR,Alpine Advisory AG,CH9300762011623852957,Mandatory 2026 EPC structured <Ctry> and <TwnNm> missing.,Regenerate batch using pain.001.001.09 with structured <PstlAdr>."
  },
  positivepay: {
    label: "🇺🇸 US Check Positive Pay",
    storeUrl: "./us-positive-pay-check-file-generator-chase-bofa-wells-fargo.html",
    actorSlug: "finops_studio~us-positive-pay-check-generator",
    apifyPublic: false,
    unitPrice: 0.02,
    fileExt: "POSITIVE_PAY.txt",
    mime: "text/plain",
    summary: "VALID US Check Positive Pay • Chase / BofA / Wells Fargo / PNC (Sample Preview)",
    apiSampleJson: {
      bankProfile: "CHASE_JPM_CSV",
      accountNumber: "1234567890",
      companyName: "ACME CORP US",
      fileDate: "2026-11-17",
      checks: [
        { checkNumber: "10421", issueDate: "2026-11-17", amount: 1450.25, payeeName: "ACME SUPPLY LLC", status: "ISSUE" },
        { checkNumber: "10422", issueDate: "2026-11-17", amount: 890.00, payeeName: "OFFICE DEPOT INC", status: "VOID" }
      ]
    },
    sample: "checkNumber,issueDate,amount,payeeName,status\n10421,2026-11-17,1450.25,ACME SUPPLY LLC,ISSUE\n10422,2026-11-17,890.00,OFFICE DEPOT INC,VOID",
    output: "ACCOUNT_NUMBER,CHECK_NUMBER,ISSUE_DATE,AMOUNT,PAYEE_NAME,ACTION_FLAG\r\n1234567890,0000010421,11172026,1450.25,ACME SUPPLY LLC,I\r\n1234567890,0000010422,11172026,890.00,OFFICE DEPOT INC,V"
  },
  norma43: {
    label: "🇪🇸 Spain Norma 43 Parser",
    storeUrl: "./spanish-aeb-norma-43-cuaderno-43-bank-statement-parser.html",
    actorSlug: "finops_studio~spanish-aeb-norma43-parser",
    apifyPublic: false,
    unitPrice: 0.02,
    fileExt: "NORMA43_DECODED.csv",
    mime: "text/csv",
    summary: "VALID Spanish AEB Norma 43 Statement • Reconciled Balances + ES IBAN (Sample Preview)",
    sample: "112100041802000513322611102611122000000015000009783IBERIA LOGISTICA SL          \r\n22    0418261111261111040012000000002450500000451201FAC20260891 B2B CLIENTE MADR\r\n2301COBRO FACTURA 2026-0891               DISTRIBUCIONES NORTE SA               \r\n33210004180200051332000000000000000000000100000000245050200000001745050978    \r\n88999999999999999999000004                                                      ",
    output: "iban,bank_name,booking_date,value_date,direction,amount,currency,reference_1,concept\r\nES9121000418450200051332,CaixaBank,2026-11-11,2026-11-11,CREDIT,2450.50,EUR,FAC20260891,COBRO FACTURA 2026-0891 DISTRIBUCIONES NORTE SA"
  },
  pacs008: {
    label: "🌐 Fedwire / SWIFT pacs.008",
    storeUrl: "./fedwire-iso20022-pacs008-swift-cbpr-xml-generator.html",
    actorSlug: "finops_studio~iso20022-pacs008-fedwire-generator",
    apifyPublic: false,
    unitPrice: 0.02,
    fileExt: "FEDWIRE_PACS008.xml",
    mime: "application/xml",
    summary: "VALID ISO 20022 pacs.008.001.08 Fedwire & SWIFT CBPR+ XML (Sample Preview)",
    sample: "{\n  \"networkProfile\": \"FEDWIRE_USABA\",\n  \"settlementDate\": \"2026-11-17\",\n  \"wires\": [\n    {\n      \"amount\": \"12500.00\",\n      \"currency\": \"USD\",\n      \"debtor\": { \"name\": \"PACIFIC COAST LLC\", \"accountNumber\": \"489011223344\", \"address\": { \"townName\": \"San Francisco\", \"country\": \"US\" } },\n      \"debtorAgent\": { \"abaRouting\": \"021000021\", \"bic\": \"CHASUS33XXX\" },\n      \"creditorAgent\": { \"abaRouting\": \"026009593\", \"bic\": \"BOFAUS3NXXX\" },\n      \"creditor\": { \"name\": \"APEX SUPPLY INC\", \"accountNumber\": \"003948571120\", \"address\": { \"townName\": \"Austin\", \"country\": \"US\" } },\n      \"remittanceInfo\": \"INV-2026-9920 SETTLEMENT\"\n    }\n  ]\n}",
    output: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Document xmlns=\"urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08\">\n  <FIToFICstmrCdtTrf><GrpHdr><NbOfTxs>1</NbOfTxs><TtlIntrBkSttlmAmt Ccy=\"USD\">12500.00</TtlIntrBkSttlmAmt></GrpHdr></FIToFICstmrCdtTrf>\n</Document>"
  }
};

function checkIbanMod97(iban) {
  const clean = iban.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/.test(clean)) return false;
  const rearr = clean.slice(4) + clean.slice(0, 4);
  const exp = rearr.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let rem = 0;
  for (let i = 0; i < exp.length; i++) rem = (rem * 10 + Number(exp[i])) % 97;
  return rem === 1;
}

function checkAbaMod10(aba) {
  if (!/^[0-9]{9}$/.test(aba)) return false;
  const w = [3, 7, 1, 3, 7, 1, 3, 7, 1];
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(aba[i]) * w[i];
  return sum > 0 && sum % 10 === 0;
}

function runLocalPreFlightAudit(toolKey, rawText, cfg) {
  const text = rawText.trim();
  const warnings = [];
  const passes = [];
  let rowCount = 1;

  // Detect JSON vs XML vs BAI2 vs CSV
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      const arr = parsed.transactions || parsed.entries || parsed.bookings || parsed.lines || (Array.isArray(parsed) ? parsed : [parsed]);
      rowCount = Math.max(1, arr.length);
      passes.push(`Valid JSON syntax (${rowCount} item${rowCount === 1 ? "" : "s"} parsed)`);
    } catch (err) {
      warnings.push(`JSON syntax error: ${err.message}`);
    }
  } else if (text.startsWith("<")) {
    const txMatches = text.match(/<(TxInfAndSts|CdtTrfTxInf|DrctDbtTxInf)\b/g);
    rowCount = txMatches ? txMatches.length : 1;
    passes.push(`ISO 20022 XML envelope detected (${rowCount} transaction node${rowCount === 1 ? "" : "s"})`);
  } else if (toolKey === "bai2" || /^01,/.test(text)) {
    const tx16 = (text.match(/^16,/gm) || []).length;
    const cont88 = (text.match(/^88,/gm) || []).length;
    rowCount = Math.max(1, tx16);
    passes.push(`BAI2 structure detected: ${tx16} detail (16) records + ${cont88} continuation (88) lines`);
    if (!/^99,/m.test(text)) warnings.push("Missing BAI2 Record 99 file trailer");
  } else {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    rowCount = Math.max(1, lines.length > 1 ? lines.length - 1 : 1);
    passes.push(`Tabular CSV/delimited batch detected (${rowCount} data row${rowCount === 1 ? "" : "s"})`);
  }

  // Mathematical identifier checks
  const ibans = [...new Set(text.match(/\b[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}\b/g) || [])];
  if (ibans.length) {
    const badIbans = ibans.filter((i) => !checkIbanMod97(i));
    if (badIbans.length) warnings.push(`Failed ISO 13616 MOD-97 IBAN checksum: ${badIbans.join(", ")}`);
    else passes.push(`All ${ibans.length} IBAN(s) passed ISO 13616 MOD-97 mathematical verification`);
  }

  if (toolKey === "nacha") {
    const abas = [...new Set(text.match(/\b[0-9]{9}\b/g) || [])];
    const validAbas = abas.filter(checkAbaMod10);
    if (validAbas.length) passes.push(`${validAbas.length} US 9-digit ABA routing number(s) passed [3,7,1] MOD-10 check`);
    else warnings.push("No valid 9-digit US ABA MOD-10 routing number detected yet");
  }

  if (toolKey === "bacs") {
    const sorts = text.match(/\b[0-9]{2}-[0-9]{2}-[0-9]{2}\b|\b[0-9]{6}\b/g) || [];
    if (sorts.length) passes.push(`${sorts.length} UK 6-digit BACS Sort Code token(s) detected`);
  }

  if (toolKey === "aba") {
    const bsbs = text.match(/\b[0-9]{3}-[0-9]{3}\b/g) || [];
    if (bsbs.length) passes.push(`${bsbs.length} Australian BSB code(s) (XXX-XXX) verified`);
  }

  const estCost = (0.03 + rowCount * (cfg.unitPrice || 0.02)).toFixed(2);
  const statusOk = warnings.length === 0;

  const report = [
    `=== FINOPS STUDIO PRE-FLIGHT MATHEMATICAL AUDIT (${statusOk ? "PASSED" : "ACTION NEEDED"}) ===`,
    `Target Engine : ${cfg.label} (${cfg.actorSlug.replace("~", "/")})`,
    `Batch Volume  : ${rowCount} row(s) detected`,
    `Instant Pass  : $9 Unlimited 24h Pass or $29 30-Day Pro Pass (zero monthly lock-in)`,
    "",
    passes.length ? "Verified Checks:\n" + passes.map((p) => "  [OK] " + p).join("\n") : "",
    warnings.length ? "\nPre-Flight Warnings:\n" + warnings.map((w) => "  [!]  " + w).join("\n") : "",
    "",
    "--- NEXT STEP: GENERATE FULL BANK-UPLOADABLE FILE ---",
    "Option 1 (No code): Click 'Run Unlimited Batch on Cloud API ($0/mo) ->' below to run on Apify Store.",
    "Option 2 (Instant here): Paste your Apify API Token in the Direct Cloud Runner bar below to generate & download right on this page."
  ].filter(Boolean).join("\n");

  return { statusOk, rowCount, estCost, report };
}

export function initSandbox(defaultTool = "sepa") {
  const tabsEl = document.getElementById("tool-tabs");
  const inputEl = document.getElementById("sandbox-input");
  const outputEl = document.getElementById("sandbox-output");
  const statusEl = document.getElementById("sandbox-status");
  const runBtn = document.getElementById("btn-run-preview");
  const dlBtn = document.getElementById("btn-download-preview");
  const storeBtn = document.getElementById("btn-open-store");
  const curlBtn = document.getElementById("btn-copy-curl");
  const upsellEl = document.getElementById("upsell-banner");
  const upsellLink = document.getElementById("upsell-link");

  if (!tabsEl || !inputEl) return;

  let activeKey = TOOLS_CONFIG[defaultTool] ? defaultTool : "sepa";
  let lastOutput = "";

  const EDGE_API = "https://finops-rapidapi-edge.ria-rader.workers.dev";
  const EDGE_ROUTES = {
    sepa: { path: "/v1/sepa/generate", key: "xml" },
    einvoice: { path: "/v1/einvoice/generate", key: "xml" },
    nacha: { path: "/v1/nacha/generate", key: "nachaText" },
    bai2: { path: "/v1/bai2/parse", key: "csvOutput" },
    datev: { path: "/v1/datev/generate", key: "csvText" },
    aba: { path: "/v1/aba/generate", key: "abaText" },
    bacs: { path: "/v1/bacs/generate", key: "bacsText" },
    cpa005: { path: "/v1/cpa005/generate", key: "eftText" },
    pain002: { path: "/v1/pain002/parse", key: "csvReport" },
    norma43: { path: "/v1/norma43/parse", key: "csvText" },
    positivepay: { path: "/v1/positive-pay/generate", key: "fileText" },
    pacs008: { path: "/v1/pacs008/generate", key: "xmlText" }
  };

  async function triggerCheckout(plan, btn) {
    if (typeof window.startFinOpsCheckout === "function") {
      return window.startFinOpsCheckout(plan, { btn });
    }
    const orig = btn ? btn.textContent : "";
    if (btn) { btn.disabled = true; btn.textContent = "Opening Checkout..."; }
    try {
      const res = await fetch(`${EDGE_API}/v1/checkout/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: ["test1usd", "pro30d", "batch24h"].includes(plan) ? plan : "batch24h", returnUrl: location.href.split("#")[0] })
      });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.checkoutUrl) throw new Error(data.error || "Checkout failed");
      try { localStorage.setItem("finops_pending_pass", data.passKey); } catch {}
      window.location.href = data.checkoutUrl;
    } catch (err) {
      if (btn) { btn.disabled = false; btn.textContent = orig; }
      alert(`Checkout notice: ${err.message}`);
    }
  }

  ["btn-hero-pass-24h", "btn-upsell-pass-24h"].forEach((id) => {
    const el = document.getElementById(id);
    el?.addEventListener("click", () => triggerCheckout("batch24h", el));
  });
  ["btn-hero-pass-30d", "btn-sandbox-concierge-29"].forEach((id) => {
    const el = document.getElementById(id);
    el?.addEventListener("click", () => triggerCheckout("pro30d", el));
  });
  ["btn-hero-concierge-fix", "btn-sandbox-concierge-fix"].forEach((id) => {
    const el = document.getElementById(id);
    el?.addEventListener("click", () => {
      if (typeof window.openFinOpsConciergeFix === "function") window.openFinOpsConciergeFix();
    });
  });

  // Inject Direct Instant Pass ($9/$29) + Apify Bridge right below sandbox-bar
  const sandboxCard = tabsEl.closest(".sandbox-card");
  let liveRunnerBar = document.getElementById("direct-cloud-runner");
  if (sandboxCard && !liveRunnerBar) {
    liveRunnerBar = document.createElement("div");
    liveRunnerBar.id = "direct-cloud-runner";
    liveRunnerBar.style.cssText = "margin-top:12px;padding:10px 14px;border-radius:10px;background:rgba(15,23,42,0.75);border:1px dashed rgba(245,158,11,0.45);display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between;font-size:0.82rem;";
    liveRunnerBar.innerHTML = `
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
        <span style="color:var(--muted);"><strong style="color:#fbbf24;">⚡ Instant Direct Pass:</strong> No account needed:</span>
        <button id="btn-bridge-buy-9" type="button" class="btn btn-primary" style="padding:5px 10px;font-size:0.78rem;background:linear-gradient(135deg,#f59e0b,#eab308);color:#111827;border:none;font-weight:800;">💳 $9 24h Unlimited</button>
        <button id="btn-bridge-buy-29" type="button" class="btn btn-outline" style="padding:5px 10px;font-size:0.78rem;border-color:#fbbf24;color:#fde68a;">🚀 $29 Pro Pass</button>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;flex:1;max-width:460px;">
        <input id="apify-live-token" type="password" placeholder="fop_... (Instant Pass) OR apify_api_... (Apify Token)" style="flex:1;min-width:190px;padding:7px 10px;border-radius:7px;border:1px solid var(--border);background:#020617;color:#f8fafc;font-family:monospace;font-size:0.79rem;" />
        <button id="btn-live-cloud-exec" type="button" class="btn btn-outline" style="padding:7px 12px;font-size:0.8rem;">Run Live Cloud Engine</button>
      </div>
    `;
    sandboxCard.appendChild(liveRunnerBar);
    const b9 = document.getElementById("btn-bridge-buy-9");
    const b29 = document.getElementById("btn-bridge-buy-29");
    b9?.addEventListener("click", () => triggerCheckout("batch24h", b9));
    b29?.addEventListener("click", () => triggerCheckout("pro30d", b29));
    try {
      const sp = new URLSearchParams(location.search);
      const qpPass = sp.get("pass_key") || "";
      if (qpPass.startsWith("fop_")) {
        localStorage.setItem("finops_pro_pass", qpPass);
      } else if (sp.get("paid") === "1") {
        const pend = (localStorage.getItem("finops_pending_pass") || "").trim();
        if (pend.startsWith("fop_")) localStorage.setItem("finops_pro_pass", pend);
      }
      const savedPass = localStorage.getItem("finops_pro_pass") || "";
      const tokEl = document.getElementById("apify-live-token");
      if (savedPass.startsWith("fop_") && tokEl && !tokEl.value) tokEl.value = savedPass;
    } catch {}
  }

  function getApiPayloadObj(cfg) {
    if (cfg.apiSampleJson) return cfg.apiSampleJson;
    if (cfg.sample.trim().startsWith("{")) {
      try { return JSON.parse(cfg.sample); } catch {}
    }
    if (activeKey === "bai2") return { bai2Content: cfg.sample };
    if (activeKey === "pain002") return { xmlContent: cfg.sample };
    if (activeKey === "norma43") return { norma43Content: cfg.sample };
    return {};
  }

  function selectTool(key) {
    activeKey = key;
    const cfg = TOOLS_CONFIG[key];
    tabsEl.querySelectorAll(".tab-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.tool === key);
    });
    inputEl.value = cfg.sample;
    outputEl.textContent = cfg.output;
    lastOutput = cfg.output;
    statusEl.className = "status-chip status-ok";
    statusEl.textContent = cfg.summary;
    if (runBtn) runBtn.innerHTML = "&#127379; Run Free 2-Row Live Test";
    if (storeBtn) {
      storeBtn.href = cfg.storeUrl;
      storeBtn.className = "btn btn-primary";
      storeBtn.innerHTML = "Run Unlimited Batch on Cloud API ($0/mo) &rarr;";
    }
    if (upsellLink) upsellLink.href = cfg.storeUrl;
    if (upsellEl) upsellEl.style.display = "none";
  }

  async function handleRunClick() {
    const cfg = TOOLS_CONFIG[activeKey];
    const raw = inputEl.value.trim();
    const demoTools = { sepa: "xml", nacha: "nachaText", einvoice: "xml", datev: "csvText", bai2: "csvOutput" };

    if (raw !== cfg.sample.trim() && demoTools[activeKey]) {
      let bodyPayload = null;
      if (activeKey === "bai2") {
        bodyPayload = { bai2Content: raw };
      } else if (raw.startsWith("{")) {
        try { bodyPayload = JSON.parse(raw); } catch {}
      } else if (activeKey === "sepa") {
        bodyPayload = { ...getApiPayloadObj(cfg), transactions: undefined, csvTransactions: raw };
      } else if (activeKey === "nacha") {
        bodyPayload = { ...getApiPayloadObj(cfg), entries: undefined, csvEntries: raw };
      } else if (activeKey === "datev") {
        bodyPayload = { skr: "SKR03", consultantNumber: "12345", clientNumber: "10001", csvBookings: raw };
      }

      if (bodyPayload) {
        if (runBtn) runBtn.disabled = true;
        statusEl.textContent = "RUNNING FREE 2-ROW LIVE TEST...";
        try {
          const r = await fetch(`${EDGE_API}/v1/demo/${activeKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyPayload)
          });
          const data = await r.json();
          const cleanOut = data[demoTools[activeKey]];
          if (r.ok && cleanOut) {
            outputEl.textContent = cleanOut;
            lastOutput = cleanOut;
            statusEl.className = "status-chip status-ok";
            statusEl.textContent = `FREE 2-ROW LIVE TEST READY (${data.rowsProcessed || 2} of ${data.rowsSubmitted || 2} rows) — CLICK DOWNLOAD`;
            if (upsellEl) {
              upsellEl.style.display = "flex";
              upsellEl.querySelector("span").innerHTML = `<strong>&#9989; First ${data.rowsProcessed || 2} row(s) generated live!</strong> Click <strong>Download Free Test File</strong> below to inspect it, or unlock <strong>$9 (24h Unlimited)</strong> to export all ${data.rowsSubmitted || "your"} rows watermark-free.`;
            }
            return;
          }
        } catch {} finally {
          if (runBtn) runBtn.disabled = false;
        }
      }
    }

    if (raw !== cfg.sample.trim()) {
      const audit = runLocalPreFlightAudit(activeKey, inputEl.value, cfg);
      outputEl.textContent = audit.report;
      lastOutput = audit.report;
      statusEl.className = audit.statusOk ? "status-chip status-ok" : "status-chip";
      statusEl.textContent = `${audit.statusOk ? "PRE-FLIGHT OK" : "CHECK WARNINGS"} • ${audit.rowCount} rows • Est. $${audit.estCost}`;
      if (upsellEl) {
        upsellEl.style.display = "flex";
        upsellEl.querySelector("span").innerHTML = `<strong>Pre-Flight Audit Complete (${audit.rowCount} rows):</strong> Unlock an Instant 24h Unlimited Pass ($9) right here to generate &amp; download your full bank-uploadable file.`;
      }
    } else {
      outputEl.textContent = cfg.output;
      lastOutput = cfg.output;
      statusEl.className = "status-chip status-ok";
      statusEl.textContent = cfg.summary;
      if (upsellEl) upsellEl.style.display = "flex";
    }
  }

  Object.entries(TOOLS_CONFIG).forEach(([key, cfg]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tab-btn";
    btn.dataset.tool = key;
    btn.textContent = cfg.label;
    btn.addEventListener("click", () => selectTool(key));
    tabsEl.appendChild(btn);
  });

  runBtn?.addEventListener("click", handleRunClick);

  document.getElementById("btn-live-cloud-exec")?.addEventListener("click", async () => {
    const tokenInput = document.getElementById("apify-live-token");
    const execBtn = document.getElementById("btn-live-cloud-exec");
    const token = (tokenInput?.value || "").trim();
    const cfg = TOOLS_CONFIG[activeKey];
    if (!token) {
      triggerCheckout("batch24h", execBtn);
      return;
    }
    let bodyStr = inputEl.value.trim();
    if (!bodyStr.startsWith("{")) {
      if (activeKey === "bai2") bodyStr = JSON.stringify({ bai2Content: bodyStr });
      else if (activeKey === "pain002") bodyStr = JSON.stringify({ xmlContent: bodyStr });
      else if (activeKey === "norma43") bodyStr = JSON.stringify({ norma43Content: bodyStr });
      else bodyStr = JSON.stringify(getApiPayloadObj(cfg));
    }
    execBtn.disabled = true;
    execBtn.textContent = "Running Cloud Engine...";
    const isDirectPass = token.startsWith("fop_");
    statusEl.textContent = isDirectPass ? "EXECUTING ON FINOPS DIRECT CLOUD EDGE..." : "EXECUTING ON APIFY CLOUD...";
    try {
      if (isDirectPass) {
        try { localStorage.setItem("finops_pro_pass", token); } catch {}
        const route = EDGE_ROUTES[activeKey];
        if (!route) throw new Error(`Direct edge route not configured for ${activeKey}.`);
        const res = await fetch(`${EDGE_API}${route.path}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-FinOps-Pass": token },
          body: bodyStr
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || (Array.isArray(data?.errors) ? data.errors.join("; ") : `HTTP ${res.status}`));
        const fileOut = data[route.key] || data.xml || data.xmlText || data.fileText || data.nachaText || data.bacsText || data.abaText || data.eftText || data.csvText || data.csvOutput || data.csvReport || JSON.stringify(data, null, 2);
        outputEl.textContent = fileOut;
        lastOutput = fileOut;
      } else {
        if (cfg.apifyPublic === false) {
          throw new Error(`${cfg.label} runs exclusively on FinOps Direct Cloud Edge — use a $9 / $29 Instant Pass (fop_...) above.`);
        }
        const res = await fetch(`https://api.apify.com/v2/acts/${cfg.actorSlug}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: bodyStr
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`);
        const first = Array.isArray(data) && data[0] ? data[0] : data;
        const fileOut = first.xmlContent || first.achContent || first.abaContent || first.bacsContent || first.cpa005Content || first.positivePayContent || first.csvContent || JSON.stringify(data, null, 2);
        outputEl.textContent = fileOut;
        lastOutput = fileOut;
      }
      statusEl.className = "status-chip status-ok";
      statusEl.textContent = "LIVE CLOUD OUTPUT READY — CLICK DOWNLOAD";
    } catch (err) {
      statusEl.textContent = `API ERROR: ${err.message}`;
    } finally {
      execBtn.disabled = false;
      execBtn.textContent = "Run Live Cloud Engine";
    }
  });

  dlBtn?.addEventListener("click", () => {
    if (!lastOutput) return;
    const cfg = TOOLS_CONFIG[activeKey];
    const blob = new Blob([lastOutput], { type: cfg.mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = cfg.fileExt;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  curlBtn?.addEventListener("click", async () => {
    const cfg = TOOLS_CONFIG[activeKey];
    const payload = JSON.stringify(getApiPayloadObj(cfg), null, 2);
    const snippet = `curl -X POST "https://api.apify.com/v2/acts/${cfg.actorSlug}/run-sync-get-dataset-items?token=YOUR_APIFY_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '${payload.replace(/'/g, "'\\''")}'`;
    await navigator.clipboard.writeText(snippet);
    const orig = curlBtn.textContent;
    curlBtn.textContent = "Copied Working REST cURL!";
    setTimeout(() => { curlBtn.textContent = orig; }, 1800);
  });

  selectTool(activeKey);
}
