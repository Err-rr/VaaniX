/**
 * Fixed anchor time for all mock data. Using a hardcoded instant (rather than
 * Date.now()) keeps server-rendered and hydrated output identical and makes
 * the demo dataset reproducible.
 */
export const DEMO_NOW = new Date("2026-09-07T14:32:00+05:30");

export function minutesAgo(minutes: number): string {
  return new Date(DEMO_NOW.getTime() - minutes * 60_000).toISOString();
}

export function hoursAgo(hours: number): string {
  return new Date(DEMO_NOW.getTime() - hours * 60 * 60_000).toISOString();
}

export function daysAgo(days: number): string {
  return new Date(DEMO_NOW.getTime() - days * 24 * 60 * 60_000).toISOString();
}

export const ORGANIZATION = {
  id: "org_acme_fs",
  name: "Acme Financial Security",
  sector: "Banking" as const,
  plan: "Enterprise Plus" as const,
};

export const CURRENT_USER = {
  id: "usr_shivam",
  name: "Shivam Rao",
  email: "shivam@youngfoundersschool.com",
  role: "SOC Analyst" as const,
  initials: "SR",
};

/** Simple seeded PRNG (mulberry32) so bulk mock data is deterministic. */
export function createSeededRandom(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const INDIAN_CALLER_NUMBERS = [
  "+91 98450 12281",
  "+91 90192 34821",
  "+91 88991 17712",
  "+91 99201 55093",
  "+91 78221 90344",
  "+91 96543 21012",
  "+91 81234 56789",
  "+91 70123 44821",
  "+91 93456 78123",
  "+91 91827 36455",
  "+91 89012 33445",
  "+91 97123 88112",
  "+91 99887 66120",
  "+91 92233 44556",
  "+91 90011 22334",
];

export const EMPLOYEE_NAMES = [
  { name: "Arjun Mehta", role: "Chief Financial Officer", department: "Finance" },
  { name: "Rina Kapoor", role: "VP, Treasury", department: "Finance" },
  { name: "Sameer Iyer", role: "Branch Manager", department: "Retail Banking" },
  { name: "Devika Nair", role: "Head of Compliance", department: "Compliance" },
  { name: "Karan Bhatt", role: "Regional Director", department: "Operations" },
  { name: "Ananya Rao", role: "Chief Executive Officer", department: "Executive" },
  { name: "Vikram Sethi", role: "Head of Payments", department: "Payments" },
];

export const CUSTOMER_NAMES = [
  "Rohan Sharma", "Priya Verma", "Aditya Kulkarni", "Neha Joshi", "Manish Gupta",
  "Sunita Patil", "Rahul Deshmukh", "Kavita Reddy", "Amit Chawla", "Pooja Malhotra",
  "Suresh Menon", "Divya Pillai", "Nikhil Bansal", "Shreya Agarwal", "Vivek Chandra",
];

export const ANALYSTS = [
  "Shivam Rao", "Ishaan Kulkarni", "Meera Krishnan", "Farhan Ali", "Tanvi Deshpande",
];
