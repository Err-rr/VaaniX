"""Tests for _client.py. The HTTP layer (_http_post) is fully mocked."""

from __future__ import annotations

import json
import urllib.error
from unittest.mock import patch

import pytest

import _client


@pytest.fixture(autouse=True)
def fake_token(monkeypatch):
    monkeypatch.setattr(_client, "TELEGRAM_BOT_TOKEN", "123:fake-token")


def _ok_response(result):
    return json.dumps({"ok": True, "result": result}).encode("utf-8")


@patch("_client._http_post")
def test_api_call_returns_result_on_success(mock_post):
    mock_post.return_value = _ok_response({"message_id": 42})

    result = _client.api_call("sendMessage", {"chat_id": 1, "text": "hi"})

    assert result == {"message_id": 42}


def test_api_call_rejects_placeholder_token(monkeypatch):
    monkeypatch.setattr(_client, "TELEGRAM_BOT_TOKEN", "<YOUR_BOT_TOKEN_HERE>")

    with pytest.raises(RuntimeError) as exc_info:
        _client.api_call("sendMessage", {"chat_id": 1, "text": "hi"})

    assert "placeholder" in str(exc_info.value)


@patch("_client._http_post")
def test_api_call_translates_chat_not_found(mock_post):
    mock_post.return_value = json.dumps(
        {"ok": False, "description": "Bad Request: chat not found"}
    ).encode("utf-8")

    with pytest.raises(RuntimeError) as exc_info:
        _client.api_call("sendMessage", {"chat_id": 999, "text": "hi"})

    assert "must send /start" in str(exc_info.value)


@patch("_client._http_post")
def test_api_call_translates_bot_blocked(mock_post):
    mock_post.return_value = json.dumps(
        {"ok": False, "description": "Forbidden: bot was blocked by the user"}
    ).encode("utf-8")

    with pytest.raises(RuntimeError) as exc_info:
        _client.api_call("sendMessage", {"chat_id": 999, "text": "hi"})

    assert "blocked this bot" in str(exc_info.value)


@patch("_client._http_post")
def test_api_call_translates_unauthorized_http_error(mock_post):
    http_error = urllib.error.HTTPError(
        url="https://api.telegram.org/fake",
        code=401,
        msg="Unauthorized",
        hdrs=None,
        fp=None,
    )
    http_error.read = lambda: json.dumps(
        {"ok": False, "description": "Unauthorized"}
    ).encode("utf-8")
    mock_post.side_effect = http_error

    with pytest.raises(RuntimeError) as exc_info:
        _client.api_call("sendMessage", {"chat_id": 1, "text": "hi"})

    assert "401" in str(exc_info.value)
    assert "invalid or missing" in str(exc_info.value)


@patch("_client._http_post")
def test_api_call_falls_back_to_raw_description(mock_post):
    mock_post.return_value = json.dumps(
        {"ok": False, "description": "Something else went wrong"}
    ).encode("utf-8")

    with pytest.raises(RuntimeError) as exc_info:
        _client.api_call("sendMessage", {"chat_id": 1, "text": "hi"})

    assert "Something else went wrong" in str(exc_info.value)
