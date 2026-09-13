"""Long-polling listener that replies when someone taps the "it's okay,
this is really them" button on a voice-clone alert.

No Flask, no webhook, no ngrok — this just repeatedly calls Telegram's
getUpdates and reacts to callback_query updates locally. Run it in a
terminal during your demo; Ctrl+C to stop.

    python bot_listener.py
"""

from __future__ import annotations

import time

from _client import api_call
from alerts import SAFE_CONFIRM_CALLBACK_DATA

SAFE_CONFIRM_REPLY_TEXT = (
    "We're sorry for the inconvenience — thanks for confirming this call "
    "was genuine. Stay safe!"
)

POLL_TIMEOUT_SECONDS = 30


def handle_update(update: dict) -> None:
    """Process a single Telegram update. Only reacts to our callback button."""
    callback_query = update.get("callback_query")
    if not callback_query:
        return
    if callback_query.get("data") != SAFE_CONFIRM_CALLBACK_DATA:
        return

    chat_id = callback_query["message"]["chat"]["id"]

    api_call("answerCallbackQuery", {"callback_query_id": callback_query["id"]})
    api_call(
        "sendMessage",
        {"chat_id": chat_id, "text": SAFE_CONFIRM_REPLY_TEXT},
    )


def run_forever() -> None:
    print("Listening for button taps (Ctrl+C to stop)...")
    offset = None
    while True:
        params = {"timeout": POLL_TIMEOUT_SECONDS}
        if offset is not None:
            params["offset"] = offset

        try:
            updates = api_call("getUpdates", params)
        except RuntimeError as exc:
            print(str(exc))
            time.sleep(5)
            continue

        for update in updates:
            offset = update["update_id"] + 1
            try:
                handle_update(update)
            except RuntimeError as exc:
                print(f"Skipping update {update['update_id']}: {exc}")


if __name__ == "__main__":
    try:
        run_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
