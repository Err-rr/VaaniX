import type { FraudReport, RawEmail } from "@/types/fraud-report";

/** Pulls one field out of the bank-complaint template body, e.g. "Name: vandit" -> "vandit". */
function extractField(body: string, label: string): string {
  const match = body.match(new RegExp(`${label}:\\s*(.+)`, "i"));
  return match?.[1]?.trim() || "—";
}

/**
 * Parses the fixed complaint-letter template used in public/emails.json into
 * structured fraud reports. The template always has the reporter's own
 * "Mobile Number" before the fraudster's "Suspected Mobile Number", so the
 * two labels never collide.
 */
export function parseFraudReports(emails: RawEmail[]): FraudReport[] {
  return emails.map((email, i) => ({
    id: `FR-${(i + 1).toString().padStart(4, "0")}`,
    reporterName: extractField(email.body, "Name"),
    reporterMobile: extractField(email.body, "Mobile Number"),
    suspectedMobile: extractField(email.body, "Suspected Mobile Number"),
    dateOfIncident: extractField(email.body, "Date of Incident"),
    subject: email.subject,
    from: email.from,
  }));
}
