# Voice-Clone Telegram Alert

## 1. Send /start to the bot

1. In Telegram, search for **@Prevent_Scambot**.
2. Open the chat and send `/start` (or any message).

## 2. Run the files

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
