"""
pipeline.py + a Telegram alert, in one run: record from BlackHole -> save WAV
-> detect -> save + print the verdict -> if it's a real (non-stub) SPOOF
result, send the voice-clone warning to TELEGRAM_CHAT_ID.

This is intentionally a separate file from pipeline.py, not a modification
of it — pipeline.py stays usable on its own, with zero Telegram dependency,
for anyone who just wants detection without alerting.

Setup (see telegram/README.md for the Telegram side in full):
    1. Message @Prevent_Scambot on Telegram, send /start
    2. cd ../telegram && python get_chat_id.py   -> gives you a chat_id
    3. export TELEGRAM_BOT_TOKEN="..."            (from @BotFather)
    4. export TELEGRAM_CHAT_ID="..."               (from step 2)

Usage:
    python pipeline_with_alerts.py
    VOICE_DETECTION_STUB=1 python pipeline_with_alerts.py
        -> runs normally, but never sends a real Telegram message: stub
           scores are random, not a real detection, so alerting on one
           would just be spam. See the stub check below.
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path

from capture import record_sample
from model_runner import run_detection

# alerts.py lives in a sibling directory and does `from _client import
# api_call` internally — a same-directory import that only resolves if
# telegram/ itself is on sys.path, not just the repo root. This must happen
# before the import below.
TELEGRAM_DIR = Path(__file__).parent.parent / "telegram"
sys.path.insert(0, str(TELEGRAM_DIR))

from alerts import send_voice_clone_alert  # noqa: E402  (see sys.path note above)

TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "")

# Alert fires when spoof_prob exceeds this — a separate knob from
# model_runner.py's own 50% SPOOF/REAL classification cutoff, so alerting
# sensitivity can be tuned here without touching that file.
# 0.0 for now: alerts on essentially every non-stub run, since spoof_prob is
# almost never exactly 0%. This is deliberately maximally sensitive for
# testing the Telegram path itself — raise it (e.g. to 70 or 80) once you
# want alerts only on confident spoof calls, not near-every detection.
ALERT_THRESHOLD_PERCENT = 0.0


def main() -> None:
    wav_path = record_sample()

    print(f"[pipeline] sending {wav_path.name} to the model...")
    result = run_detection(wav_path)

    result_with_meta = {
        **result,
        "wav_file": wav_path.name,
        "timestamp": datetime.now().isoformat(),
    }

    result_path = wav_path.with_suffix(".json")
    result_path.write_text(json.dumps(result_with_meta, indent=2))

    print(f"\n{'='*50}")
    print("VERDICT")
    print(f"{'='*50}")
    if result["stub"]:
        print("⚠️  STUB MODE — this score is random, not a real detection")
    icon = "🚨" if "SPOOF" in result["classification"] else "✅"
    print(f"{icon} {result['classification']}  (confidence: {result['confidence']:.2f}%)")
    print(f"    Real:  {result['real_prob']:.2f}%")
    print(f"    Spoof: {result['spoof_prob']:.2f}%")
    print(f"{'='*50}")
    print(f"Audio saved:  {wav_path}")
    print(f"Result saved: {result_path}")

    should_alert = result["spoof_prob"] > ALERT_THRESHOLD_PERCENT

    if result["stub"]:
        if should_alert:
            print("\n[alert] over threshold in stub mode — not sending a "
                  "real Telegram alert for a random score.")
        return

    if not should_alert:
        return

    if not TELEGRAM_CHAT_ID:
        print(f"\n[alert] spoof_prob {result['spoof_prob']:.2f}% is over the "
              f"{ALERT_THRESHOLD_PERCENT}% threshold, but TELEGRAM_CHAT_ID is "
              "not set — no alert sent. See this file's docstring for setup.")
        return

    print(f"\n[alert] spoof_prob {result['spoof_prob']:.2f}% is over the "
          f"{ALERT_THRESHOLD_PERCENT}% threshold — sending Telegram alert to "
          f"{TELEGRAM_CHAT_ID}...")
    try:
        message_id = send_voice_clone_alert(TELEGRAM_CHAT_ID, dry_run=False)
        print(f"[alert] sent (message_id={message_id})")
    except RuntimeError as exc:
        # A Telegram outage or bad token shouldn't erase the detection you
        # already got and already saved above — just report it and move on.
        print(f"[alert] WARNING: failed to send Telegram alert: {exc}")


if __name__ == "__main__":
    main()
