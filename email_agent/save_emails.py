"""
Fetches the 10 most recent incoming emails and saves them to the frontend's
public/emails.json (sender's address, subject, body). Overwrites that file
each run with the current snapshot — it does not accumulate history across
runs. Writing straight into public/ means the Next.js app always serves
whatever this script last fetched, with no separate copy step.

Usage:
    python save_emails.py
"""

import json
import os

from email_connector import fetch_emails

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
OUTPUT_PATH = os.path.join(PROJECT_ROOT, 'public', 'emails.json')


def main():
    emails = fetch_emails()

    with open(OUTPUT_PATH, 'w') as f:
        json.dump(emails, f, indent=2)

    print(f"Saved {len(emails)} emails to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
