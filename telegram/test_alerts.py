"""Tests for alerts.py. Telegram's api_call is fully mocked — no live calls."""

from __future__ import annotations

from unittest.mock import patch

import alerts


# --- message content ---------------------------------------------------


def test_message_does_not_contain_raw_urls_in_text():
    # URLs live in buttons now, not as plain-text links in the body.
    assert "http" not in alerts.ALERT_TEXT


def test_reply_markup_has_exactly_three_buttons():
    rows = alerts.REPLY_MARKUP["inline_keyboard"]
    buttons = [button for row in rows for button in row]
    assert len(buttons) == 3


def test_cybercrime_button_url():
    rows = alerts.REPLY_MARKUP["inline_keyboard"]
    button = rows[0][0]
    assert button["url"] == alerts.REPORT_CYBERCRIME_URL
    assert alerts.REPORT_CYBERCRIME_URL == "https://email-tau-six.vercel.app/report-fraud"


def test_bank_button_url():
    rows = alerts.REPLY_MARKUP["inline_keyboard"]
    button = rows[1][0]
    assert button["url"] == alerts.REPORT_BANK_URL
    assert alerts.REPORT_BANK_URL == "https://email-tau-six.vercel.app/report-fraud-bank"


def test_safe_confirm_button_uses_callback_not_url():
    rows = alerts.REPLY_MARKUP["inline_keyboard"]
    button = rows[2][0]
    assert button["callback_data"] == alerts.SAFE_CONFIRM_CALLBACK_DATA
    assert "url" not in button


# --- send_voice_clone_alert ------------------------------------------------


@patch("alerts.api_call")
def test_send_calls_telegram_with_chat_id_text_and_markup(mock_api_call):
    mock_api_call.return_value = {"message_id": 55}

    message_id = alerts.send_voice_clone_alert(12345, dry_run=False)

    assert message_id == 55
    method, payload = mock_api_call.call_args[0]
    assert method == "sendMessage"
    assert payload["chat_id"] == 12345
    assert payload["text"] == alerts.ALERT_TEXT
    assert payload["reply_markup"] == alerts.REPLY_MARKUP


@patch("alerts.api_call")
def test_dry_run_does_not_call_telegram(mock_api_call):
    result = alerts.send_voice_clone_alert(12345, dry_run=True)

    assert result is None
    mock_api_call.assert_not_called()


@patch("alerts.api_call")
def test_send_propagates_runtime_error(mock_api_call):
    mock_api_call.side_effect = RuntimeError("[Telegram error] boom")

    try:
        alerts.send_voice_clone_alert(12345, dry_run=False)
        assert False, "expected RuntimeError"
    except RuntimeError as exc:
        assert "boom" in str(exc)
