"""One-shot helper to discover a recipient's Telegram chat_id.

Telegram bots can only message users by chat_id, not phone number, and
only after that user has messaged the bot at least once (e.g. /start).

Usage:
    1. Have the recipient send any message (e.g. /start) to your bot.
    2. Run: python get_chat_id.py
    3. It prints each sender's name and chat_id from recent messages.
"""

from __future__ import annotations

from _client import api_call


def main() -> int:
    updates = api_call("getUpdates", {"timeout": 0})

    if not updates:
        print(
            "No recent messages found. Have the recipient send /start to "
            "your bot on Telegram, then run this again."
        )
        return 0

    seen = {}
    for update in updates:
        message = update.get("message")
        if not message:
            continue
        chat = message["chat"]
        name = chat.get("username") or chat.get("first_name") or "(unknown)"
        seen[chat["id"]] = name

    print("Recent senders:")
    for chat_id, name in seen.items():
        print(f"  chat_id={chat_id}  name={name}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
