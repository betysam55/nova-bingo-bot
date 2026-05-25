import logging
import os
import sys

from dotenv import load_dotenv

load_dotenv()

TELEGRAM_BOT_TOKEN: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

_ALLOWED_LOG_LEVELS = {"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"}


def validate_config() -> None:
    if not TELEGRAM_BOT_TOKEN or TELEGRAM_BOT_TOKEN == "your-bot-token-here":
        logging.error(
            "TELEGRAM_BOT_TOKEN is not set. Create a .env file with your bot token from @BotFather."
        )
        sys.exit(1)


def _resolve_log_level() -> int:
    """Return a valid log level, falling back to INFO for unrecognised values."""
    value = LOG_LEVEL.upper()
    if value not in _ALLOWED_LOG_LEVELS:
        return logging.INFO
    return getattr(logging, value)


def setup_logging() -> None:
    logging.basicConfig(
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        level=_resolve_log_level(),
    )
    logging.getLogger("httpx").setLevel(logging.WARNING)
