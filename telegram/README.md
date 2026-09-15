# Voice-Clone Telegram Alert

## 1. Set your bot token

```bash
export TELEGRAM_BOT_TOKEN="your real token from @BotFather"
```
→ ⚠️ Never hardcode this in `_client.py` again — a previous version did
exactly that, the token ended up committed to git history, and had to be
rotated via @BotFather (message it, `/mybots` → your bot → API Token →
Revoke current token) as a result.

## 2. Send /start to the bot

1. In Telegram, search for **@Prevent_Scambot**.
2. Open the chat and send `/start` (or any message).

## 3. Run the files

```bash
# Get the chat_id of whoever just messaged the bot
python get_chat_id.py

# Preview the alert (no send)
python alerts.py <chat_id>

# Actually send it
python alerts.py <chat_id> --send

# (optional, in a separate terminal) reply when the "it's okay" button is tapped
python bot_listener.py
```
