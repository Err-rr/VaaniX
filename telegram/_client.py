"""Shared low-level Telegram Bot API client.

Uses only the standard library (urllib) so no extra pip install is needed
beyond what's already available. Used by alerts.py, bot_listener.py, and
get_chat_id.py.

Credentials are hardcoded here for local hackathon-demo convenience.
DO NOT commit real values — keep this file out of git once filled in.
"""

from __future__ import annotations

import json
import urllib.error
import urllib.request

# --- Telegram bot token (from @BotFather) -----------------------------
# Replace with your real token. Never commit the real value.
TELEGRAM_BOT_TOKEN = "8899838034:AAFGAB66I6aEVCOPuGuCjguYACLTexhDXas"

API_BASE = "https://api.telegram.org/bot{token}/{method}"


def _is_placeholder() -> bool:
    return not TELEGRAM_BOT_TOKEN or TELEGRAM_BOT_TOKEN == "<YOUR_BOT_TOKEN_HERE>"


def _describe_error(status: int | None, body: dict | None, exc: Exception | None = None) -> str:
    description = (body or {}).get("description", "") if body else ""

    if status == 401 or "Unauthorized" in description:
        return (
            "[Telegram error 401] Bot token is invalid or missing. Edit "
            "_client.py and set TELEGRAM_BOT_TOKEN to your real token from "
            "@BotFather."
        )
    if "chat not found" in description.lower():
        return (
            "[Telegram error] Chat not found. The recipient must send "
            "/start to your bot at least once before you can message them "
            "— run get_chat_id.py after they do to confirm their chat_id."
        )
    if "bot was blocked by the user" in description.lower():
        return (
            "[Telegram error 403] The recipient has blocked this bot. They "
            "need to unblock it and send /start again."
        )
    if description:
        return f"[Telegram error] {description}"
    if exc is not None:
        return f"[Telegram error] Request failed: {exc}"
    return "[Telegram error] Unknown error."


def _http_post(url: str, payload: dict) -> bytes:
    """Thin wrapper around urlopen so tests can mock a single point."""
    data = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        url, data=data, headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(request, timeout=15) as response:
        return response.read()


def api_call(method: str, payload: dict | None = None) -> dict:
    """Call a Telegram Bot API method and return the parsed 'result'.

    Raises RuntimeError with a plain-language message on failure.
    """
    if _is_placeholder():
        raise RuntimeError(
            "[Telegram error] TELEGRAM_BOT_TOKEN is still a placeholder. "
            "Edit _client.py and fill in your real bot token from "
            "@BotFather."
        )

    url = API_BASE.format(token=TELEGRAM_BOT_TOKEN, method=method)

    try:
        raw = _http_post(url, payload or {})
    except urllib.error.HTTPError as exc:
        try:
            body = json.loads(exc.read().decode("utf-8"))
        except Exception:
            body = None
        raise RuntimeError(_describe_error(exc.code, body, exc)) from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(_describe_error(None, None, exc)) from exc

    body = json.loads(raw.decode("utf-8"))
    if not body.get("ok"):
        raise RuntimeError(_describe_error(None, body))

    return body.get("result")
