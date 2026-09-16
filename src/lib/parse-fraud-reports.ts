import type { FraudReport, RawEmail } from "@/types/fraud-report";

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** True for an unfilled template placeholder like "[YOUR FULL NAME]" or "[AMOUNT]". */
function isPlaceholder(value: string): boolean {
  return /^\[.*\]$/.test(value);
}

/**
 * Pulls one labeled field out of the complaint-template body, e.g.
 * "Name: vandit" -> "vandit". Anchored to the start of a line, so
 * "Mobile Number:" can never accidentally match inside "Suspected Mobile
 * Number:" (that line starts with "Suspected", not "Mobile") — order of the
 * two labels in the body doesn't matter.
 */
function extractField(body: string, label: string): string {
  const pattern = new RegExp(`^\\s*${escapeRegExp(label)}:\\s*(.+)$`, "im");
  const value = body.match(pattern)?.[1]?.trim();
  if (!value || isPlaceholder(value)) return "—";
  return value;
}

/**
 * The bank template's account line is prefixed with whichever bank the
 * sender named (e.g. "Canara Bank Account / Customer ID:") — match the
 * "Account / Customer ID" suffix so this isn't hardcoded to one bank.
 */
function extractBankAccount(body: string): string {
  const value = body.match(/^.*Account\s*\/\s*Customer ID:\s*(.+)$/im)?.[1]?.trim();
  if (!value || isPlaceholder(value)) return "—";
  return value;
}

/** The optional "An amount of approximately ₹[AMOUNT] was debited/transferred..." line. */
function extractAmount(body: string): string {
  const value = body.match(/₹\s*([\d,]+(?:\.\d+)?)/)?.[1]?.trim();
  return value ? `₹${value}` : "—";
}

/**
 * Parses the fixed complaint-letter templates (cybercrime + bank variants)
 * used in public/emails.json into structured fraud reports. Fields only
 * present in the bank variant (bankAccount, amountLost, transactionId)
 * fall back to "—" for the cybercrime variant, which doesn't have them.
 */
export function parseFraudReports(emails: RawEmail[]): FraudReport[] {
  return emails.map((email, i) => ({
    id: `FR-${(i + 1).toString().padStart(4, "0")}`,
    reporterName: extractField(email.body, "Name"),
    reporterMobile: extractField(email.body, "Mobile Number"),
    reporterEmail: extractField(email.body, "Email ID"),
    suspectedMobile: extractField(email.body, "Suspected Mobile Number"),
    dateOfIncident: extractField(email.body, "Date of Incident"),
    approxTime: extractField(email.body, "Approximate Time"),
    bankAccount: extractBankAccount(email.body),
    amountLost: extractAmount(email.body),
    transactionId: extractField(email.body, "Transaction ID/UTR"),
    subject: email.subject,
    from: email.from,
  }));
}
