---
name: testing-nova-bingo-bot
description: Test the Nova Bingo Telegram bot end-to-end. Use when verifying bot commands, AI chat responses, or configuration changes.
---

# Testing Nova Bingo Bot

## Devin Secrets Needed
- `TELEGRAM_BOT_TOKEN` — Bot token from @BotFather (repo-scoped secret)

## Setup

1. Install dependencies:
   ```bash
   cd /home/ubuntu/repos/nova-bingo-bot
   pip install -r requirements.txt
   ```

2. Create `.env` file with the bot token:
   ```bash
   echo "TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}" > .env
   echo "LOG_LEVEL=INFO" >> .env
   ```

3. Start the bot:
   ```bash
   python -m src.bot &
   ```
   - Verify logs show "Application started" and "Registered 14 command handlers"
   - If you see `Conflict: terminated by other getUpdates request`, kill other bot instances first: `pkill -f 'python -m src.bot'`

## Testing Approach

This is a **shell-only test** — no browser recording needed. Telegram Web requires phone number login, so test handler logic directly via Python scripts.

### Key Test Areas

1. **Bot Connectivity** — Call `https://api.telegram.org/bot{token}/getMe` and verify `ok=true`, `is_bot=true`
2. **Command Registration** — Import `COMMAND_MAP` from `src.handlers.commands`, verify 14 entries, all callable
3. **AI Keyword Matching** — Import `find_response` from `src.handlers.messages`, test with spec phrases:
   - `"How do I play?"` → should contain `"Choose your bet amount"`
   - `"My game disconnected"` → should contain `"reconnect"`
   - `"What is Jackpot?"` → should contain `"prize pool"`
4. **Case Insensitivity** — Test uppercase/mixed-case inputs don't return fallback
5. **Fallback Response** — Random/empty input should return `FALLBACK_RESPONSE`
6. **Security** — Scan all response templates for leaked tokens, API keys, database info
7. **Config Validation** — Verify `validate_config()` calls `sys.exit(1)` for empty/placeholder tokens

### Linting

```bash
ruff check src/
ruff format --check src/
```

## Common Issues

- **Conflict error on startup**: Another bot instance is using the same token. Kill it with `pkill -f 'python -m src.bot'` and wait 2 seconds before restarting.
- **"password" in responses**: The login/security responses mention "no extra passwords needed" — this is intentional reassurance, not a security leak.
- **No CI configured**: This repo has no GitHub Actions. Lint manually with `ruff`.
