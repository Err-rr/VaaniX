/** One complaint email parsed from public/emails.json (see src/lib/parse-fraud-reports.ts). */
export interface FraudReport {
  id: string;
  reporterName: string;
  reporterMobile: string;
  suspectedMobile: string;
  dateOfIncident: string;
  subject: string;
  from: string;
}

export interface RawEmail {
  from: string;
  subject: string;
  body: string;
}
