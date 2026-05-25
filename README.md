# Nova Bingo AI Assistant 🎰

A Telegram bot for the Nova Bingo real-time multiplayer Bingo platform. Built with Python and [python-telegram-bot](https://github.com/python-telegram-bot/python-telegram-bot).

## Features

- **Telegram Mini App** — full Bingo game UI with lobby, board selection, live number calling, and win verification
- **14 slash commands** — `/start`, `/help`, `/howtoplay`, `/play`, `/rules`, `/deposit`, `/withdraw`, `/balance`, `/jackpot`, `/bonus`, `/activegames`, `/mytickets`, `/support`, `/responsiblegaming`
- **AI-style chat** — responds to natural-language questions about gameplay, wallets, rules, and more
- **Casino-style personality** — friendly, fast, exciting, and professional
- **Responsible gaming** — promotes safe play in every interaction

## Quick Start

### Prerequisites

- Python 3.10+
- A Telegram bot token from [@BotFather](https://t.me/BotFather)

### Setup

```bash
# Clone the repo
git clone https://github.com/betysam55/nova-bingo-bot.git
cd nova-bingo-bot

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your TELEGRAM_BOT_TOKEN
```

### Run

```bash
python -m src.bot
```

## Project Structure

```
nova-bingo-bot/
├── src/
│   ├── bot.py              # Entry point
│   ├── config.py           # Configuration & env vars
│   ├── handlers/
│   │   ├── commands.py     # /start, /help, /play, etc.
│   │   ├── messages.py     # AI chat handler
│   │   └── errors.py       # Error handler
│   └── utils/
│       └── responses.py    # All response templates
├── webapp/
│   ├── index.html           # Mini App entry point
│   ├── css/style.css        # Styles (dark casino theme)
│   └── js/game.js           # Game logic & Telegram WebApp API
├── .env.example
├── requirements.txt
├── pyproject.toml
└── README.md
```

## Mini App

The `webapp/` directory contains the Telegram Mini App — a complete Bingo game UI that runs inside Telegram.

### Features
- **Lobby** — browse rooms by bet amount (Bronze, Silver, Gold, Diamond)
- **Board Selection** — pick from 4 unique randomly generated boards
- **Live Game** — auto number calling, board marking, real-time stats
- **Win Verification** — validates marked numbers against called numbers
- **Responsive** — dark casino theme optimized for mobile

### Hosting

The Mini App must be served over **HTTPS**. Options:
1. **GitHub Pages** — push `webapp/` to a `gh-pages` branch
2. **Vercel / Netlify** — deploy the `webapp/` directory
3. **Any static hosting** — just serve the files over HTTPS

Once hosted, set `WEBAPP_URL` in `.env` to the URL (e.g. `https://yourdomain.com/webapp/`).

## Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome message |
| `/help` | List all commands |
| `/howtoplay` | Step-by-step guide |
| `/play` | Join a game room |
| `/rules` | Full game rules |
| `/deposit` | Add funds |
| `/withdraw` | Cash out winnings |
| `/balance` | Check balance |
| `/jackpot` | Jackpot info |
| `/bonus` | Bonus patterns |
| `/activegames` | See live games |
| `/mytickets` | View tickets |
| `/support` | Get help |
| `/responsiblegaming` | Safe play tips |

## Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather | Yes |
| `WEBAPP_URL` | HTTPS URL where the Mini App is hosted | No (enables "Open Nova Bingo" button) |
| `LOG_LEVEL` | Logging level (DEBUG, INFO, WARNING, ERROR) | No (default: INFO) |

## License

MIT
