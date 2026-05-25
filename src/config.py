import logging
import os
import sys

from dotenv import load_dotenv

load_dotenv()

TELEGRAM_BOT_TOKEN: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")


def validate_config() -> None:
    if not TELEGRAM_BOT_TOKEN or TELEGRAM_BOT_TOKEN == "your-bot-token-here":
        logging.error(
            "TELEGRAM_BOT_TOKEN is not set. Create a .env file with your bot token from @BotFather."
        )
        sys.exit(1)


def setup_logging() -> None:
    logging.basicConfig(
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        level=getattr(logging, LOG_LEVEL.upper(), logging.INFO),
    )
    logging.getLogger("httpx").setLevel(logging.WARNING)
