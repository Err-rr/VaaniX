/** One complaint email parsed from public/emails.json (see src/lib/parse-fraud-reports.ts). */
export interface FraudReport {
  id: string;
  reporterName: string;
  reporterMobile: string;
  reporterEmail: string;
  suspectedMobile: string;
  dateOfIncident: string;
  approxTime: string;
  bankAccount: string;
  amountLost: string;
  transactionId: string;
  subject: string;
  from: string;
}

export interface RawEmail {
  from: string;
  subject: string;
  body: string;
}
