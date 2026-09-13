"""Voice-clone fraud warning sender (Telegram Bot API).

When the detection engine flags a live call as likely synthetic, this
sends a Telegram message to the person on the call with three buttons:
report to cyber crime, report to bank, and "it's okay, this is really
them".
"""

from __future__ import annotations

import argparse
import sys

from _client import api_call

ALERT_TEXT = """\
⚠️ Possible voice-clone alert

The call you are on may be using an AI-generated voice.

Do NOT share OTPs, account numbers, passwords, or any personal details. Do NOT approve any payment or transaction on this call.

Verify independently — hang up and call the person back on a number you already have.

Use the buttons below to report this call, or confirm if it's genuinely someone you know."""

REPORT_CYBERCRIME_URL = "https://email-tau-six.vercel.app/report-fraud"
REPORT_BANK_URL = "https://email-tau-six.vercel.app/report-fraud-bank"
SAFE_CONFIRM_CALLBACK_DATA = "safe_confirm"

REPLY_MARKUP = {
    "inline_keyboard": [
        [{"text": "🚨 Report Cyber Crime", "url": REPORT_CYBERCRIME_URL}],
        [{"text": "🏦 Report to Bank", "url": REPORT_BANK_URL}],
        [
            {
                "text": "✅ It's okay, this is really them",
                "callback_data": SAFE_CONFIRM_CALLBACK_DATA,
            }
        ],
    ]
}


def send_voice_clone_alert(chat_id: str | int, dry_run: bool = False) -> int | None:
    """Send the voice-clone Telegram warning to `chat_id`.

    Args:
        chat_id: the recipient's Telegram chat_id (see get_chat_id.py).
        dry_run: if True, don't call Telegram at all — just print the
            payload and return None.

    Returns:
        The sent message's message_id on success, or None if dry_run.

    Raises:
        RuntimeError: with a plain-language explanation on failure.
    """
    if dry_run:
        return None

    result = api_call(
        "sendMessage",
        {
            "chat_id": chat_id,
            "text": ALERT_TEXT,
            "reply_markup": REPLY_MARKUP,
        },
    )
    return result["message_id"]


def _build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "Send (or preview) the voice-clone Telegram fraud alert. "
            "Defaults to --dry-run."
        )
    )
    parser.add_argument("chat_id", help="Recipient's Telegram chat_id")
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument(
        "--dry-run",
        action="store_true",
        default=True,
        help="Print the message payload instead of sending it (default).",
    )
    mode.add_argument(
        "--send",
        action="store_true",
        help="Actually send via Telegram. Overrides the --dry-run default.",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = _build_arg_parser()
    args = parser.parse_args(argv)

    dry_run = not args.send

    if dry_run:
        print(f"[DRY RUN] Would send to chat_id: {args.chat_id}")
        print("[DRY RUN] Text:")
        print(ALERT_TEXT)
        print("[DRY RUN] Buttons:")
        for row in REPLY_MARKUP["inline_keyboard"]:
            for button in row:
                target = button.get("url") or f"callback:{button.get('callback_data')}"
                print(f"  - {button['text']} -> {target}")
        return 0

    try:
        message_id = send_voice_clone_alert(args.chat_id, dry_run=False)
    except RuntimeError as exc:
        print(str(exc), file=sys.stderr)
        return 1

    print(f"Sent. Message ID: {message_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
