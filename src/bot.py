"""Nova Bingo AI Assistant — Telegram Bot entry point."""

import logging

from telegram.ext import ApplicationBuilder

from src.config import TELEGRAM_BOT_TOKEN, setup_logging, validate_config
from src.handlers import error_handler, register_command_handlers, register_message_handlers

logger = logging.getLogger(__name__)


def main() -> None:
    setup_logging()
    validate_config()

    logger.info("Starting Nova Bingo Bot...")

    application = ApplicationBuilder().token(TELEGRAM_BOT_TOKEN).build()

    register_command_handlers(application)
    register_message_handlers(application)
    application.add_error_handler(error_handler)

    logger.info("Bot is running. Press Ctrl+C to stop.")
    application.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    main()
